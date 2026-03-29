/**
 * Script to seed the local database from a JSON backup file
 * Usage: npx tsx scripts/seed-from-backup.ts [path-to-json-file]
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";

// `.env` → cloud dev → `.env.local` wins (Docker / full local).
config({ path: resolve(__dirname, "../.env") });
config({ path: resolve(__dirname, "../.env.development.local") });
config({ path: resolve(__dirname, "../.env.local"), override: true });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const backupFilePath = process.argv[2] || "prisma/prod-backup-2026-02-14.json";
  
  try {
    console.log(`🔄 Reading backup file from: ${backupFilePath}`);
    
    // Read and parse the backup file
    const fileContent = readFileSync(resolve(__dirname, "..", backupFilePath), "utf-8");
    const backupData = JSON.parse(fileContent);
    
    console.log(`✅ Loaded backup created at: ${backupData.exportedAt || 'Unknown'}`);
    
    // Clear existing data (optional, but recommended for clean seed)
    console.log(`🧹 Clearing existing data...`);
    // Delete in reverse order of dependencies to avoid foreign key constraints
    await prisma.instagramPost.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.ingredient.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    // Leaving users alone to avoid wiping out dev admin accounts, or wipe them if preferred
    // await prisma.user.deleteMany();
    
    // Insert new data
    console.log(`🌱 Seeding data...`);
    
    if (backupData.products && backupData.products.length > 0) {
      await prisma.product.createMany({
        data: backupData.products,
        skipDuplicates: true,
      });
      console.log(`✅ Seeded ${backupData.products.length} products`);
    }
    
    if (backupData.ingredients && backupData.ingredients.length > 0) {
      await prisma.ingredient.createMany({
        data: backupData.ingredients,
        skipDuplicates: true,
      });
      console.log(`✅ Seeded ${backupData.ingredients.length} ingredients`);
    }
    
    if (backupData.testimonials && backupData.testimonials.length > 0) {
      await prisma.testimonial.createMany({
        data: backupData.testimonials,
        skipDuplicates: true,
      });
      console.log(`✅ Seeded ${backupData.testimonials.length} testimonials`);
    }
    
    if (backupData.instagramPosts && backupData.instagramPosts.length > 0) {
      await prisma.instagramPost.createMany({
        data: backupData.instagramPosts,
        skipDuplicates: true,
      });
      console.log(`✅ Seeded ${backupData.instagramPosts.length} Instagram posts`);
    }
    
    if (backupData.users && backupData.users.length > 0) {
      // For users, we might want to be careful not to overwrite local test users
      // so we use skipDuplicates
      await prisma.user.createMany({
        data: backupData.users,
        skipDuplicates: true,
      });
      console.log(`✅ Seeded ${backupData.users.length} users`);
    }

    console.log(`\n🎉 Database successfully seeded from backup!`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
