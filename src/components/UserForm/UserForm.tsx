"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createUser,
  updateUser,
  type UserCreateData,
  type UserUpdateData,
} from "@/app/actions/users";
import * as S from "../ProductForm/ProductForm.styles";

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

type CreateFormData = z.infer<typeof userCreateSchema>;
type UpdateFormData = z.infer<typeof userUpdateSchema>;

interface UserFormProps {
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
  currentUserId?: string;
}

export default function UserForm({ user, currentUserId }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [changePassword, setChangePassword] = useState(false);

  const isEditing = !!user;
  const isSelf = user?.id === currentUserId;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData | UpdateFormData>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userCreateSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      role: (user?.role as "SUPERADMIN" | "ADMIN" | "EDITOR") || "EDITOR",
      password: "",
    },
  });

  const onSubmit = async (data: CreateFormData | UpdateFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        const updateData: UserUpdateData = {
          email: data.email,
          name: data.name,
          role: data.role,
        };

        // Only include password if user wants to change it
        if (changePassword && data.password) {
          updateData.password = data.password;
        }

        const result = await updateUser(user.id, updateData);
        if (result.success) {
          router.push("/dashboard/users");
          router.refresh();
        } else {
          setError(result.error);
          setIsSubmitting(false);
        }
      } else {
        const createData: UserCreateData = {
          email: data.email!,
          name: data.name!,
          password: data.password!,
          role: data.role!,
        };

        const result = await createUser(createData);
        if (result.success) {
          router.push("/dashboard/users");
          router.refresh();
        } else {
          setError(result.error);
          setIsSubmitting(false);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <S.Form onSubmit={handleSubmit(onSubmit)}>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

      <S.Section>
        <S.SectionTitle>User Information</S.SectionTitle>

        <S.FormGrid>
          <S.FormGroup $fullWidth>
            <S.Label>Email *</S.Label>
            <S.Input
              type="email"
              {...register("email", { required: !isEditing })}
              $hasError={!!errors.email}
              disabled={isEditing}
            />
            {errors.email && <S.FieldError>{errors.email.message}</S.FieldError>}
            {isEditing && (
              <S.HelpText>Email cannot be changed after user creation</S.HelpText>
            )}
          </S.FormGroup>

          <S.FormGroup $fullWidth>
            <S.Label>Name *</S.Label>
            <S.Input
              {...register("name", { required: !isEditing })}
              $hasError={!!errors.name}
            />
            {errors.name && <S.FieldError>{errors.name.message}</S.FieldError>}
          </S.FormGroup>

          <S.FormGroup $fullWidth>
            <S.Label>Role *</S.Label>
            <S.Input
              as="select"
              {...register("role", { required: true })}
              $hasError={!!errors.role}
              disabled={isSelf}
            >
              <option value="EDITOR">EDITOR</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERADMIN">SUPERADMIN</option>
            </S.Input>
            {errors.role && <S.FieldError>{errors.role.message}</S.FieldError>}
            {isSelf && (
              <S.HelpText>
                You cannot change your own role from SUPERADMIN
              </S.HelpText>
            )}
          </S.FormGroup>

          {isEditing ? (
            <>
              <S.FormGroup $fullWidth>
                <S.Label>
                  <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                    style={{ marginRight: "8px" }}
                  />
                  Change Password
                </S.Label>
                {changePassword && (
                  <>
                    <S.Input
                      type="password"
                      {...register("password")}
                      placeholder="New password"
                      $hasError={!!errors.password}
                    />
                    {errors.password && (
                      <S.FieldError>{errors.password.message}</S.FieldError>
                    )}
                    <S.HelpText>
                      Leave blank to keep current password
                    </S.HelpText>
                  </>
                )}
              </S.FormGroup>
            </>
          ) : (
            <S.FormGroup $fullWidth>
              <S.Label>Password *</S.Label>
              <S.Input
                type="password"
                {...register("password", { required: true })}
                $hasError={!!errors.password}
              />
              {errors.password && (
                <S.FieldError>{errors.password.message}</S.FieldError>
              )}
              <S.HelpText>
                User can change password after first login
              </S.HelpText>
            </S.FormGroup>
          )}
        </S.FormGrid>
      </S.Section>

      <S.ButtonGroup>
        <S.CancelButton type="button" onClick={() => router.back()}>
          Cancel
        </S.CancelButton>
        <S.SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
              ? "Update User"
              : "Create User"}
        </S.SubmitButton>
      </S.ButtonGroup>
    </S.Form>
  );
}
