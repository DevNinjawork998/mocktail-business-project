import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getEditorRoles } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Create the settings table if it doesn't exist using raw SQL
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "value" TEXT,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedById" TEXT,
        CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
      )
    `);

    // Create unique index on key
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "settings_key_key" ON "settings"("key")
    `);

    return NextResponse.json({
      success: true,
      message: "Settings table initialized successfully",
    });
  } catch (error) {
    console.error("Error initializing settings table:", error);
    return NextResponse.json(
      { error: "Failed to initialize settings table" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to initialize the settings table",
  });
}
