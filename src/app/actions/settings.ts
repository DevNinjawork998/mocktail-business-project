"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

/**
 * Ensure the settings table exists in the database
 */
async function ensureSettingsTableExists(): Promise<boolean> {
  try {
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
 * Get the landing photo URL from settings
 */
export async function getLandingPhotoUrl(): Promise<ActionResult<string | null>> {
  try {
    // Check if settings table exists by trying to access it
    // If the table doesn't exist yet, return null (fallback to env/default)
    const setting = await prisma.settings.findUnique({
      where: { key: SETTINGS_KEY_LANDING_PHOTO },
    }).catch(() => null);

    if (setting === null) {
      // Table might not exist or no setting found - return null to use fallback
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: setting?.value || null,
    };
  } catch (error) {
    console.error("Error getting landing photo URL:", error);
    // Return null on error to allow fallback to environment variable/default
    return { success: true, data: null };
  }
}

/**
 * Update the landing photo URL in settings
 */
export async function updateLandingPhotoUrl(
  url: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Ensure the settings table exists
    await ensureSettingsTableExists();

    // Get the current landing photo URL to delete the old file
    const currentSetting = await prisma.settings
      .findUnique({
        where: { key: SETTINGS_KEY_LANDING_PHOTO },
      })
      .catch(() => null);

    // Delete the old image from UploadThing if it's being replaced
    if (
      currentSetting?.value &&
      url !== currentSetting.value &&
      currentSetting.value.startsWith("http")
    ) {
      await deleteUploadThingFile(currentSetting.value);
    }

    // Upsert the setting (create if doesn't exist, update if exists)
    await prisma.settings.upsert({
      where: { key: SETTINGS_KEY_LANDING_PHOTO },
      update: {
        value: url,
        updatedById: session.user.id,
      },
      create: {
        key: SETTINGS_KEY_LANDING_PHOTO,
        value: url,
        updatedById: session.user.id,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating landing photo URL:", error);
    return { success: false, error: "Failed to update landing photo URL" };
  }
}

/**
 * Remove the landing photo (set to empty string)
 */
export async function removeLandingPhoto(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const currentSetting = await prisma.settings
      .findUnique({
        where: { key: SETTINGS_KEY_LANDING_PHOTO },
      })
      .catch(() => null);

    // Delete the image from UploadThing
    if (currentSetting?.value && currentSetting.value.startsWith("http")) {
      await deleteUploadThingFile(currentSetting.value);
    }

    // Update setting to empty string
    if (currentSetting) {
      await prisma.settings.update({
        where: { key: SETTINGS_KEY_LANDING_PHOTO },
        data: {
          value: "",
          updatedById: session.user.id,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Error removing landing photo:", error);
    return { success: false, error: "Failed to remove landing photo" };
  }
}
