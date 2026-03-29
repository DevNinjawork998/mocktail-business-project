/**
 * Restore database rows from a JSON file produced by scripts/backup-prod-db.ts
 * Usage: npx tsx scripts/restore-from-backup.ts prisma/prod-backup-2026-03-24.json
 *         npx tsx scripts/restore-from-backup.ts --replace prisma/prod-backup-2026-03-24.json
 * --replace: delete existing rows in restored tables (and auth rows for users) first
 */

import { readFileSync } from "fs";
import { loadEnvForDatabaseCli } from "./load-env-for-db-cli";
import { resolveDirectPostgresUrlForPg } from "./resolve-direct-postgres-url";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import type { Prisma } from "@prisma/client";

loadEnvForDatabaseCli();

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

function parseIsoDate(value: unknown): Date | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

interface BackupPayload {
  schemaVersion: number;
  exportedAt?: string;
  products: Prisma.ProductCreateManyInput[];
  productImages: Prisma.ProductImageCreateManyInput[];
  ingredients: Prisma.IngredientCreateManyInput[];
  settings: Prisma.SettingsCreateManyInput[];
  testimonials: Prisma.TestimonialCreateManyInput[];
  instagramPosts: Prisma.InstagramPostCreateManyInput[];
  users: Prisma.UserCreateManyInput[];
  accounts: Prisma.AccountCreateManyInput[];
  sessions: Prisma.SessionCreateManyInput[];
  passwordResetTokens: Prisma.PasswordResetTokenCreateManyInput[];
  verificationTokens: Prisma.VerificationTokenCreateManyInput[];
}

function needArray(raw: Record<string, unknown>, key: string): unknown[] {
  const v = raw[key];
  if (!Array.isArray(v)) {
    throw new Error(`Backup file missing or invalid array: "${key}"`);
  }
  return v;
}

function optionalArray(raw: Record<string, unknown>, key: string): unknown[] {
  const v = raw[key];
  return Array.isArray(v) ? v : [];
}

function loadBackup(filePath: string): BackupPayload {
  const absolute = resolve(process.cwd(), filePath);
  const raw = JSON.parse(readFileSync(absolute, "utf-8")) as Record<string, unknown>;

  return {
    schemaVersion:
      typeof raw.schemaVersion === "number" ? raw.schemaVersion : 1,
    exportedAt:
      typeof raw.exportedAt === "string" ? raw.exportedAt : undefined,
    products: needArray(raw, "products") as Prisma.ProductCreateManyInput[],
    productImages: optionalArray(
      raw,
      "productImages",
    ) as Prisma.ProductImageCreateManyInput[],
    ingredients: needArray(raw, "ingredients") as Prisma.IngredientCreateManyInput[],
    settings: optionalArray(raw, "settings") as Prisma.SettingsCreateManyInput[],
    testimonials: needArray(raw, "testimonials") as Prisma.TestimonialCreateManyInput[],
    instagramPosts: needArray(raw, "instagramPosts") as Prisma.InstagramPostCreateManyInput[],
    users: needArray(raw, "users") as Prisma.UserCreateManyInput[],
    accounts: optionalArray(raw, "accounts") as Prisma.AccountCreateManyInput[],
    sessions: optionalArray(raw, "sessions") as Prisma.SessionCreateManyInput[],
    passwordResetTokens: optionalArray(
      raw,
      "passwordResetTokens",
    ) as Prisma.PasswordResetTokenCreateManyInput[],
    verificationTokens: optionalArray(
      raw,
      "verificationTokens",
    ) as Prisma.VerificationTokenCreateManyInput[],
  };
}

function normalizeProduct(row: Record<string, unknown>): Prisma.ProductCreateManyInput {
  return {
    id: String(row.id),
    name: String(row.name),
    subtitle: String(row.subtitle),
    description: String(row.description),
    longDescription: String(row.longDescription),
    price: String(row.price),
    priceSubtext: String(row.priceSubtext),
    imageColor: String(row.imageColor),
    imageUrl: row.imageUrl == null ? null : String(row.imageUrl),
    features: row.features as Prisma.InputJsonValue,
    ingredients: row.ingredients == null ? undefined : (row.ingredients as Prisma.InputJsonValue),
    productBrief: row.productBrief == null ? null : String(row.productBrief),
    nutritionFacts:
      row.nutritionFacts == null ? undefined : (row.nutritionFacts as Prisma.InputJsonValue),
    createdAt: parseIsoDate(row.createdAt) ?? new Date(),
    updatedAt: parseIsoDate(row.updatedAt) ?? new Date(),
  };
}

function normalizeIngredient(
  row: Record<string, unknown>,
): Prisma.IngredientCreateManyInput {
  return {
    id: String(row.id),
    name: String(row.name),
    icon: String(row.icon),
    imageUrl: row.imageUrl == null ? null : String(row.imageUrl),
    subtitle: String(row.subtitle),
    description: String(row.description),
    type: String(row.type),
    order: typeof row.order === "number" ? row.order : Number(row.order) || 0,
    createdAt: parseIsoDate(row.createdAt) ?? new Date(),
    updatedAt: parseIsoDate(row.updatedAt) ?? new Date(),
  };
}

