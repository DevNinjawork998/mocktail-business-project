import {
  requestPasswordReset,
  resetPasswordWithToken,
} from "@/app/actions/password-reset";
import { hashPasswordResetToken } from "@/lib/password-reset-crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    passwordResetToken: {
      findFirst: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("@/lib/send-password-reset-email", () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/public-app-url", () => ({
  getPublicAppUrl: jest.fn(() => "http://localhost:3000"),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedSend = sendPasswordResetEmail as jest.MockedFunction<
  typeof sendPasswordResetEmail
>;

describe("requestPasswordReset", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns validation error for invalid email", async () => {
    const result = await requestPasswordReset("not-an-email");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
    expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("returns neutral success when user is not found", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(null);

    const result = await requestPasswordReset("missing@example.com");

    expect(result).toEqual({
      success: true,
      data: {
        message:
          "If an account exists for this email, we sent password reset instructions.",
      },
    });
    expect(mockedPrisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(mockedSend).not.toHaveBeenCalled();
  });

  it("returns neutral success when user has no bcrypt password", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "oauth@example.com",
      password: "",
    } as Awaited<ReturnType<typeof prisma.user.findUnique>>);

    const result = await requestPasswordReset("oauth@example.com");

    expect(result.success).toBe(true);
    expect(mockedPrisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(mockedSend).not.toHaveBeenCalled();
  });

  it("creates token and sends email for credentials user", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "admin@example.com",
      password: "$2b$10$abcdefghijklmnopqrstuv", // bcrypt-shaped
    } as Awaited<ReturnType<typeof prisma.user.findUnique>>);

    mockedPrisma.passwordResetToken.findFirst.mockResolvedValue(null);
    mockedPrisma.passwordResetToken.deleteMany.mockResolvedValue({ count: 0 });
    mockedPrisma.passwordResetToken.create.mockResolvedValue({
      id: "t1",
      userId: "u1",
      tokenHash: "h",
      expiresAt: new Date(),
      usedAt: null,
      createdAt: new Date(),
    });

    const result = await requestPasswordReset("admin@example.com");

    expect(result.success).toBe(true);
    expect(mockedPrisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
    });
    expect(mockedPrisma.passwordResetToken.create).toHaveBeenCalled();
    expect(mockedSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "admin@example.com",
        resetUrl: expect.stringMatching(
          /^http:\/\/localhost:3000\/reset-password\?token=/,
        ),
      }),
    );
  });

  it("does not create a new token when throttled", async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: "u1",
      email: "admin@example.com",
      password: "$2b$10$abcdefghijklmnopqrstuv",
    } as Awaited<ReturnType<typeof prisma.user.findUnique>>);

    mockedPrisma.passwordResetToken.findFirst.mockResolvedValue({
      id: "recent",
      userId: "u1",
      tokenHash: "x",
      expiresAt: new Date(),
      usedAt: null,
      createdAt: new Date(),
    });

    const result = await requestPasswordReset("admin@example.com");

    expect(result.success).toBe(true);
    expect(mockedPrisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(mockedSend).not.toHaveBeenCalled();
  });
});

describe("resetPasswordWithToken", () => {
  const rawToken = "a".repeat(64);
  const tokenHash = hashPasswordResetToken(rawToken);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockTransactionWithRow(
    row: {
      id: string;
      userId: string;
      tokenHash: string;
      expiresAt: Date;
      usedAt: Date | null;
    } | null,
  ): void {
    const tx = {
      passwordResetToken: {
        findUnique: jest.fn().mockResolvedValue(row),
        update: jest.fn().mockResolvedValue({}),
      },
      user: {
        update: jest.fn().mockResolvedValue({}),
      },
      session: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
    };
    mockedPrisma.$transaction.mockImplementation(
      async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx),
    );
  }

  it("returns field error for short password", async () => {
    const result = await resetPasswordWithToken(rawToken, "12345");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("6");
    }
    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it("fails when token row is missing", async () => {
    mockTransactionWithRow(null);

    const result = await resetPasswordWithToken(rawToken, "newpass12");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/invalid|expired/i);
    }
  });

  it("fails when token was already used", async () => {
    mockTransactionWithRow({
      id: "t1",
      userId: "u1",
      tokenHash,
      expiresAt: new Date(Date.now() + 3600000),
      usedAt: new Date(),
    });

    const result = await resetPasswordWithToken(rawToken, "newpass12");

    expect(result.success).toBe(false);
  });

  it("fails when token is expired", async () => {
    mockTransactionWithRow({
      id: "t1",
      userId: "u1",
      tokenHash,
      expiresAt: new Date(Date.now() - 1000),
      usedAt: null,
    });

    const result = await resetPasswordWithToken(rawToken, "newpass12");

    expect(result.success).toBe(false);
  });

  it("updates password and invalidates sessions on success", async () => {
    const tx = {
      passwordResetToken: {
        findUnique: jest.fn().mockResolvedValue({
          id: "t1",
          userId: "u1",
          tokenHash,
          expiresAt: new Date(Date.now() + 3600000),
          usedAt: null,
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      user: {
        update: jest.fn().mockResolvedValue({}),
      },
      session: {
        deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    mockedPrisma.$transaction.mockImplementation(
      async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx),
    );

    const result = await resetPasswordWithToken(rawToken, "newpass12");

    expect(result.success).toBe(true);
    expect(tx.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { password: expect.any(String) },
    });
    expect(tx.passwordResetToken.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { usedAt: expect.any(Date) },
    });
    expect(tx.session.deleteMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
    });
  });
});
