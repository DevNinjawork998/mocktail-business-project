"use server";

import { prisma } from "@/lib/prisma";
import {
  generatePasswordResetTokenRaw,
  hashPasswordResetToken,
} from "@/lib/password-reset-crypto";
import { getPublicAppUrl } from "@/lib/public-app-url";
import { sendPasswordResetEmail } from "@/lib/send-password-reset-email";
import bcrypt from "bcryptjs";
import { z } from "zod";

const NEUTRAL_RESET_MESSAGE =
  "If an account exists for this email, we sent password reset instructions.";

const THROTTLE_MS = 2 * 60 * 1000;
const TOKEN_TTL_MS = 60 * 60 * 1000;

type RequestResetResult =
  | { success: true; data: { message: string } }
  | { success: false; error: string };

type ResetWithTokenResult =
  | { success: true }
  | { success: false; error: string };

function looksLikeBcryptHash(password: string): boolean {
  return (
    password.length > 0 &&
    (password.startsWith("$2a$") ||
      password.startsWith("$2b$") ||
      password.startsWith("$2y$"))
  );
}

const requestEmailSchema = z.string().trim().email("Invalid email address");

const resetWithTokenSchema = z.object({
  token: z.string().min(1, "Reset link is invalid or expired."),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * Public: request a password reset email. Same response whether or not the user exists.
 */
export async function requestPasswordReset(
  email: string,
): Promise<RequestResetResult> {
  const parsed = requestEmailSchema.safeParse(email);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid email",
    };
  }

  const trimmed = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: trimmed },
    });

    const genericSuccess: RequestResetResult = {
      success: true,
      data: { message: NEUTRAL_RESET_MESSAGE },
    };

    if (!user || !looksLikeBcryptHash(user.password)) {
      return genericSuccess;
    }

    const recent = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        createdAt: { gt: new Date(Date.now() - THROTTLE_MS) },
      },
    });
    if (recent) {
      return genericSuccess;
    }

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const rawToken = generatePasswordResetTokenRaw();
    const tokenHash = hashPasswordResetToken(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const baseUrl = getPublicAppUrl();
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

    try {
      await sendPasswordResetEmail({ to: user.email, resetUrl });
    } catch (err) {
      console.error("Password reset email failed:", err);
    }

    return genericSuccess;
  } catch (error) {
    console.error("requestPasswordReset error:", error);
    return {
      success: true,
      data: { message: NEUTRAL_RESET_MESSAGE },
    };
  }
}

/**
 * Public: set a new password using a one-time token from the email link.
 */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<ResetWithTokenResult> {
  const parsed = resetWithTokenSchema.safeParse({
    token,
    password: newPassword,
  });
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: msg };
  }

  const tokenHash = hashPasswordResetToken(parsed.data.token);
  const now = new Date();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const row = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
      });

      if (!row || row.usedAt !== null || row.expiresAt <= now) {
        return { ok: false as const };
      }

      const hashed = await bcrypt.hash(parsed.data.password, 12);

      await tx.user.update({
        where: { id: row.userId },
        data: { password: hashed },
      });

      await tx.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: now },
      });

      await tx.session.deleteMany({
        where: { userId: row.userId },
      });

      return { ok: true as const };
    });

    if (!result.ok) {
      return {
        success: false,
        error: "This reset link is invalid or has expired. Request a new one.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("resetPasswordWithToken error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
