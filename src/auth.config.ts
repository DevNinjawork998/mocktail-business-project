import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) {
          return null;
        }

        const { email, password } = validated.data;

        // Dynamic imports to avoid issues with edge runtime
        const { prisma } = await import("@/lib/prisma");
        const bcrypt = (await import("bcryptjs")).default;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    // Only enable Google if credentials are properly configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Always allow credentials provider
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth providers, create/link user account
      if (!account || !account.provider || !user.email) {
        return true; // Allow sign-in if no account info
      }

      try {
        // Dynamic import to avoid edge runtime issues
        const { prisma } = await import("@/lib/prisma");
        
        // Check if user exists in database BEFORE allowing sign-in
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // Deny sign-in if user doesn't exist in database
        // User must be onboarded by SUPERADMIN first
        if (!existingUser) {
          console.warn(
            `OAuth login denied: User ${user.email} not found in database. Please contact admin to be onboarded.`
          );
          return false; // Deny sign-in - user must be created by SUPERADMIN first
        }

        // Link OAuth account to existing user
        try {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              access_token: account.access_token ?? null,
              expires_at: account.expires_at ?? null,
              token_type: account.token_type ?? null,
              scope: account.scope ?? null,
              id_token: account.id_token ?? null,
            },
            create: {
              userId: existingUser.id,
              type: account.type as string,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token ?? null,
              expires_at: account.expires_at ?? null,
              token_type: account.token_type ?? null,
              scope: account.scope ?? null,
              id_token: account.id_token ?? null,
            },
          });
        } catch (linkError) {
          // If linking fails, log but allow sign-in (account might already exist)
          console.warn("Failed to link OAuth account:", linkError);
        }

        return true; // Allow sign-in for existing users
      } catch (error) {
        console.error("OAuth signIn callback error:", error);
        // Deny sign-in if there's a critical error
        return false;
      }

      // Default: allow sign-in for other cases
      return true;
    },
  },
} satisfies NextAuthConfig;
