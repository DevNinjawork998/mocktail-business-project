/**
 * Script to backup production database data to JSON
 * Usage: npx tsx scripts/backup-prod-db.ts
 */

import { config } from "dotenv";
import { resolve } from "path";
import { writeFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Ensures sslmode=verify-full to suppress the pg-connection-string security warning.
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

// Load environment variables
config({ path: resolve(__dirname, "../.env.local") });
config({ path: resolve(__dirname, "../.env.production.local") });
config({ path: resolve(__dirname, "../.env.prod.local") });
config({ path: resolve(__dirname, "../.env") });

// Use PostgreSQL adapter for production backup
const databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!databaseUrl) {
  console.error(
    "❌ Error: DATABASE_URL or DIRECT_URL environment variable is required",
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString: ensureVerifyFullSsl(databaseUrl),
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("🔄 Starting production database backup...");

    // Fetch all data from production database
    const [products, ingredients, testimonials, instagramPosts, users] =
      await Promise.all([
        prisma.product.findMany({
          orderBy: { id: "asc" },
        }),
        prisma.ingredient.findMany({
          orderBy: { id: "asc" },
        }),
        prisma.testimonial.findMany({
          orderBy: { order: "asc" },
        }),
        prisma.instagramPost.findMany({
          orderBy: { order: "asc" },
        }),
        prisma.user.findMany({
          orderBy: { createdAt: "asc" },
        }),
      ]);

    console.log(`✅ Fetched ${products.length} products`);
    console.log(`✅ Fetched ${ingredients.length} ingredients`);
    console.log(`✅ Fetched ${testimonials.length} testimonials`);
    console.log(`✅ Fetched ${instagramPosts.length} Instagram posts`);
    console.log(`✅ Fetched ${users.length} users`);

    // Create backup object
    const backup = {
      exportedAt: new Date().toISOString(),
      products,
      ingredients,
      testimonials,
      instagramPosts,
      users,
    };

    // Generate filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .split("T")[0];
    const filename = `prisma/prod-backup-${timestamp}.json`;

    // Write backup to file
    writeFileSync(
      resolve(__dirname, "..", filename),
      JSON.stringify(backup, null, 2),
      "utf-8",
    );

    console.log(`\n✅ Backup completed successfully!`);
    console.log(`📁 Backup saved to: ${filename}`);
    console.log(`📊 Summary:`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Ingredients: ${ingredients.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Instagram Posts: ${instagramPosts.length}`);
    console.log(`   - Users: ${users.length}`);
  } catch (error) {
    console.error("❌ Error creating backup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Backup failed:", error);
    process.exit(1);
  });
