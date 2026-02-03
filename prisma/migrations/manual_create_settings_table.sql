-- Manual migration to create Settings table
-- Run this SQL directly in your database if you can't use Prisma Migrate

CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "settings_key_key" ON "settings"("key");
