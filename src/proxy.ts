import { auth } from "@/auth";

/**
 * Next.js 16 Proxy - runs on Node.js runtime by default.
 * Handles authentication checks for protected routes.
 * 
 * Note: /login is NOT included in the matcher to avoid interfering with NextAuth's login flow.
 * The login page component handles redirecting authenticated users.
 */
export const proxy = auth((req) => {
  const pathname = req.nextUrl.pathname;
  
  // Skip proxy for API routes (including NextAuth routes)
  if (pathname.startsWith("/api/")) {
    return;
  }

  // Only protect dashboard routes
  const isAdminRoute = pathname.startsWith("/dashboard");
  
  if (isAdminRoute) {
    const isLoggedIn = !!req.auth;
    
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return Response.redirect(loginUrl);
    }
  }

  return;
});

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};