function normalizeTestimonial(
  row: Record<string, unknown>,
): Prisma.TestimonialCreateManyInput {
  return {
    id: String(row.id),
    text: String(row.text),
    customerName: String(row.customerName),
    avatarColor:
      row.avatarColor == null ? "#FF6B6B" : String(row.avatarColor),
    rating: typeof row.rating === "number" ? row.rating : Number(row.rating) || 5,
    order: typeof row.order === "number" ? row.order : Number(row.order) || 0,
    createdAt: parseIsoDate(row.createdAt) ?? new Date(),
    updatedAt: parseIsoDate(row.updatedAt) ?? new Date(),
  };
}

function normalizeInstagramPost(
  row: Record<string, unknown>,
): Prisma.InstagramPostCreateManyInput {
  return {
    id: String(row.id),
    postUrl: String(row.postUrl),
    imageUrl: row.imageUrl == null ? null : String(row.imageUrl),
    order: typeof row.order === "number" ? row.order : Number(row.order) || 0,
    createdAt: parseIsoDate(row.createdAt) ?? new Date(),
    updatedAt: parseIsoDate(row.updatedAt) ?? new Date(),
  };
}

function normalizeUser(row: Record<string, unknown>): Prisma.UserCreateManyInput {
  const emailVerified = parseIsoDate(row.emailVerified);
  return {
    id: String(row.id),
    name: row.name == null ? null : String(row.name),
    email: String(row.email),
    emailVerified,
    password: String(row.password),
    image: row.image == null ? null : String(row.image),
    role: row.role as Prisma.UserCreateManyInput["role"],
    createdAt: parseIsoDate(row.createdAt) ?? new Date(),
    updatedAt: parseIsoDate(row.updatedAt) ?? new Date(),
  };
}

function normalizeProductImage(
  row: Record<string, unknown>,
): Prisma.ProductImageCreateManyInput {
  return {
    id: String(row.id),
    productId: String(row.productId),
    url: String(row.url),
    order: typeof row.order === "number" ? row.order : Number(row.order) || 0,
    createdAt: parseIsoDate(row.createdAt) ?? new Date(),
    updatedAt: parseIsoDate(row.updatedAt) ?? new Date(),
  };
}

function normalizeSettings(row: Record<string, unknown>): Prisma.SettingsCreateManyInput {
  return {
    id: String(row.id),
    key: String(row.key),
    value: row.value == null ? null : String(row.value),
    updatedAt: parseIsoDate(row.updatedAt) ?? new Date(),
    updatedById: row.updatedById == null ? null : String(row.updatedById),
  };
}

function normalizeAccount(row: Record<string, unknown>): Prisma.AccountCreateManyInput {
  return {
    id: String(row.id),
    userId: String(row.userId),
    type: String(row.type),
    provider: String(row.provider),
    providerAccountId: String(row.providerAccountId),
    refresh_token: row.refresh_token == null ? null : String(row.refresh_token),
    access_token: row.access_token == null ? null : String(row.access_token),
    expires_at:
      row.expires_at == null || row.expires_at === undefined
        ? null
        : typeof row.expires_at === "number"
          ? row.expires_at
          : Number(row.expires_at),
    token_type: row.token_type == null ? null : String(row.token_type),
    scope: row.scope == null ? null : String(row.scope),
    id_token: row.id_token == null ? null : String(row.id_token),
    session_state: row.session_state == null ? null : String(row.session_state),
  };
}

function normalizeSession(row: Record<string, unknown>): Prisma.SessionCreateManyInput {
  return {
    id: String(row.id),
    sessionToken: String(row.sessionToken),
    userId: String(row.userId),
    expires: parseIsoDate(row.expires) ?? new Date(),
  };
}

function normalizePasswordResetToken(
  row: Record<string, unknown>,
): Prisma.PasswordResetTokenCreateManyInput {
  return {
    id: String(row.id),
    userId: String(row.userId),
    tokenHash: String(row.tokenHash),
    expiresAt: parseIsoDate(row.expiresAt) ?? new Date(),
    usedAt: parseIsoDate(row.usedAt),
    createdAt: parseIsoDate(row.createdAt) ?? new Date(),
  };
}

function normalizeVerificationToken(
  row: Record<string, unknown>,
): Prisma.VerificationTokenCreateManyInput {
  return {
    identifier: String(row.identifier),
    token: String(row.token),
    expires: parseIsoDate(row.expires) ?? new Date(),
  };
}

