import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for adding security headers to all responses.
 * Security headers help establish trust with security scanners and protect against common attacks.
 *
 * Note: Authentication is handled separately by src/proxy.ts (Next.js 16 Proxy).
 * This middleware only adds security headers.
 *
 * Required Security Headers (all implemented):
 * ✅ Content-Security-Policy - Prevents XSS attacks by controlling resource loading
 * ✅ X-Frame-Options: SAMEORIGIN - Prevents clickjacking (allows same-origin framing)
 * ✅ X-Content-Type-Options: nosniff - Prevents MIME sniffing attacks
 * ✅ Referrer-Policy - Controls referrer information sent with requests
 * ✅ Permissions-Policy - Restricts access to browser features and APIs
 *
 * Why security headers matter:
 * - Security scanners (like McAfee WebAdvisor) flag sites without proper headers as "unknown"
 * - Headers protect against XSS, clickjacking, MIME sniffing, and other attacks
 * - They establish trust and improve your site's security reputation
 */
export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // Prevent clickjacking attacks - allow framing only from same origin
  // Recommended value: SAMEORIGIN (allows same-origin framing, blocks cross-origin)
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  // Prevent MIME type sniffing - browser must respect Content-Type header
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Enable XSS protection (legacy but still useful for older browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Strict Transport Security - force HTTPS connections
  // max-age: 1 year, includeSubDomains: apply to all subdomains, preload: eligible for HSTS preload
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Referrer Policy - control how much referrer information is sent
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy - restrict access to browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // Content Security Policy - prevent XSS and injection attacks
  // Includes domains for Stripe, UploadThing, Vercel Analytics, and other external services
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com https://vercel.live https://*.vercel-insights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.stripe.com https://api.stripe.com https://*.utfs.io https://*.ufs.sh https://*.vercel-insights.com https://*.vercel.com",
    "frame-src https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
