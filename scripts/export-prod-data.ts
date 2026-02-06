import * as dotenv from "dotenv";
dotenv.config({ path: ".env.production.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

// Use POSTGRES_URL for direct pg connection (not accelerate proxy)
let dbUrl = process.env.POSTGRES_URL || process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

// Replace sslmode=require with sslmode=verify-full to suppress pg deprecation warning
if (dbUrl) {
  dbUrl = dbUrl.replace("sslmode=require", "sslmode=verify-full");
}

const pool = new Pool({
  connectionString: dbUrl,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Connecting to production database...");

  // Export products
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });
  console.log(`Found ${products.length} products`);

  // Export ingredients
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { order: "asc" },
  });
  console.log(`Found ${ingredients.length} ingredients`);

  // Export settings
  const settings = await prisma.settings.findMany();
  console.log(`Found ${settings.length} settings`);

  // Export users (without passwords for safety)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  console.log(`Found ${users.length} users`);

  const backup = {
    exportedAt: new Date().toISOString(),
    products,
    ingredients,
    settings,
    users,
  };

  const outputPath = path.join(__dirname, "..", "prisma", "prod-backup.json");
  fs.writeFileSync(outputPath, JSON.stringify(backup, null, 2));
  console.log(`\nBackup saved to: ${outputPath}`);

  // Also print a summary
  console.log("\n=== SUMMARY ===");
  console.log(`Products (${products.length}):`);
  for (const p of products) {
    console.log(`  - ${p.id}: ${p.name}`);
    console.log(`    subtitle: ${p.subtitle}`);
    console.log(`    imageUrl: ${p.imageUrl}`);
    console.log(`    features: ${JSON.stringify(p.features)}`);
    console.log(`    ingredients: ${JSON.stringify(p.ingredients)}`);
  }

  console.log(`\nIngredients (${ingredients.length}):`);
  for (const i of ingredients) {
    console.log(`  - ${i.name} (${i.type}, order: ${i.order})`);
    console.log(`    imageUrl: ${i.imageUrl}`);
  }

  console.log(`\nSettings (${settings.length}):`);
  for (const s of settings) {
    console.log(`  - ${s.key}: ${s.value}`);
  }

  console.log(`\nUsers (${users.length}):`);
  for (const u of users) {
    console.log(`  - ${u.email} (${u.role})`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Error exporting data:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
