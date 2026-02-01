"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageUsers } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

const userCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPERADMIN", "ADMIN", "EDITOR"]),
});

const userUpdateSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().min(1, "Name is required").optional(),
  role: z.enum(["SUPERADMIN", "ADMIN", "EDITOR"]).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type UserCreateData = z.infer<typeof userCreateSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;

/**
 * Get all users (SUPERADMIN only)
 */
export async function getUsers(): Promise<ActionResult<Array<{
  id: string;
  email: string;
  name: string | null;
  role: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  hasOAuthAccount: boolean;
}>>> {
  const session = await auth();
  if (!session?.user || !canManageUsers(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const usersWithOAuth = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      hasOAuthAccount: user.accounts.some(
        (account) => account.provider !== "credentials"
      ),
    }));

    return { success: true, data: usersWithOAuth };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

/**
 * Create a new user (SUPERADMIN only)
 */
export async function createUser(
  data: UserCreateData
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user || !canManageUsers(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const validated = userCreateSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        password: hashedPassword,
        role: validated.role,
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true, data: { id: user.id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

/**
 * Update a user (SUPERADMIN only)
 */
export async function updateUser(
  id: string,
  data: UserUpdateData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !canManageUsers(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Prevent SUPERADMIN from demoting themselves
    if (session.user.id === id && data.role && data.role !== "SUPERADMIN") {
      return {
        success: false,
        error: "You cannot change your own role from SUPERADMIN",
      };
    }

    const validated = userUpdateSchema.parse(data);

    // Check if email is being changed and if it already exists
    if (validated.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validated.email },
      });

      if (existingUser && existingUser.id !== id) {
        return { success: false, error: "User with this email already exists" };
      }
    }

    // Prepare update data
    const updateData: {
      email?: string;
      name?: string;
      role?: Role;
      password?: string;
    } = {};

    if (validated.email) {
      updateData.email = validated.email;
    }
    if (validated.name) {
      updateData.name = validated.name;
    }
    if (validated.role) {
      updateData.role = validated.role as Role;
    }
    if (validated.password) {
      updateData.password = await bcrypt.hash(validated.password, 12);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

/**
 * Delete a user (SUPERADMIN only)
 */
export async function deleteUser(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !canManageUsers(session.user.role)) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Prevent self-deletion
    if (session.user.id === id) {
      return { success: false, error: "You cannot delete your own account" };
    }

    await prisma.user.delete({ where: { id } });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
