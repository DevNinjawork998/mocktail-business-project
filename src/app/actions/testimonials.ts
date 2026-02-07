"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEditorRoles, getDeleterRoles } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

const testimonialSchema = z.object({
  text: z.string().min(1, "Testimonial text is required"),
  customerName: z.string().min(1, "Customer name is required"),
  avatarColor: z.string().min(1, "Avatar color is required"),
  rating: z.number().int().min(1).max(5).default(5),
  order: z.number().int().min(0).default(0),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

export async function createTestimonial(
  data: TestimonialFormData,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = testimonialSchema.parse(data);
    const testimonial = await prisma.testimonial.create({
      data: validated,
    });

    revalidatePath("/your-buddies");
    revalidatePath("/dashboard/testimonials");
    return { success: true, data: { id: testimonial.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error creating testimonial:", error);
    return { success: false, error: "Failed to create testimonial" };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getDeleterRoles().includes(session.user.role)) {
    return { success: false, error: "Only admins can delete testimonials" };
  }

  try {
    await prisma.testimonial.delete({ where: { id } });

    revalidatePath("/your-buddies");
    revalidatePath("/dashboard/testimonials");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Failed to delete testimonial" };
  }
}
