/**
 * Seed production database from a JSON backup file.
 * Loads ONLY `.env.production.local` (override). Uses `src/lib/prisma` for connection handling.
 *
 * Usage:
 *   npx tsx scripts/seed-prod-from-backup.ts [path-to-json-file]
 * If omitted, uses newest `prisma/dev-backup-*.json`.
 */

import { config } from "dotenv";
import { resolve } from "path";
import { readFileSync, readdirSync, existsSync } from "fs";

config({
  path: resolve(__dirname, "../.env.production.local"),
  override: true,
});

if (!process.env.DATABASE_URL && !process.env.DIRECT_URL && !process.env.POSTGRES_URL) {
  console.error(
    "❌ Error: DATABASE_URL, DIRECT_URL, or POSTGRES_URL required in .env.production.local",
  );
  process.exit(1);
}

function resolveBackupPath(argPath: string | undefined): string {
  if (argPath) {
    return resolve(__dirname, "..", argPath);
  }
  const prismaDir = resolve(__dirname, "..", "prisma");
  if (!existsSync(prismaDir)) {
    throw new Error("prisma directory not found");
  }
  const devBackups = readdirSync(prismaDir)
    .filter((f) => f.startsWith("dev-backup-") && f.endsWith(".json"))
    .sort()
    .reverse();
  if (devBackups.length === 0) {
    throw new Error(
      "No backup path provided and no prisma/dev-backup-*.json found. Pass path: npx tsx scripts/seed-prod-from-backup.ts prisma/dev-backup-YYYY-MM-DD.json",
    );
  }
  if (devBackups.length > 1) {
    console.log(
      `ℹ️  Multiple dev backups found; using newest: ${devBackups[0]}`,
    );
  }
  return resolve(prismaDir, devBackups[0]);
}

interface BackupShape {
  exportedAt?: string;
  products: unknown[];
  productImages?: unknown[];
  ingredients: unknown[];
  testimonials: unknown[];
  instagramPosts: unknown[];
  users: unknown[];
}

async function main(): Promise<void> {
  const { prisma } = await import("../src/lib/prisma");

  const backupFilePath = resolveBackupPath(process.argv[2]);

  console.log(`🔄 Reading backup file: ${backupFilePath}`);

  const fileContent = readFileSync(backupFilePath, "utf-8");
  const backupData = JSON.parse(fileContent) as BackupShape;

  console.log(
    `✅ Loaded backup exported at: ${backupData.exportedAt ?? "unknown"}`,
  );
  console.log("🧹 Clearing production data (auth + catalog tables)...");

  await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany();
    await tx.product.deleteMany();
    await tx.ingredient.deleteMany();
    await tx.testimonial.deleteMany();
    await tx.instagramPost.deleteMany();
    await tx.account.deleteMany();
    await tx.session.deleteMany();
    await tx.verificationToken.deleteMany();
    await tx.user.deleteMany();
  });

  console.log("🌱 Seeding production from backup...");

  if (backupData.products?.length) {
    await prisma.product.createMany({
      data: backupData.products as never[],
    });
    console.log(`✅ Seeded ${backupData.products.length} products`);
  }

  if (backupData.productImages?.length) {
    await prisma.productImage.createMany({
      data: backupData.productImages as never[],
    });
    console.log(
      `✅ Seeded ${backupData.productImages.length} product images`,
    );
  }

  if (backupData.ingredients?.length) {
    await prisma.ingredient.createMany({
      data: backupData.ingredients as never[],
    });
    console.log(`✅ Seeded ${backupData.ingredients.length} ingredients`);
  }

  if (backupData.testimonials?.length) {
    await prisma.testimonial.createMany({
      data: backupData.testimonials as never[],
    });
    console.log(`✅ Seeded ${backupData.testimonials.length} testimonials`);
  }

  if (backupData.instagramPosts?.length) {
    await prisma.instagramPost.createMany({
      data: backupData.instagramPosts as never[],
    });
    console.log(
      `✅ Seeded ${backupData.instagramPosts.length} Instagram posts`,
    );
  }

  if (backupData.users?.length) {
    await prisma.user.createMany({
      data: backupData.users as never[],
    });
    console.log(`✅ Seeded ${backupData.users.length} users`);
  }

  console.log("\n🎉 Production database seeded from backup.");
  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error("❌ Error seeding production:", error);
  process.exit(1);
});
