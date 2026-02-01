import { auth } from "@/auth";

/**
 * Next.js 16 Proxy - runs on Node.js runtime by default.
 * Handles authentication checks for protected routes.
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
  }

  return;
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
