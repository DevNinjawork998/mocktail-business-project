#!/usr/bin/env tsx

/**
 * Script to create the Settings table in the database
 * Run with: npx tsx scripts/create-settings-table.ts
 * 
 * Note: Requires DATABASE_URL, POSTGRES_URL, DIRECT_URL, or PRISMA_DATABASE_URL
 * to be set in your environment or .env.local file
 */

// Load environment variables
import { config } from "dotenv";
import { resolve } from "path";

// Load .env files in order of priority
try {
  config({ path: resolve(__dirname, "../.env.local") });
} catch {}
try {
  config({ path: resolve(__dirname, "../.env") });
} catch {}

import { prisma } from "../src/lib/prisma";

async function createSettingsTable() {
  try {
    console.log("Creating Settings table...");

    // Create the settings table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "value" TEXT,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedById" TEXT,
        CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
      )
    `);

    // Create unique index on key
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "settings_key_key" ON "settings"("key")
    `);

    console.log("✅ Settings table created successfully!");
    console.log("You can now use Prisma Studio without errors.");
  } catch (error) {
    console.error("❌ Error creating Settings table:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createSettingsTable();
