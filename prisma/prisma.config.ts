import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { resolve } from "node:path";

// Load environment variables from .env files in order of priority
// dotenv will automatically load .env.local, .env.development.local, etc.
// Silently fail if files don't exist (they won't in production)
try {
  config({ path: resolve(__dirname, "../.env.local") });
} catch {}
try {
  config({ path: resolve(__dirname, "../.env.development.local") });
} catch {}
try {
  config({ path: resolve(__dirname, "../.env.production.local") });
} catch {}
try {
  config({ path: resolve(__dirname, "../.env.prod.local") }); // Legacy
} catch {}
try {
  config({ path: resolve(__dirname, "../.env") });
} catch {}

// Determine the database URL based on environment
const getDatabaseUrl = () => {
  // Check environment variables first (may be set externally via export)
  // Then check loaded from .env files
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DIRECT_URL;

  if (dbUrl) {
    // SQLite URLs are valid and should be accepted for migrations
    if (dbUrl.startsWith("file:")) {
      return dbUrl;
    }

    // If it's a Prisma Accelerate URL, try to find a direct URL for migrations
    if (dbUrl.startsWith("prisma://") || dbUrl.startsWith("prisma+")) {
      const directUrl = process.env.POSTGRES_URL || process.env.DIRECT_URL;
      if (
        directUrl &&
        !directUrl.startsWith("prisma://") &&
        !directUrl.startsWith("prisma+")
      ) {
        return directUrl;
      }
      // Return Accelerate URL if no direct URL found (migrations will need --url flag)
      return dbUrl;
    }

    // PostgreSQL or other database URLs
    return dbUrl;
  }

  // During build time (Vercel or Next.js build phase), don't throw
  // Prisma generate doesn't need a real database URL - it just generates types
  const isBuildTime =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.VERCEL === "1" ||
    process.env.CI === "true";

  if (isBuildTime) {
    // Return a placeholder during build - Prisma generate will work fine
    // Actual migrations should be run separately with proper DATABASE_URL
    return "file:./dev.db";
  }

  // Default to SQLite for development - SQLite is fully supported for migrations
  return "file:./dev.db";
};

const dbUrl = getDatabaseUrl();

// Never throw during config loading - Prisma generate doesn't need a real DB
// Migrations will handle their own errors when actually run

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: dbUrl,
  },
});
