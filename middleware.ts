import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for enforcing HTTPS in production.
 *
 * Note: Security headers are configured in next.config.ts headers() function,
 * which applies them to ALL routes (pages, API, static files, images).
 * This middleware only handles HTTPS redirection.
 *
 * Authentication is handled separately by src/proxy.ts (Next.js 16 Proxy).
 */
export function middleware(request: NextRequest): NextResponse {
  // Force HTTPS redirect in production (Vercel sets x-forwarded-proto header)
  const protocol = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");

  if (
    process.env.NODE_ENV === "production" &&
    protocol === "http" &&
    host
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
