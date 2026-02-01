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
  
  if (directPostgresUrl && 
      (directPostgresUrl.startsWith("postgres://") || directPostgresUrl.startsWith("postgresql://"))) {
    // Reuse existing pool if available
    const pool = globalForPrisma.pool ?? new Pool({
      connectionString: directPostgresUrl,
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
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
    if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) {
      // Reuse existing pool if available
      const pool = globalForPrisma.pool ?? new Pool({
        connectionString: databaseUrl,
        max: 10, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
      });
      
      if (!globalForPrisma.pool) {
        globalForPrisma.pool = pool;
      }
      
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    }

    // Prisma Accelerate: prisma:// or prisma+postgres://
    if (databaseUrl.startsWith("prisma://") || databaseUrl.startsWith("prisma+postgres://")) {
      // Use standard PrismaClient - it will read DATABASE_URL from environment
      return new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
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
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // If no valid database URL is found
  throw new Error(
    "DATABASE_URL, POSTGRES_URL, DIRECT_URL, or PRISMA_DATABASE_URL environment variable is required. " +
    "Please set it to your PostgreSQL connection string (postgres://...), Prisma Accelerate URL (prisma://... or prisma+postgres://...), or SQLite (file:...)"
  );
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always store in global to prevent multiple instances (especially important in development with hot reloading)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown: disconnect Prisma on process termination
if (typeof process !== "undefined") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}
