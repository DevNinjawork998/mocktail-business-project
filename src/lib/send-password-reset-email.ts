import { Resend } from "resend";

interface SendPasswordResetEmailParams {
  to: string;
  resetUrl: string;
}

/** Resend test domain; use your verified domain in production, e.g. `Mocktail <noreply@yourdomain.com>`. */
const DEFAULT_RESEND_FROM = "Mocktail Admin <onboarding@resend.dev>";

/**
 * Loose check for Resend's allowed `from` shapes: `email@domain` or `Name <email@domain>`.
 */
function isPlausibleResendFrom(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  // Name <email@example.com>
  const bracket = /^[^<]*<([^>]+)>$/;
  const m = trimmed.match(bracket);
  const emailPart = (m ? m[1] : trimmed).trim();
  return /^[^\s<>]+@[^\s<>]+\.[^\s<>]+$/i.test(emailPart);
}

function resolveResendFrom(): string {
  const raw = process.env.RESEND_FROM_EMAIL?.trim();
  if (!raw) {
    return DEFAULT_RESEND_FROM;
  }
  if (isPlausibleResendFrom(raw)) {
    return raw.trim();
  }
  console.warn(
    "[password-reset] RESEND_FROM_EMAIL is missing or invalid (use email@domain.com or Name <email@domain.com>). Using default onboarding@resend.dev.",
  );
  return DEFAULT_RESEND_FROM;
}

/**
 * Sends the reset link via Resend when RESEND_API_KEY is set.
 * In development without a key, logs the URL to the server console.
 *
 * Env: RESEND_API_KEY, RESEND_FROM_EMAIL (e.g. "Mocktail <noreply@yourdomain.com>").
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: SendPasswordResetEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = resolveResendFrom();

  if (apiKey) {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: "Reset your password",
      html: `
        <p>You requested a password reset for your admin account.</p>
        <p><a href="${resetUrl}">Choose a new password</a></p>
        <p>If the button does not work, copy this link into your browser:</p>
        <p style="word-break:break-all;">${resetUrl}</p>
        <p>This link expires in one hour. If you did not request this, you can ignore this email.</p>
      `,
    });
    if (error) {
      throw new Error(error.message);
    }
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[password-reset] RESEND_API_KEY is not set. Dev-only reset link:",
      resetUrl,
    );
    return;
  }

  console.error(
    "[password-reset] RESEND_API_KEY is not set; cannot send email in production.",
  );
}
