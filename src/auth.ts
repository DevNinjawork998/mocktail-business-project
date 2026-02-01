import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Extract callbacks from authConfig to merge with our own
const { callbacks: authConfigCallbacks, ...restAuthConfig } = authConfig;

// Using JWT strategy - works with both credentials and OAuth providers
// OAuth account linking is handled in signIn callback
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  ...restAuthConfig,
  callbacks: {
    // Include signIn callback from authConfig for OAuth account linking
    ...authConfigCallbacks,
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id ?? "";
        // For OAuth users, fetch role from database
        if (account?.provider !== "credentials") {
          try {
            const { prisma } = await import("@/lib/prisma");
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email ?? "" },
              select: { role: true },
            });
            token.role = dbUser?.role ?? "EDITOR";
          } catch {
            token.role = "EDITOR";
          }
        } else {
          token.role = user.role ?? "EDITOR";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
