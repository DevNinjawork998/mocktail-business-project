import { PrismaClient as BundledPrismaClient } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

type PrismaClientConstructor = typeof import("@prisma/client").PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * Cached constructor. Cleared when we bust require.cache so `npx prisma generate`
 * is picked up without restarting Node (Next may otherwise keep a stale PrismaClient shape).
 */
let cachedPrismaClientClass: PrismaClientConstructor | null = null;

/** One attempt to reload @prisma/client from disk if delegates (e.g. passwordResetToken) are missing. */
let prismaStaleDelegateHealAttempted = false;

function loadPrismaClientClass(): PrismaClientConstructor {
  if (cachedPrismaClientClass) {
    return cachedPrismaClientClass;
  }

  if (typeof require !== "undefined") {
    try {
      const mod = require("@prisma/client") as typeof import("@prisma/client");
      cachedPrismaClientClass = mod.PrismaClient;
      return mod.PrismaClient;
    } catch {
      // Fall through to bundled client (e.g. some edge bundles)
    }
  }

  cachedPrismaClientClass = BundledPrismaClient;
  return BundledPrismaClient;
}

function bustPrismaClientRequireCache(): void {
  cachedPrismaClientClass = null;
  if (typeof require === "undefined" || !require.cache) {
    return;
  }
  const cache = require.cache as Record<string, unknown>;
  for (const key of Object.keys(cache)) {
    if (
      key.includes("node_modules") &&
      (key.includes("@prisma/client") || key.includes(".prisma/client"))
    ) {
      delete cache[key];
    }
  }
}

/**
 * Ensures the connection string uses sslmode=verify-full to suppress the
 * pg-connection-string security warning about 'require'/'prefer'/'verify-ca'
 * being treated as aliases for 'verify-full'.
 */
function ensureVerifyFullSsl(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode");
    if (sslmode && sslmode !== "verify-full" && sslmode !== "disable") {
      url.searchParams.set("sslmode", "verify-full");
      return url.toString();
    }
    return connectionString;
  } catch {
    return connectionString;
  }
}

