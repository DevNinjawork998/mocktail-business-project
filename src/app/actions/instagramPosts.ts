"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEditorRoles, getDeleterRoles } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isValidInstagramPostUrl, normalizeInstagramUrl } from "@/lib/instagram";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

const instagramPostSchema = z.object({
  postUrl: z
    .string()
    .min(1, "Instagram post URL is required")
    .refine(
      (url) => isValidInstagramPostUrl(url),
      "Must be a valid Instagram post URL (e.g., https://www.instagram.com/p/POST_ID/)",
    ),
  imageUrl: z.string().url("Image URL is required").min(1, "Image is required"),
  order: z.number().int().min(0).default(0),
});

export type InstagramPostFormData = z.infer<typeof instagramPostSchema>;

export async function createInstagramPost(
  data: InstagramPostFormData,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user || !getEditorRoles().includes(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = instagramPostSchema.parse(data);
    
    // Normalize the URL to standard format
    const normalizedUrl = normalizeInstagramUrl(validated.postUrl);

    const instagramPost = await prisma.instagramPost.create({
      data: {
        postUrl: normalizedUrl,
        imageUrl: validated.imageUrl,
        order: validated.order,
      },
    });

    revalidatePath("/your-buddies");
    revalidatePath("/dashboard/community");
    return { success: true, data: { id: instagramPost.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error creating Instagram post:", error);
    return { success: false, error: "Failed to create Instagram post" };
  }
}

export async function deleteInstagramPost(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !getDeleterRoles().includes(session.user.role)) {
    return { success: false, error: "Only admins can delete Instagram posts" };
  }

  try {
    await prisma.instagramPost.delete({ where: { id } });

    revalidatePath("/your-buddies");
    revalidatePath("/dashboard/community");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Instagram post:", error);
    return { success: false, error: "Failed to delete Instagram post" };
  }
}
