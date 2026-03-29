/**
 * Canonical public site URL for links in emails (password reset, etc.).
 * Prefer NEXTAUTH_URL; fall back to Vercel preview URL or localhost.
 */
export function getPublicAppUrl(): string {
  const fromEnv = process.env.NEXTAUTH_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}
