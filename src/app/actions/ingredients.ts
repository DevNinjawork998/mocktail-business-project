"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEditorRoles, getDeleterRoles } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UTApi } from "uploadthing/server";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

/**
 * Extract file key from UploadThing URL
 * URLs are in format: https://utfs.io/f/[fileKey]
 */
function extractFileKeyFromUrl(url: string): string | null {
  if (!url.startsWith("https://utfs.io/")) {
    return null;
  }
  
  try {
    const urlParts = url.split("/");
    const fileKey = urlParts[urlParts.length - 1];
    return fileKey || null;
  } catch {
    return null;
  }
}

/**
 * Delete file from UploadThing if URL is an UploadThing URL
 */
async function deleteUploadThingFile(imageUrl: string | null | undefined): Promise<void> {
  if (!imageUrl) {
    return;
  }

  const fileKey = extractFileKeyFromUrl(imageUrl);
  if (!fileKey) {
    return; // Not an UploadThing URL, skip deletion
  }

  try {
    const utapi = new UTApi();
    await utapi.deleteFiles(fileKey);
  } catch (error) {
    // Log error but don't throw - file deletion failure shouldn't block the operation
    console.error("Error deleting file from UploadThing:", error);
  }
}

const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
  imageUrl: z.string().optional().nullable(),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["Adaptogen", "Fruit"]),
  order: z.number().int().min(0).default(0),
});

export type IngredientFormData = z.infer<typeof ingredientSchema>;

export async function createIngredient(
  data: IngredientFormData
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = ingredientSchema.parse(data);
    const ingredient = await prisma.ingredient.create({
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
      },
    });

    revalidatePath("/ingredients");
    revalidatePath("/your-buddies");
    revalidatePath("/dashboard/ingredients");
    return { success: true, data: { id: ingredient.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error creating ingredient:", error);
    return { success: false, error: "Failed to create ingredient" };
  }
}

export async function updateIngredient(
  id: string,
  data: IngredientFormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = ingredientSchema.parse(data);
    
    // Get the current ingredient to check if we need to delete the old image
    const currentIngredient = await prisma.ingredient.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    // Delete the old image from UploadThing if it's being replaced
    if (
      currentIngredient?.imageUrl &&
      validated.imageUrl !== currentIngredient.imageUrl
    ) {
      await deleteUploadThingFile(currentIngredient.imageUrl);
    }

    await prisma.ingredient.update({
      where: { id },
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
      },
    });

    revalidatePath("/ingredients");
    revalidatePath("/your-buddies");
    revalidatePath("/dashboard/ingredients");
    revalidatePath(`/dashboard/ingredients/${id}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error updating ingredient:", error);
    return { success: false, error: "Failed to update ingredient" };
  }
}

export async function deleteIngredient(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getDeleterRoles().includes(session.user.role)) {
    return { success: false, error: "Only admins can delete ingredients" };
  }

  try {
    // First, get the ingredient to check if it has an UploadThing image
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    // Delete the image from UploadThing if it exists
    if (ingredient?.imageUrl) {
      await deleteUploadThingFile(ingredient.imageUrl);
    }

    // Delete the ingredient from the database
    await prisma.ingredient.delete({ where: { id } });

    revalidatePath("/ingredients");
    revalidatePath("/your-buddies");
    revalidatePath("/dashboard/ingredients");
    return { success: true };
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    return { success: false, error: "Failed to delete ingredient" };
  }
}
