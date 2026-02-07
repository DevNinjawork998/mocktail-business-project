import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";
import { getEditorRoles } from "@/lib/permissions";

const f = createUploadthing();

export const ourFileRouter = {
  // Image uploader for products
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      if (!getEditorRoles().includes(session.user.role)) {
        throw new Error("Insufficient permissions");
      }

      return { userId: session.user.id, role: session.user.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  // Image uploader for ingredients
  ingredientImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      if (!getEditorRoles().includes(session.user.role)) {
        throw new Error("Insufficient permissions");
      }

      return { userId: session.user.id, role: session.user.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  // Image uploader for landing photo
  landingPhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      if (!getEditorRoles().includes(session.user.role)) {
        throw new Error("Insufficient permissions");
      }

      return { userId: session.user.id, role: session.user.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
