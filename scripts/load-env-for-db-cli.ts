/**
 * Loads repo .env files for backup/restore/test DB scripts.
 * When PRISMA_DB_ENV=production, reapplies .env.production.local with override so
 * DATABASE_URL / POSTGRES_URL from .env.local do not win over production targets.
 *
 * For schema push and pg-based scripts against Prisma Postgres, use a direct
 * postgres://… URL (not prisma+postgres Accelerate) in production env for
 * DATABASE_URL and/or POSTGRES_URL.
 */

import { config } from "dotenv";
import { resolve } from "node:path";

const repoRoot = resolve(__dirname, "..");

export function loadEnvForDatabaseCli(): void {
  config({ path: resolve(repoRoot, ".env.local") });
  config({ path: resolve(repoRoot, ".env.development.local") });
  config({ path: resolve(repoRoot, ".env.production.local") });
  config({ path: resolve(repoRoot, ".env.prod.local") });
  config({ path: resolve(repoRoot, ".env") });

  if (process.env.PRISMA_DB_ENV === "production") {
    config({ path: resolve(repoRoot, ".env.production.local"), override: true });
    config({ path: resolve(repoRoot, ".env.prod.local"), override: true });
  }
}
