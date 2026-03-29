/**
 * Picks a direct postgres:// or postgresql:// URL for node-pg / PrismaPg.
 * Skips prisma+ / prisma:// (Accelerate) so the first usable direct URL wins.
 */

function isDirectPostgresConnectionString(url: string): boolean {
  return (
    url.startsWith("postgres://") || url.startsWith("postgresql://")
  );
}

export function resolveDirectPostgresUrlForPg(): { url: string; source: string } {
  const entries: Array<{ source: string; url: string | undefined }> = [
    { source: "POSTGRES_URL", url: process.env.POSTGRES_URL },
    { source: "DATABASE_URL", url: process.env.DATABASE_URL },
    { source: "DIRECT_URL", url: process.env.DIRECT_URL },
  ];

  for (const { source, url } of entries) {
    if (url && isDirectPostgresConnectionString(url)) {
      return { url, source };
    }
  }

  const firstSet = entries.find((e) => e.url !== undefined && e.url !== "");
  if (firstSet?.url) {
    throw new Error(
      `${firstSet.source} is set but is not a direct postgres:// URL. ` +
        "Use the direct connection string from Prisma Console for POSTGRES_URL, DATABASE_URL, or DIRECT_URL when running backup, restore, or db:test:connection.",
    );
  }

  throw new Error(
    "Set POSTGRES_URL, DATABASE_URL, or DIRECT_URL to a direct postgres:// connection string.",
  );
}