function createPrismaClient(): PrismaClient {
  const PrismaClientLocal = loadPrismaClientClass();

  // Priority 1: Direct PostgreSQL connection (works for both build and runtime)
  const directPostgresUrl = process.env.POSTGRES_URL || process.env.DIRECT_URL;

  if (
    directPostgresUrl &&
    (directPostgresUrl.startsWith("postgres://") ||
      directPostgresUrl.startsWith("postgresql://"))
  ) {
    // Reuse existing pool if available
    const pool =
      globalForPrisma.pool ??
      new Pool({
        connectionString: ensureVerifyFullSsl(directPostgresUrl),
        max: parseInt(process.env.POSTGRES_POOL_MAX || "3", 10), // Reduced for hosted DB limits
        idleTimeoutMillis: 5000, // Close idle clients after 5 seconds
        connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
      });

    if (!globalForPrisma.pool) {
      globalForPrisma.pool = pool;
    }

    const adapter = new PrismaPg(pool);
    return new PrismaClientLocal({ adapter });
  }

  // Priority 2: Check DATABASE_URL for direct PostgreSQL connection
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Direct PostgreSQL connection
    if (
      databaseUrl.startsWith("postgresql://") ||
      databaseUrl.startsWith("postgres://")
    ) {
      // Reuse existing pool if available
      const pool =
        globalForPrisma.pool ??
        new Pool({
          connectionString: ensureVerifyFullSsl(databaseUrl),
          max: parseInt(process.env.POSTGRES_POOL_MAX || "3", 10), // Reduced for hosted DB limits
          idleTimeoutMillis: 5000, // Close idle clients after 5 seconds
          connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
        });

      if (!globalForPrisma.pool) {
        globalForPrisma.pool = pool;
      }

      const adapter = new PrismaPg(pool);
      return new PrismaClientLocal({ adapter });
    }

    // Prisma Accelerate: prisma:// or prisma+postgres://
    if (
      databaseUrl.startsWith("prisma://") ||
      databaseUrl.startsWith("prisma+postgres://")
    ) {
      // Use standard PrismaClient - it will read DATABASE_URL from environment
      return new PrismaClientLocal({
        log:
          process.env.NODE_ENV === "development"
            ? ["error", "warn"]
            : ["error"],
      });
    }

    // SQLite: file://
    if (databaseUrl.startsWith("file:")) {
      const adapter = new PrismaLibSql({ url: databaseUrl });
      return new PrismaClientLocal({ adapter });
    }
  }

  // Priority 3: Check PRISMA_DATABASE_URL for Accelerate
  const prismaAccelerateUrl = process.env.PRISMA_DATABASE_URL;
  if (prismaAccelerateUrl) {
    // Set DATABASE_URL to Accelerate URL for Prisma Client
    process.env.DATABASE_URL = prismaAccelerateUrl;
    return new PrismaClientLocal({
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // If no valid database URL is found
  const isBuildTime =
    process.env.NEXT_PHASE === "phase-production-build" ||
    (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV);

  throw new Error(
    `DATABASE_URL, POSTGRES_URL, DIRECT_URL, or PRISMA_DATABASE_URL environment variable is required. ` +
      `Please set it to your PostgreSQL connection string (postgres://...), Prisma Accelerate URL (prisma://... or prisma+postgres://...), or SQLite (file:...). ` +
      `${isBuildTime ? "This error occurred during build - make sure the database URL is set in Vercel's environment variables and marked as 'Available during build'." : ""}`,
  );
}

// Lazy initialization - only create client when actually accessed, not at module load time
// This prevents build-time errors when DATABASE_URL is not available during static analysis
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    // During build time, if no DATABASE_URL is available, create a minimal client
    // that won't be used (Next.js static analysis won't execute the code)
    const hasDatabaseUrl =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.DIRECT_URL ||
      process.env.PRISMA_DATABASE_URL;

    if (!hasDatabaseUrl) {
      // During build/static generation, if we don't have a database URL,
      // throw an error that can be caught by the calling code
      // This prevents the module from creating an invalid client
      throw new Error(
        "DATABASE_URL, POSTGRES_URL, DIRECT_URL, or PRISMA_DATABASE_URL environment variable is required. " +
          "Please set it to your PostgreSQL connection string (postgres://...), Prisma Accelerate URL (prisma://... or prisma+postgres://...), or SQLite (file:...)",
      );
    }

    globalForPrisma.prisma = createPrismaClient();

    // Graceful shutdown: disconnect Prisma on process termination
    // Only register in Node.js runtime (not Edge Runtime)
    // Edge Runtime statically analyzes code, so we need to avoid referencing process.on
    // Check if we're NOT in Edge Runtime before attempting to use process.on
    if (
      typeof process !== "undefined" &&
      process.env.NEXT_RUNTIME !== "edge" &&
      typeof (process as { on?: unknown }).on === "function"
    ) {
      // Use type assertion to avoid static analysis issues
      const processWithOn = process as {
        on: (event: string, callback: () => Promise<void>) => void;
      };
      processWithOn.on("beforeExit", async () => {
        await globalForPrisma.prisma?.$disconnect();
      });
    }
  }

  // Singleton may reference an old PrismaClient class (pre–`prisma generate`). Reload from disk once.
  if (
    globalForPrisma.prisma &&
    !prismaStaleDelegateHealAttempted &&
    Reflect.get(globalForPrisma.prisma, "passwordResetToken", globalForPrisma.prisma) ===
      undefined
  ) {
    prismaStaleDelegateHealAttempted = true;
    void globalForPrisma.prisma.$disconnect().catch(() => {});
    bustPrismaClientRequireCache();
    globalForPrisma.prisma = createPrismaClient();

    if (
      Reflect.get(globalForPrisma.prisma, "passwordResetToken", globalForPrisma.prisma) ===
      undefined
    ) {
      console.error(
        "[prisma] `passwordResetToken` is still missing on PrismaClient. Run `npx prisma generate`, apply migrations, then restart `next dev` so the server loads the new client.",
      );
    }
  }

  return globalForPrisma.prisma;
}

// Export prisma with lazy initialization using a Proxy
// This ensures the client is only created when actually accessed (e.g., prisma.product.findMany())
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    // Reflect.get invokes PrismaClient getters correctly (bracket access can miss some setups).
    const value = Reflect.get(client, prop, client);
    // If it's a function, bind it to the client to preserve 'this' context
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
}) as PrismaClient;
