"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

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
  nutritionFacts: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional()
    .nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export async function createProduct(
  data: ProductFormData
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
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
        nutritionFacts: validated.nutritionFacts || [],
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
  data: ProductFormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = productSchema.parse(data);
    await prisma.product.update({
      where: { id },
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
        ingredients: validated.ingredients || [],
        productBrief: validated.productBrief || null,
        nutritionFacts: validated.nutritionFacts || [],
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
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Only admins can delete products" };
  }

  try {
    await prisma.product.delete({ where: { id } });

    revalidatePath("/shop");
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
