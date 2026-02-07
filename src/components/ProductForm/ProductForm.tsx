"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUpload from "@/components/ImageUpload";
import {
  createProduct,
  updateProduct,
  type ProductFormData,
} from "@/app/actions/products";
import * as S from "./ProductForm.styles";
import { parseLongDescription, combineLongDescription } from "./helpers";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  longDescriptionSectionTitle: z.string(),
  longDescriptionParagraphs: z
    .array(z.object({ value: z.string() }))
    .min(1, "At least one paragraph is required")
    .refine(
      (paragraphs) => paragraphs.some((p) => p.value.trim().length > 0),
      "At least one paragraph must not be empty",
    ),
  price: z.string().min(1, "Price is required"),
  priceSubtext: z.string().min(1, "Price subtext is required"),
  imageColor: z.string().min(1, "Image color is required"),
  imageUrl: z.string().optional().nullable(),
  features: z.array(z.object({ text: z.string(), color: z.string() })),
  ingredients: z.array(z.string()),
  productBrief: z.string().optional().nullable(),
});

type FormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    longDescription: string;
    price: string;
    priceSubtext: string;
    imageColor: string;
    imageUrl: string | null;
    features: Array<{ text: string; color: string }>;
    ingredients: string[] | null;
    productBrief: string | null;
  };
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    product?.imageUrl || null,
  );
  // Use a ref to ensure we always have the latest imageUrl value
  const imageUrlRef = useRef<string | null>(product?.imageUrl || null);

  // Parse existing longDescription if editing
  const parsedDescription = useMemo(() => {
    if (product?.longDescription) {
      const parsed = parseLongDescription(product.longDescription);
      return {
        sectionTitle: parsed.sectionTitle,
        paragraphs: parsed.paragraphs.map((p) => ({ value: p })),
      };
    }
    return { sectionTitle: "", paragraphs: [{ value: "" }] };
  }, [product?.longDescription]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      subtitle: product?.subtitle || "",
      description: product?.description || "",
      longDescriptionSectionTitle: parsedDescription.sectionTitle,
      longDescriptionParagraphs: parsedDescription.paragraphs,
      price: product?.price || "",
      priceSubtext: product?.priceSubtext || "",
      imageColor: product?.imageColor || "#451515",
      imageUrl: product?.imageUrl || null,
      features: product?.features || [{ text: "", color: "#451515" }],
      ingredients: (product?.ingredients ?? []) as string[],
      productBrief: product?.productBrief || "",
    },
  });

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({ control, name: "features" });

  const {
    fields: paragraphFields,
    append: appendParagraph,
    remove: removeParagraph,
  } = useFieldArray({
    control,
    name: "longDescriptionParagraphs",
  });

  // TypeScript incorrectly infers that only "longDescriptionParagraphs" | "features" are valid
  // field array names, but "ingredients" is a valid string[] field in FormData.
  // This is a known limitation with react-hook-form's type inference for optional array fields.
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
    name: "ingredients" as any,
  });

  const imageUrl = watch("imageUrl");

  // Update ref when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      imageUrlRef.current = imageUrl;
    }
  }, [imageUrl]);

  // Also update ref when uploadedImageUrl changes
  useEffect(() => {
    if (uploadedImageUrl) {
      imageUrlRef.current = uploadedImageUrl;
    }
  }, [uploadedImageUrl]);

  // Sync hidden input with current imageUrl value
  useEffect(() => {
    const currentValue = imageUrl || uploadedImageUrl || imageUrlRef.current;
    if (currentValue) {
      setValue("imageUrl", currentValue, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [imageUrl, uploadedImageUrl, setValue]);

  const onSubmit = async (data: FormData) => {
    // Prevent submission if image is still uploading
    if (isImageUploading) {
      setError(
        "Please wait for the image upload to complete before submitting.",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Combine section title and paragraphs into HTML
    const longDescription = combineLongDescription(
      data.longDescriptionSectionTitle,
      data.longDescriptionParagraphs.map((p) => p.value),
    );

    // Get the current imageUrl value - check all possible sources including ref
    const currentImageUrl =
      (
        imageUrlRef.current ||
        uploadedImageUrl ||
        imageUrl ||
        data.imageUrl ||
        getValues("imageUrl")
      )?.trim() || null;

    const formData: ProductFormData = {
      name: data.name,
      subtitle: data.subtitle,
      description: data.description,
      longDescription,
      price: data.price,
      priceSubtext: data.priceSubtext,
      imageColor: data.imageColor,
      imageUrl: currentImageUrl || null,
      features: data.features,
      ingredients: data.ingredients.filter((i) => i.trim()).length > 0
        ? data.ingredients.filter((i) => i.trim())
        : null,
      productBrief: data.productBrief || null,
    };

    const result = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData);

    if (result.success) {
      router.push("/dashboard/products");
      router.refresh();
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <S.Form onSubmit={handleSubmit(onSubmit)}>
      {/* Hidden input to ensure imageUrl is tracked by react-hook-form */}
      <input type="hidden" {...register("imageUrl")} />
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

      <S.Section>
        <S.SectionTitle>Basic Information</S.SectionTitle>

        <S.FormGroup $fullWidth>
          <S.Label>Name *</S.Label>
          <S.NameInput {...register("name")} $hasError={!!errors.name} />
          {errors.name && <S.FieldError>{errors.name.message}</S.FieldError>}
        </S.FormGroup>

        <S.FormGroup $fullWidth>
          <S.Label>Subtitle *</S.Label>
          <S.SubtitleInput
            {...register("subtitle")}
            $hasError={!!errors.subtitle}
          />
          {errors.subtitle && (
            <S.FieldError>{errors.subtitle.message}</S.FieldError>
          )}
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
      </S.Section>

      <S.Section>
        <S.SectionTitle>Long Description</S.SectionTitle>

        <S.FormGroup $fullWidth>
          <S.Label>Section Title</S.Label>
          <S.Input
            {...register("longDescriptionSectionTitle")}
            placeholder="e.g., Stamina & Libido Boost"
          />
          <S.HelpText>
            Optional: A heading that will appear above the description
            paragraphs
          </S.HelpText>
        </S.FormGroup>

        <S.FormGroup $fullWidth>
          <S.Label>Paragraphs *</S.Label>
          {paragraphFields.map((field, index) => (
            <S.ParagraphRow key={field.id}>
              <S.TextArea
                {...register(`longDescriptionParagraphs.${index}.value`)}
                rows={3}
                placeholder={`Paragraph ${index + 1}...`}
                $hasError={!!errors.longDescriptionParagraphs}
              />
              {paragraphFields.length > 1 && (
                <S.RemoveButton
                  type="button"
                  onClick={() => removeParagraph(index)}
                >
                  ×
                </S.RemoveButton>
              )}
            </S.ParagraphRow>
          ))}
          {errors.longDescriptionParagraphs && (
            <S.FieldError>
              {errors.longDescriptionParagraphs.message ||
                "At least one paragraph is required"}
            </S.FieldError>
          )}
          <S.AddButton
            type="button"
            onClick={() => appendParagraph({ value: "" })}
          >
            + Add Paragraph
          </S.AddButton>
        </S.FormGroup>
      </S.Section>

      <S.Section>
        <S.SectionTitle>Pricing</S.SectionTitle>

        <S.FormGrid>
          <S.FormGroup>
            <S.Label>Price *</S.Label>
            <S.Input
              {...register("price")}
              placeholder="$35.99"
              $hasError={!!errors.price}
            />
            {errors.price && (
              <S.FieldError>{errors.price.message}</S.FieldError>
            )}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Price Subtext *</S.Label>
            <S.Input
              {...register("priceSubtext")}
              placeholder="12 cans delivered one time"
              $hasError={!!errors.priceSubtext}
            />
            {errors.priceSubtext && (
              <S.FieldError>{errors.priceSubtext.message}</S.FieldError>
            )}
          </S.FormGroup>
        </S.FormGrid>
      </S.Section>

      <S.Section>
        <S.SectionTitle>Image</S.SectionTitle>

        <S.FormGrid>
          <S.FormGroup>
            <S.Label>Image Color *</S.Label>
            <S.ColorInput
              type="color"
              {...register("imageColor")}
              $hasError={!!errors.imageColor}
            />
            {errors.imageColor && (
              <S.FieldError>{errors.imageColor.message}</S.FieldError>
            )}
          </S.FormGroup>

          <S.FormGroup>
            <ImageUpload
              value={imageUrl || uploadedImageUrl || ""}
              onChange={(url) => {
                imageUrlRef.current = url;
                setUploadedImageUrl(url);
                setValue("imageUrl", url, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                setIsImageUploading(false);
              }}
              onUploadStart={() => {
                setIsImageUploading(true);
              }}
              endpoint="productImage"
              label="Product Image"
            />
          </S.FormGroup>
        </S.FormGrid>
      </S.Section>

      <S.Section>
        <S.SectionTitle>Features</S.SectionTitle>

        {featureFields.map((field, index) => (
          <S.DynamicRow key={field.id}>
            <S.Input
              {...register(`features.${index}.text`)}
              placeholder="Feature text"
            />
            <S.ColorInput
              type="color"
              {...register(`features.${index}.color`)}
            />
            <S.RemoveButton type="button" onClick={() => removeFeature(index)}>
              ×
            </S.RemoveButton>
          </S.DynamicRow>
        ))}

        <S.AddButton
          type="button"
          onClick={() => appendFeature({ text: "", color: "#451515" })}
        >
          + Add Feature
        </S.AddButton>
      </S.Section>

      <S.Section>
        <S.SectionTitle>Additional Information</S.SectionTitle>

        <S.FormGroup $fullWidth>
          <S.Label>Ingredients</S.Label>
          {ingredientFields.map((field, index) => (
            <S.DynamicRow key={field.id}>
              <S.Input
                {...register(`ingredients.${index}`)}
                placeholder="Ingredient name"
              />
              {ingredientFields.length > 1 && (
                <S.RemoveButton
                  type="button"
                  onClick={() => removeIngredient(index)}
                >
                  ×
                </S.RemoveButton>
              )}
            </S.DynamicRow>
          ))}
          <S.AddButton
            type="button"
            onClick={() => appendIngredient("")}
          >
            + Add Ingredient
          </S.AddButton>
        </S.FormGroup>

        <S.FormGroup $fullWidth>
          <S.Label>Product Brief</S.Label>
          <S.TextArea {...register("productBrief")} rows={3} />
        </S.FormGroup>
      </S.Section>

      <S.ButtonGroup>
        <S.CancelButton type="button" onClick={() => router.back()}>
          Cancel
        </S.CancelButton>
        <S.SubmitButton
          type="submit"
          disabled={isSubmitting || isImageUploading}
        >
          {isSubmitting
            ? "Saving..."
            : isImageUploading
              ? "Uploading Image..."
              : product
                ? "Update Product"
                : "Create Product"}
        </S.SubmitButton>
      </S.ButtonGroup>
    </S.Form>
  );
}
