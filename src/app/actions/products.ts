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
async function deleteUploadThingFile(
  imageUrl: string | null | undefined,
): Promise<void> {
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

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  price: z.string().min(1, "Price is required"),
  priceSubtext: z.string().min(1, "Price subtext is required"),
  imageColor: z.string().min(1, "Image color is required"),
  imageUrl: z.string().optional().nullable(),
  features: z.array(z.object({ text: z.string(), color: z.string() })),
  ingredients: z.array(z.string()).optional().nullable(),
  productBrief: z.string().optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export async function createProduct(
  data: ProductFormData,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = productSchema.parse(data);
    const product = await prisma.product.create({
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
        ingredients: validated.ingredients || [],
        productBrief: validated.productBrief || null,
      },
    });

    revalidatePath("/shop");
    revalidatePath("/dashboard/products");
    return { success: true, data: { id: product.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  data: ProductFormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = productSchema.parse(data);

    // Get the current product to check if we need to delete the old image
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    // Delete the old image from UploadThing if it's being replaced
    if (
      currentProduct?.imageUrl &&
      validated.imageUrl !== currentProduct.imageUrl
    ) {
      await deleteUploadThingFile(currentProduct.imageUrl);
    }

    await prisma.product.update({
      where: { id },
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
        ingredients: validated.ingredients || [],
        productBrief: validated.productBrief || null,
      },
    });

    revalidatePath("/shop");
    revalidatePath(`/shop/${id}`);
    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${id}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getDeleterRoles().includes(session.user.role)) {
    return { success: false, error: "Only admins can delete products" };
  }

  try {
    // First, get the product to check if it has an UploadThing image
    const product = await prisma.product.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    // Delete the image from UploadThing if it exists
    if (product?.imageUrl) {
      await deleteUploadThingFile(product.imageUrl);
    }

    // Delete the product from the database
    await prisma.product.delete({ where: { id } });

    revalidatePath("/shop");
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
