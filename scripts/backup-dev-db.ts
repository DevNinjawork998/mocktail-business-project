/**
 * Script to backup development database data to JSON
 * Uses `.env.local` with override (full local dev / Docker Postgres).
 * Reuses `src/lib/prisma` connection logic (POSTGRES_URL / DATABASE_URL).
 *
 * Usage:
 *   npx tsx scripts/backup-dev-db.ts
 *   npx tsx scripts/backup-dev-db.ts prisma/dev-backup-2026-03-29.json
 * Second form writes to that path (project-relative) instead of a new dated file.
 */

import { config } from "dotenv";
import { resolve } from "path";
import { writeFileSync } from "fs";

config({
  path: resolve(__dirname, "../.env.local"),
  override: true,
});

async function main(): Promise<void> {
  const { prisma } = await import("../src/lib/prisma");

  try {
    console.log("🔄 Starting development database backup...");

    // Explicit select avoids a Prisma + adapter-pg issue where default findMany
    // can error with P2022 when using the shared lib/prisma pool in scripts.
    const productScalarSelect = {
      id: true,
      name: true,
      subtitle: true,
      description: true,
      longDescription: true,
      price: true,
      priceSubtext: true,
      imageColor: true,
      imageUrl: true,
      features: true,
      ingredients: true,
      productBrief: true,
      nutritionFacts: true,
      createdAt: true,
      updatedAt: true,
    } as const;

    const products = await prisma.product.findMany({
      select: productScalarSelect,
      orderBy: { id: "asc" },
    });
    const productImages = await prisma.productImage.findMany({
      orderBy: [{ productId: "asc" }, { order: "asc" }],
    });
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { id: "asc" },
    });
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    const instagramPosts = await prisma.instagramPost.findMany({
      orderBy: { order: "asc" },
    });
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });

    console.log(`✅ Fetched ${products.length} products`);
    console.log(`✅ Fetched ${productImages.length} product images`);
    console.log(`✅ Fetched ${ingredients.length} ingredients`);
    console.log(`✅ Fetched ${testimonials.length} testimonials`);
    console.log(`✅ Fetched ${instagramPosts.length} Instagram posts`);
    console.log(`✅ Fetched ${users.length} users`);

    const backup = {
      exportedAt: new Date().toISOString(),
      products,
      productImages,
      ingredients,
      testimonials,
      instagramPosts,
      users,
    };

    const outArg = process.argv[2]?.trim();
    const filename =
      outArg && outArg.endsWith(".json")
        ? outArg
        : `prisma/dev-backup-${
            new Date().toISOString().replace(/[:.]/g, "-").split("T")[0]
          }.json`;

    const absolutePath = resolve(__dirname, "..", filename);

    writeFileSync(absolutePath, JSON.stringify(backup, null, 2), "utf-8");

    console.log(`\n✅ Backup completed successfully!`);
    console.log(`📁 Backup saved to: ${filename}`);
    console.log(`📊 Summary:`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Product images: ${productImages.length}`);
    console.log(`   - Ingredients: ${ingredients.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Instagram Posts: ${instagramPosts.length}`);
    console.log(`   - Users: ${users.length}`);
  } catch (error) {
    console.error("❌ Error creating backup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error("\n❌ Backup failed:", error);
    process.exit(1);
  });