async function wipeRestoredTables(
  tx: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
  >,
): Promise<void> {
  await tx.passwordResetToken.deleteMany();
  await tx.session.deleteMany();
  await tx.account.deleteMany();
  // Prisma Postgres logical replication rejects DELETE on this table without replica identity
  await tx.$executeRawUnsafe(`TRUNCATE TABLE "verification_tokens"`);
  await tx.user.deleteMany();
  await tx.productImage.deleteMany();
  await tx.product.deleteMany();
  await tx.ingredient.deleteMany();
  await tx.testimonial.deleteMany();
  await tx.instagramPost.deleteMany();
  await tx.settings.deleteMany();
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const replace = argv.includes("--replace");
  const fileArg = argv.find((a) => !a.startsWith("--"));
  if (!fileArg) {
    console.error(`Usage:
  npx tsx scripts/restore-from-backup.ts [--replace] <path-to-backup.json>
  npm run db:restore:backup -- [--replace] <path-to-backup.json>
  npm run db:restore:prod -- [--replace] prisma/prod-backup-2026-03-24.json`);
    process.exit(1);
  }

  let databaseUrl: string;
  try {
    databaseUrl = resolveDirectPostgresUrlForPg().url;
  } catch (e) {
    console.error(
      "❌",
      e instanceof Error ? e.message : String(e),
    );
    process.exit(1);
  }

  const backup = loadBackup(fileArg);
  const products = backup.products.map((r) =>
    normalizeProduct(r as Record<string, unknown>),
  );
  const productImages = backup.productImages.map((r) =>
    normalizeProductImage(r as Record<string, unknown>),
  );
  const ingredients = backup.ingredients.map((r) =>
    normalizeIngredient(r as Record<string, unknown>),
  );
  const settings = backup.settings.map((r) =>
    normalizeSettings(r as Record<string, unknown>),
  );
  const testimonials = backup.testimonials.map((r) =>
    normalizeTestimonial(r as Record<string, unknown>),
  );
  const instagramPosts = backup.instagramPosts.map((r) =>
    normalizeInstagramPost(r as Record<string, unknown>),
  );
  const users = backup.users.map((r) =>
    normalizeUser(r as Record<string, unknown>),
  );
  const accounts = backup.accounts.map((r) =>
    normalizeAccount(r as Record<string, unknown>),
  );
  const sessions = backup.sessions.map((r) =>
    normalizeSession(r as Record<string, unknown>),
  );
  const passwordResetTokens = backup.passwordResetTokens.map((r) =>
    normalizePasswordResetToken(r as Record<string, unknown>),
  );
  const verificationTokens = backup.verificationTokens.map((r) =>
    normalizeVerificationToken(r as Record<string, unknown>),
  );

  const pool = new Pool({
    connectionString: ensureVerifyFullSsl(databaseUrl),
    connectionTimeoutMillis: 60_000,
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const txOptions = { maxWait: 60_000, timeout: 120_000 };

  try {
    console.log("🔄 Restoring from backup:", resolve(process.cwd(), fileArg));
    if (backup.exportedAt) {
      console.log("   exportedAt:", backup.exportedAt);
    }
    console.log("   schemaVersion:", backup.schemaVersion);
    if (replace) {
      console.log("   mode: --replace (clearing restored tables + related auth rows)");
    }

    await prisma.$transaction(
      async (tx) => {
        if (replace) {
          await wipeRestoredTables(tx);
        }
        if (ingredients.length > 0) {
          await tx.ingredient.createMany({ data: ingredients });
        }
        if (products.length > 0) {
          await tx.product.createMany({ data: products });
        }
        if (productImages.length > 0) {
          await tx.productImage.createMany({ data: productImages });
        }
        if (testimonials.length > 0) {
          await tx.testimonial.createMany({ data: testimonials });
        }
        if (instagramPosts.length > 0) {
          await tx.instagramPost.createMany({ data: instagramPosts });
        }
        if (users.length > 0) {
          await tx.user.createMany({ data: users });
        }
        if (accounts.length > 0) {
          await tx.account.createMany({ data: accounts });
        }
        if (sessions.length > 0) {
          await tx.session.createMany({ data: sessions });
        }
        if (passwordResetTokens.length > 0) {
          await tx.passwordResetToken.createMany({
            data: passwordResetTokens,
          });
        }
        if (verificationTokens.length > 0) {
          await tx.verificationToken.createMany({
            data: verificationTokens,
          });
        }
        if (settings.length > 0) {
          await tx.settings.createMany({ data: settings });
        }
      },
      txOptions,
    );

    console.log("✅ Restore completed:");
    console.log(`   - Ingredients: ${ingredients.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Product images: ${productImages.length}`);
    console.log(`   - Settings: ${settings.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log(`   - Instagram posts: ${instagramPosts.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Accounts: ${accounts.length}`);
    console.log(`   - Sessions: ${sessions.length}`);
    console.log(`   - Password reset tokens: ${passwordResetTokens.length}`);
    console.log(`   - Verification tokens: ${verificationTokens.length}`);
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
  .catch((error: unknown) => {
    console.error("\n❌ Restore failed:", error);
    process.exit(1);
  });
