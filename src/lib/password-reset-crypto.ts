import { createHash, randomBytes } from "crypto";

export function hashPasswordResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}

export function generatePasswordResetTokenRaw(): string {
  return randomBytes(32).toString("hex");
}
