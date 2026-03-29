"use server";

import { auth } from "@/auth";
import { getEditorRoles } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Extract file key from UploadThing URL
 * URLs are in format: https://utfs.io/f/[fileKey] or https://[subdomain].ufs.sh/f/[fileKey]
 */
function extractFileKey(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const fileKeyIndex = pathParts.indexOf("f");
    if (fileKeyIndex !== -1 && fileKeyIndex < pathParts.length - 1) {
      return pathParts[fileKeyIndex + 1];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Delete a file from UploadThing
 */
async function deleteUploadThingFile(url: string): Promise<void> {
  try {
    const fileKey = extractFileKey(url);
    if (!fileKey) {
      console.warn("Could not extract file key from URL:", url);
      return;
    }

    const utapi = new UTApi();
    await utapi.deleteFiles(fileKey);
  } catch (error) {
    console.error("Error deleting file from UploadThing:", error);
    // Don't throw - file deletion is not critical
  }
}

const SETTINGS_KEY_LANDING_PHOTO = "landingPhotoUrl";
const SETTINGS_KEY_LANDING_HERO_SLIDE_URLS = "landingHeroSlideUrls";

function normalizeSlideUrlList(urls: unknown): string[] {
  if (!Array.isArray(urls)) {
    return [];
  }
  return urls.filter(
    (u): u is string =>
      typeof u === "string" && u.trim().length > 0 && u.startsWith("http"),
  );
}

function parseSlideUrlsJson(value: string | null | undefined): string[] | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (!value.trim()) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return null;
    }
    return normalizeSlideUrlList(parsed);
  } catch {
    return null;
  }
}

async function fetchLandingSlideUrlsFromDatabase(): Promise<string[]> {
  const hasDatabaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DIRECT_URL ||
    process.env.PRISMA_DATABASE_URL;

  if (!hasDatabaseUrl) {
    return [];
  }

  const { prisma } = await import("@/lib/prisma");

  const slidesRow = await prisma.settings
    .findUnique({
      where: { key: SETTINGS_KEY_LANDING_HERO_SLIDE_URLS },
    })
    .catch(() => null);

  if (slidesRow) {
    const fromJson = parseSlideUrlsJson(slidesRow.value);
    if (fromJson !== null) {
      return fromJson;
    }
  }

  const legacyRow = await prisma.settings
    .findUnique({
      where: { key: SETTINGS_KEY_LANDING_PHOTO },
    })
    .catch(() => null);

  const legacy = legacyRow?.value?.trim();
  if (legacy && legacy.startsWith("http")) {
    return [legacy];
  }

  return [];
}

/**
 * Ensure the settings table exists in the database
 */
async function ensureSettingsTableExists(): Promise<boolean> {
  try {
    const { prisma } = await import("@/lib/prisma");
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
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "settings_key_key" ON "settings"("key")
    `);
    return true;
  } catch (error) {
    console.error("Error ensuring settings table exists:", error);
    return false;
  }
}

/**
 * Ordered landing hero image URLs (JSON in settings, with legacy single-URL fallback).
 */
export async function getLandingHeroSlideUrls(): Promise<
  ActionResult<string[]>
> {
  try {
    const slides = await fetchLandingSlideUrlsFromDatabase();
    return { success: true, data: slides };
  } catch (_error) {
    return { success: true, data: [] };
  }
}

/**
 * First landing hero URL (backward compatible with single-photo callers).
 */
export async function getLandingPhotoUrl(): Promise<
  ActionResult<string | null>
> {
  const result = await getLandingHeroSlideUrls();
  const first = result.success ? result.data?.[0] : undefined;
  return { success: true, data: first ?? null };
}

function filterValidSlideUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    if (typeof u !== "string" || !u.trim().startsWith("http")) {
      continue;
    }
    if (seen.has(u)) {
      continue;
    }
    seen.add(u);
    out.push(u);
  }
  return out;
}

/**
 * Replace the full ordered list of landing hero slide URLs.
 * Removes any URLs no longer present from UploadThing.
 */
export async function setLandingHeroSlideUrls(
  urls: string[],
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await ensureSettingsTableExists();
    const { prisma } = await import("@/lib/prisma");
    const nextUrls = filterValidSlideUrls(urls);
    const previous = await fetchLandingSlideUrlsFromDatabase();

    for (const u of previous) {
      if (!nextUrls.includes(u)) {
        await deleteUploadThingFile(u);
      }
    }

    const jsonValue = JSON.stringify(nextUrls);
    const legacyFirst = nextUrls[0] ?? "";

    await prisma.settings.upsert({
      where: { key: SETTINGS_KEY_LANDING_HERO_SLIDE_URLS },
      update: {
        value: jsonValue,
        updatedById: session.user.id,
      },
      create: {
        key: SETTINGS_KEY_LANDING_HERO_SLIDE_URLS,
        value: jsonValue,
        updatedById: session.user.id,
      },
    });

    await prisma.settings.upsert({
      where: { key: SETTINGS_KEY_LANDING_PHOTO },
      update: {
        value: legacyFirst,
        updatedById: session.user.id,
      },
      create: {
        key: SETTINGS_KEY_LANDING_PHOTO,
        value: legacyFirst,
        updatedById: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error saving landing hero slides:", error);
    return { success: false, error: "Failed to save landing hero slides" };
  }
}

/**
 * Remove one slide by index (deletes file from UploadThing when applicable).
 */
export async function removeLandingHeroSlideAt(
  index: number,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  if (!Number.isInteger(index) || index < 0) {
    return { success: false, error: "Invalid slide index" };
  }

  try {
    await ensureSettingsTableExists();
    const previous = await fetchLandingSlideUrlsFromDatabase();
    if (index >= previous.length) {
      return { success: false, error: "Invalid slide index" };
    }

    const nextUrls = previous.filter((_, i) => i !== index);
    return setLandingHeroSlideUrls(nextUrls);
  } catch (error) {
    console.error("Error removing landing hero slide:", error);
    return { success: false, error: "Failed to remove slide" };
  }
}

/**
 * Update the landing photo URL (replaces all slides with a single image).
 */
export async function updateLandingPhotoUrl(
  url: string,
): Promise<ActionResult> {
  if (!url.trim().startsWith("http")) {
    return { success: false, error: "Invalid image URL" };
  }
  return setLandingHeroSlideUrls([url]);
}

/**
 * Remove all landing hero photos and clear settings.
 */
export async function removeLandingPhoto(): Promise<ActionResult> {
  return setLandingHeroSlideUrls([]);
}
