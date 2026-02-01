import { auth } from "@/auth";

/**
 * Next.js 16 Proxy - runs on Node.js runtime by default.
 * Handles authentication checks for protected routes.
<<<<<<< HEAD
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
=======
 */
export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = req.nextUrl.pathname === "/login";

  // Redirect to login if trying to access admin routes without authentication
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Redirect to dashboard if already logged in and trying to access login page
  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
>>>>>>> main
  }

  return;
});

export const config = {
<<<<<<< HEAD
  matcher: [
    "/dashboard/:path*",
  ],
=======
  matcher: ["/dashboard/:path*", "/login"],
>>>>>>> main
};
