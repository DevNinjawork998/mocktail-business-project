import path from "node:path";
import { defineConfig } from "prisma/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env.production.local (or .env.prod.local for backwards compatibility) if it exists
const envProdFile = resolve(__dirname, "../.env.production.local");
const envProdFileLegacy = resolve(__dirname, "../.env.prod.local");
// Try .env.production.local first, then fall back to .env.prod.local
const envFileToLoad = envProdFile;
try {
  const envContent = readFileSync(envFileToLoad, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=\s]+)\s*=\s*(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim();
      }
    }
  });
} catch (_e) {
  // Try legacy file if .env.production.local doesn't exist
  try {
    const envContent = readFileSync(envProdFileLegacy, "utf-8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const match = trimmed.match(/^([^=\s]+)\s*=\s*(.*)$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2].trim();
        }
      }
    });
  } catch (_e2) {
    // Neither file exists, that's okay
  }
}

// Determine the database URL based on environment
const getDatabaseUrl = () => {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    return dbUrl;
  }
  // Default to SQLite for development
  return "file:./dev.db";
};

const dbUrl = getDatabaseUrl();
if (!dbUrl || dbUrl === "file:./dev.db") {
  console.warn("Warning: No DATABASE_URL or POSTGRES_URL found, using SQLite default");
}

export default defineConfig({
  schema: path.join(__dirname, "schema.prisma"),
  datasource: {
    url: dbUrl,
  },
});

