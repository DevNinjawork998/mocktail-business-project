/**
 * Script to backup production database data to JSON
 * Usage: npx tsx scripts/backup-prod-db.ts
 */

import { resolve } from "path";
import { writeFileSync } from "fs";
import { loadEnvForDatabaseCli } from "./load-env-for-db-cli";
import { resolveDirectPostgresUrlForPg } from "./resolve-direct-postgres-url";
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

loadEnvForDatabaseCli();

let databaseUrl: string;
try {
  databaseUrl = resolveDirectPostgresUrlForPg().url;
} catch (e) {
  console.error(
    "❌ Error:",
    e instanceof Error ? e.message : String(e),
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString: ensureVerifyFullSsl(databaseUrl),
  connectionTimeoutMillis: 60_000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("🔄 Starting production database backup...");
    console.log(
      "   (sequential reads — includes product gallery images, settings, OAuth rows)",
    );

    // Sequential queries reduce parallel connection pressure (helps avoid P1008 timeouts).
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { id: "asc" },
    });
    console.log(`✅ Fetched ${ingredients.length} ingredients`);

    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });
    console.log(`✅ Fetched ${products.length} products`);

    const productImages = await prisma.productImage.findMany({
      orderBy: [{ productId: "asc" }, { order: "asc" }],
    });
    console.log(`✅ Fetched ${productImages.length} product images`);

    const settings = await prisma.settings.findMany({
      orderBy: { key: "asc" },
    });
    console.log(`✅ Fetched ${settings.length} settings`);

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    console.log(`✅ Fetched ${testimonials.length} testimonials`);

    const instagramPosts = await prisma.instagramPost.findMany({
      orderBy: { order: "asc" },
    });
    console.log(`✅ Fetched ${instagramPosts.length} Instagram posts`);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });
    console.log(`✅ Fetched ${users.length} users`);

    const accounts = await prisma.account.findMany({
      orderBy: [{ userId: "asc" }, { provider: "asc" }],
    });
    console.log(`✅ Fetched ${accounts.length} accounts`);

    const sessions = await prisma.session.findMany({
      orderBy: { userId: "asc" },
    });
    console.log(`✅ Fetched ${sessions.length} sessions`);

    const passwordResetTokens = await prisma.passwordResetToken.findMany({
      orderBy: { createdAt: "asc" },
    });
    console.log(`✅ Fetched ${passwordResetTokens.length} password reset tokens`);

    const verificationTokens = await prisma.verificationToken.findMany({
      orderBy: [{ identifier: "asc" }, { token: "asc" }],
    });
    console.log(`✅ Fetched ${verificationTokens.length} verification tokens`);

    // Create backup object (schemaVersion 2 adds gallery images, settings, auth tokens)
    const backup = {
      schemaVersion: 2 as const,
      exportedAt: new Date().toISOString(),
      products,
      productImages,
      ingredients,
      settings,
      testimonials,
      instagramPosts,
      users,
      accounts,
      sessions,
      passwordResetTokens,
      verificationTokens,
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
    console.log(`   - Product images: ${productImages.length}`);
    console.log(`   - Ingredients: ${ingredients.length}`);
    console.log(`   - Settings: ${settings.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Instagram Posts: ${instagramPosts.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Accounts: ${accounts.length}`);
    console.log(`   - Sessions: ${sessions.length}`);
    console.log(`   - Password reset tokens: ${passwordResetTokens.length}`);
    console.log(`   - Verification tokens: ${verificationTokens.length}`);
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
