import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
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
        connectionString: directPostgresUrl,
        max: parseInt(process.env.POSTGRES_POOL_MAX || "3", 10), // Reduced for hosted DB limits
        idleTimeoutMillis: 5000, // Close idle clients after 5 seconds
        connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
      });

    if (!globalForPrisma.pool) {
      globalForPrisma.pool = pool;
    }

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
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
          connectionString: databaseUrl,
          max: parseInt(process.env.POSTGRES_POOL_MAX || "3", 10), // Reduced for hosted DB limits
          idleTimeoutMillis: 5000, // Close idle clients after 5 seconds
          connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
        });

      if (!globalForPrisma.pool) {
        globalForPrisma.pool = pool;
      }

      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    }

    // Prisma Accelerate: prisma:// or prisma+postgres://
    if (
      databaseUrl.startsWith("prisma://") ||
      databaseUrl.startsWith("prisma+postgres://")
    ) {
      // Use standard PrismaClient - it will read DATABASE_URL from environment
      return new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["error", "warn"]
            : ["error"],
      });
    }

    // SQLite: file://
    if (databaseUrl.startsWith("file:")) {
      const adapter = new PrismaLibSql({ url: databaseUrl });
      return new PrismaClient({ adapter });
    }
  }

  // Priority 3: Check PRISMA_DATABASE_URL for Accelerate
  const prismaAccelerateUrl = process.env.PRISMA_DATABASE_URL;
  if (prismaAccelerateUrl) {
    // Set DATABASE_URL to Accelerate URL for Prisma Client
    process.env.DATABASE_URL = prismaAccelerateUrl;
    return new PrismaClient({
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
      `${isBuildTime ? "This error occurred during build - make sure the database URL is set in Vercel's environment variables and marked as 'Available during build'." : ""}`
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

    if (
      !hasDatabaseUrl &&
      process.env.NODE_ENV === "production" &&
      typeof window === "undefined"
    ) {
      // During build, if we don't have a database URL, we can't create a real client
      // But we'll create a dummy one that will fail gracefully when actually used
      // This prevents the module from throwing during static analysis
      throw new Error(
        "DATABASE_URL, POSTGRES_URL, DIRECT_URL, or PRISMA_DATABASE_URL environment variable is required. " +
          "Please set it to your PostgreSQL connection string (postgres://...), Prisma Accelerate URL (prisma://... or prisma+postgres://...), or SQLite (file:...)"
      );
    }

    globalForPrisma.prisma = createPrismaClient();

    // Graceful shutdown: disconnect Prisma on process termination
    if (typeof process !== "undefined") {
      process.on("beforeExit", async () => {
        await globalForPrisma.prisma?.$disconnect();
      });
    }
  }
  return globalForPrisma.prisma;
}

// Export prisma with lazy initialization using a Proxy
// This ensures the client is only created when actually accessed (e.g., prisma.product.findMany())
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    // Use unknown first to avoid type errors, then check the actual value
    const value = (client as unknown as Record<string, unknown>)[prop as string];
    // If it's a function, bind it to the client to preserve 'this' context
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
}) as PrismaClient;
