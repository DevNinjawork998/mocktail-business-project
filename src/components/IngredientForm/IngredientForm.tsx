"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUpload from "@/components/ImageUpload";
import {
  createIngredient,
  updateIngredient,
  type IngredientFormData,
} from "@/app/actions/ingredients";
import * as S from "../ProductForm/ProductForm.styles";

const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
  imageUrl: z.string().optional().nullable(),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["Adaptogen", "Fruit"]),
  order: z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof ingredientSchema>;

interface IngredientFormProps {
  ingredient?: {
    id: string;
    name: string;
    icon: string;
    imageUrl: string | null;
    subtitle: string;
    description: string;
    type: string;
    order: number;
  };
}

export default function IngredientForm({ ingredient }: IngredientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: ingredient?.name || "",
      icon: ingredient?.icon || "",
      imageUrl: ingredient?.imageUrl || "",
      subtitle: ingredient?.subtitle || "",
      description: ingredient?.description || "",
      type: (ingredient?.type as "Adaptogen" | "Fruit") || "Adaptogen",
      order: ingredient?.order || 0,
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    const formData: IngredientFormData = {
      ...data,
      imageUrl: data.imageUrl || null,
    };

    const result = ingredient
      ? await updateIngredient(ingredient.id, formData)
      : await createIngredient(formData);

    if (result.success) {
      router.push("/dashboard/ingredients");
      router.refresh();
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <S.Form onSubmit={handleSubmit(onSubmit)}>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

      <S.Section>
        <S.SectionTitle>Basic Information</S.SectionTitle>

        <S.FormGrid>
          <S.FormGroup>
            <S.Label>Name *</S.Label>
            <S.Input {...register("name")} $hasError={!!errors.name} />
            {errors.name && <S.FieldError>{errors.name.message}</S.FieldError>}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Icon (Emoji) *</S.Label>
            <S.Input
              {...register("icon")}
              placeholder="🌿"
              $hasError={!!errors.icon}
            />
            {errors.icon && <S.FieldError>{errors.icon.message}</S.FieldError>}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Subtitle *</S.Label>
            <S.Input {...register("subtitle")} $hasError={!!errors.subtitle} />
            {errors.subtitle && (
              <S.FieldError>{errors.subtitle.message}</S.FieldError>
            )}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Type *</S.Label>
            <S.Input as="select" {...register("type")} $hasError={!!errors.type}>
              <option value="Adaptogen">Adaptogen</option>
              <option value="Fruit">Fruit</option>
            </S.Input>
            {errors.type && <S.FieldError>{errors.type.message}</S.FieldError>}
          </S.FormGroup>

          <S.FormGroup $fullWidth>
            <S.Label>Description *</S.Label>
            <S.TextArea
              {...register("description")}
              rows={3}
              $hasError={!!errors.description}
            />
            {errors.description && (
              <S.FieldError>{errors.description.message}</S.FieldError>
            )}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Display Order</S.Label>
            <S.Input
              type="number"
              {...register("order", { valueAsNumber: true })}
              $hasError={!!errors.order}
            />
            {errors.order && (
              <S.FieldError>{errors.order.message}</S.FieldError>
            )}
          </S.FormGroup>
        </S.FormGrid>
      </S.Section>

      <S.Section>
        <S.SectionTitle>Image</S.SectionTitle>

        <ImageUpload
          value={imageUrl || ""}
          onChange={(url) => setValue("imageUrl", url)}
          endpoint="ingredientImage"
          label="Ingredient Image"
        />
      </S.Section>

      <S.ButtonGroup>
        <S.CancelButton type="button" onClick={() => router.back()}>
          Cancel
        </S.CancelButton>
        <S.SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : ingredient
              ? "Update Ingredient"
              : "Create Ingredient"}
        </S.SubmitButton>
      </S.ButtonGroup>
    </S.Form>
  );
}
