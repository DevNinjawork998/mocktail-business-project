/**
 * Verify Postgres connectivity with node-pg (direct postgres:// URL only).
 * Usage: npm run db:test:connection
 * Production DB: npm run db:test:connection:prod (sets PRISMA_DB_ENV=production)
 *
 * URL resolution: first direct postgres:// among POSTGRES_URL, DATABASE_URL, DIRECT_URL.
 */

import { Pool } from "pg";
import { loadEnvForDatabaseCli } from "./load-env-for-db-cli";
import { resolveDirectPostgresUrlForPg } from "./resolve-direct-postgres-url";

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

async function main(): Promise<void> {
  const { url, source } = resolveDirectPostgresUrlForPg();
  const connectionString = ensureVerifyFullSsl(url);

  console.log(`Testing connection using ${source}…`);

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 30_000,
  });

  try {
    const result = await pool.query<{
      ok: number;
      db: string;
      now: Date;
    }>(
      "SELECT 1 AS ok, current_database() AS db, now() AS now",
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error("No row returned");
    }
    console.log("Connection ready.");
    console.log(`  database: ${row.db}`);
    console.log(`  server time: ${row.now.toISOString()}`);
  } finally {
    await pool.end();
  }
}

main()
  .then(() => {
    console.log("\nDone.");
    process.exit(0);
  })
  .catch((err: unknown) => {
    console.error("\nConnection failed:", err);
    process.exit(1);
  });
