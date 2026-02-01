"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

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
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
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
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = ingredientSchema.parse(data);
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
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Only admins can delete ingredients" };
  }

  try {
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
