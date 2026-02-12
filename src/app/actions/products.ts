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
  imageUrl: z.string().url("Main photo is required").min(1, "Main photo is required"),
  supportingPhoto1Url: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.string().url().nullable().optional(),
  ),
  supportingPhoto2Url: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : val),
    z.string().url().nullable().optional(),
  ),
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
    
    // Validate main photo is required
    if (!validated.imageUrl) {
      return { success: false, error: "Main photo is required" };
    }

    // Type assertion needed due to Prisma Proxy wrapper interfering with type inference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product = await (prisma.product.create as any)({
      data: {
        name: validated.name,
        subtitle: validated.subtitle,
        description: validated.description,
        longDescription: validated.longDescription,
        price: validated.price,
        priceSubtext: validated.priceSubtext,
        imageColor: validated.imageColor,
        imageUrl: validated.imageUrl,
        features: validated.features,
        ingredients: validated.ingredients || [],
        productBrief: validated.productBrief || null,
        images: {
          create: [
            // Main photo always at order 0
            {
              url: validated.imageUrl,
              order: 0,
            },
            // Supporting photo 1 at order 1 (if provided)
            ...(validated.supportingPhoto1Url
              ? [
                  {
                    url: validated.supportingPhoto1Url,
                    order: 1,
                  },
                ]
              : []),
            // Supporting photo 2 at order 2 (if provided)
            ...(validated.supportingPhoto2Url
              ? [
                  {
                    url: validated.supportingPhoto2Url,
                    order: 2,
                  },
                ]
              : []),
          ],
        },
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

    // Validate main photo is required
    if (!validated.imageUrl) {
      return { success: false, error: "Main photo is required" };
    }

    // Get the current product with images to check what needs to be deleted
    // Type assertion needed due to Prisma Proxy wrapper interfering with type inference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentProduct = (await (prisma.product.findUnique as any)({
      where: { id },
      select: {
        imageUrl: true,
        images: {
          select: {
            id: true,
            url: true,
            order: true,
          },
        },
      },
    })) as
      | {
          imageUrl: string | null;
          images: Array<{ id: string; url: string; order: number }>;
        }
      | null;

    if (!currentProduct) {
      return { success: false, error: "Product not found" };
    }

    // Find existing ProductImage records by order
    const existingMainPhoto = currentProduct.images.find((img) => img.order === 0);
    const existingSupportingPhoto1 = currentProduct.images.find((img) => img.order === 1);
    const existingSupportingPhoto2 = currentProduct.images.find((img) => img.order === 2);

    // Track URLs to delete from UploadThing
    const urlsToDelete: string[] = [];

    // Handle main photo (order 0) - always required
    if (existingMainPhoto) {
      if (existingMainPhoto.url !== validated.imageUrl) {
        // Main photo is being replaced
        urlsToDelete.push(existingMainPhoto.url);
        // Update existing ProductImage record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await ((prisma as any).productImage.update as any)({
          where: { id: existingMainPhoto.id },
          data: { url: validated.imageUrl },
        });
      }
      // If URL is the same, no update needed
    } else {
      // Create new ProductImage record for main photo
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ((prisma as any).productImage.create as any)({
        data: {
          productId: id,
          url: validated.imageUrl,
          order: 0,
        },
      });
    }

    // Also update product.imageUrl
    if (currentProduct.imageUrl !== validated.imageUrl) {
      if (currentProduct.imageUrl) {
        urlsToDelete.push(currentProduct.imageUrl);
      }
    }

    // Handle supporting photo 1 (order 1) - fixed slot mapping
    if (validated.supportingPhoto1Url) {
      if (existingSupportingPhoto1) {
        // Update existing record if URL changed
        if (existingSupportingPhoto1.url !== validated.supportingPhoto1Url) {
          urlsToDelete.push(existingSupportingPhoto1.url);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await ((prisma as any).productImage.update as any)({
            where: { id: existingSupportingPhoto1.id },
            data: { url: validated.supportingPhoto1Url },
          });
        }
      } else {
        // Create new ProductImage record at order 1
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await ((prisma as any).productImage.create as any)({
          data: {
            productId: id,
            url: validated.supportingPhoto1Url,
            order: 1,
          },
        });
      }
    } else {
      // Delete supporting photo 1 if it exists (no shifting)
      if (existingSupportingPhoto1) {
        urlsToDelete.push(existingSupportingPhoto1.url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await ((prisma as any).productImage.delete as any)({
          where: { id: existingSupportingPhoto1.id },
        });
      }
    }

    // Handle supporting photo 2 (order 2) - fixed slot mapping
    if (validated.supportingPhoto2Url) {
      if (existingSupportingPhoto2) {
        // Update existing record if URL changed
        if (existingSupportingPhoto2.url !== validated.supportingPhoto2Url) {
          urlsToDelete.push(existingSupportingPhoto2.url);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const productImageUpdate = (prisma as any).productImage.update;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (productImageUpdate as any)({
            where: { id: existingSupportingPhoto2.id },
            data: { url: validated.supportingPhoto2Url },
          });
        }
      } else {
        // Create new ProductImage record at order 2
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productImageCreate = (prisma as any).productImage.create;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (productImageCreate as any)({
          data: {
            productId: id,
            url: validated.supportingPhoto2Url,
            order: 2,
          },
        });
      }
    } else {
      // Delete supporting photo 2 if it exists (no shifting)
      if (existingSupportingPhoto2) {
        urlsToDelete.push(existingSupportingPhoto2.url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productImageDelete = (prisma as any).productImage.delete;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (productImageDelete as any)({
          where: { id: existingSupportingPhoto2.id },
        });
      }
    }

    // Delete old files from UploadThing
    for (const url of urlsToDelete) {
      await deleteUploadThingFile(url);
    }

    // Update the product record
    await prisma.product.update({
      where: { id },
      data: {
        name: validated.name,
        subtitle: validated.subtitle,
        description: validated.description,
        longDescription: validated.longDescription,
        price: validated.price,
        priceSubtext: validated.priceSubtext,
        imageColor: validated.imageColor,
        imageUrl: validated.imageUrl,
        features: validated.features,
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
    // First, get the product with all images to delete from UploadThing
    // Type assertion needed due to Prisma Proxy wrapper interfering with type inference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const product = (await (prisma.product.findUnique as any)({
      where: { id },
      select: {
        imageUrl: true,
        images: {
          select: {
            url: true,
          },
        },
      },
    })) as
      | {
          imageUrl: string | null;
          images: Array<{ url: string }>;
        }
      | null;

    // Delete all images from UploadThing
    if (product?.imageUrl) {
      await deleteUploadThingFile(product.imageUrl);
    }
    
    // Delete all ProductImage records (cascade delete should handle this, but we'll delete files first)
    for (const image of product?.images || []) {
      await deleteUploadThingFile(image.url);
    }

    // Delete the product from the database (cascade delete will remove ProductImage records)
    await prisma.product.delete({ where: { id } });

    revalidatePath("/shop");
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
