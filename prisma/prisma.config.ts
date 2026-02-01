import path from "node:path";
import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { resolve } from "node:path";

// Load environment variables from .env files in order of priority
// dotenv will automatically load .env.local, .env.development.local, etc.
config({ path: resolve(__dirname, "../.env.local") });
config({ path: resolve(__dirname, "../.env.development.local") });
config({ path: resolve(__dirname, "../.env.production.local") });
config({ path: resolve(__dirname, "../.env.prod.local") }); // Legacy
config({ path: resolve(__dirname, "../.env") });

// Determine the database URL based on environment
const getDatabaseUrl = () => {
  // Check environment variables first (may be set externally via export)
  // Then check loaded from .env files
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DIRECT_URL;
  if (dbUrl && dbUrl !== "file:./dev.db" && !dbUrl.startsWith("prisma://") && !dbUrl.startsWith("prisma+")) {
    return dbUrl;
  }
  // Default to SQLite for development
  return "file:./dev.db";
};

const dbUrl = getDatabaseUrl();
if (!dbUrl || dbUrl === "file:./dev.db") {
  console.warn("Warning: No DATABASE_URL, POSTGRES_URL, or DIRECT_URL found, using SQLite default");
  console.warn("For migrations, set DATABASE_URL to your direct PostgreSQL connection string");
}

// Ensure we have a valid URL for migrations
if (!dbUrl || dbUrl === "file:./dev.db") {
  throw new Error(
    "DATABASE_URL, POSTGRES_URL, or DIRECT_URL must be set for migrations. " +
    "Please set one of these environment variables to your PostgreSQL connection string."
  );
}

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: dbUrl,
  },
});

