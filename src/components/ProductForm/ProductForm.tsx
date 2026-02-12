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
  imageUrl: z.string().url("Main photo is required").min(1, "Main photo is required"),
  supportingPhoto1Url: z.string().url().optional().nullable(),
  supportingPhoto2Url: z.string().url().optional().nullable(),
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
    images?: Array<{ url: string; order: number }>;
    features: Array<{ text: string; color: string }>;
    ingredients: string[] | null;
    productBrief: string | null;
  };
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMainImageUploading, setIsMainImageUploading] = useState(false);
  // Supporting image upload states are kept for future use
  const [_isSupportingImage1Uploading, setIsSupportingImage1Uploading] = useState(false);
  const [_isSupportingImage2Uploading, setIsSupportingImage2Uploading] = useState(false);
  
  // Load images from product.images array (ordered by order field)
  const initialMainPhotoUrl = product?.imageUrl || product?.images?.find(img => img.order === 0)?.url || null;
  const initialSupportingPhoto1Url = product?.images?.find(img => img.order === 1)?.url || null;
  const initialSupportingPhoto2Url = product?.images?.find(img => img.order === 2)?.url || null;
  
  const [uploadedMainPhotoUrl, setUploadedMainPhotoUrl] = useState<string | null>(initialMainPhotoUrl);
  const [uploadedSupportingPhoto1Url, setUploadedSupportingPhoto1Url] = useState<string | null>(initialSupportingPhoto1Url);
  const [uploadedSupportingPhoto2Url, setUploadedSupportingPhoto2Url] = useState<string | null>(initialSupportingPhoto2Url);
  
  // Use refs to ensure we always have the latest values
  const mainPhotoUrlRef = useRef<string | null>(initialMainPhotoUrl);
  const supportingPhoto1UrlRef = useRef<string | null>(initialSupportingPhoto1Url);
  const supportingPhoto2UrlRef = useRef<string | null>(initialSupportingPhoto2Url);

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
      imageUrl: initialMainPhotoUrl || undefined,
      supportingPhoto1Url: initialSupportingPhoto1Url || undefined,
      supportingPhoto2Url: initialSupportingPhoto2Url || undefined,
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
  } = useFieldArray({
    control,
    // @ts-expect-error - ingredients is a valid field in FormData, but TypeScript's inference is too strict
    name: "ingredients",
  });

  const imageUrl = watch("imageUrl");
  const supportingPhoto1Url = watch("supportingPhoto1Url");
  const supportingPhoto2Url = watch("supportingPhoto2Url");

  // Update refs when values change
  useEffect(() => {
    if (imageUrl) {
      mainPhotoUrlRef.current = imageUrl;
    }
  }, [imageUrl]);

  useEffect(() => {
    if (supportingPhoto1Url) {
      supportingPhoto1UrlRef.current = supportingPhoto1Url;
    }
  }, [supportingPhoto1Url]);

  useEffect(() => {
    if (supportingPhoto2Url) {
      supportingPhoto2UrlRef.current = supportingPhoto2Url;
    }
  }, [supportingPhoto2Url]);

  // Also update refs when uploaded values change
  useEffect(() => {
    if (uploadedMainPhotoUrl) {
      mainPhotoUrlRef.current = uploadedMainPhotoUrl;
    }
  }, [uploadedMainPhotoUrl]);

  useEffect(() => {
    if (uploadedSupportingPhoto1Url) {
      supportingPhoto1UrlRef.current = uploadedSupportingPhoto1Url;
    }
  }, [uploadedSupportingPhoto1Url]);

  useEffect(() => {
    if (uploadedSupportingPhoto2Url) {
      supportingPhoto2UrlRef.current = uploadedSupportingPhoto2Url;
    }
  }, [uploadedSupportingPhoto2Url]);

  // Sync hidden inputs with current values
  useEffect(() => {
    const currentMainPhoto = imageUrl || uploadedMainPhotoUrl || mainPhotoUrlRef.current;
    if (currentMainPhoto) {
      setValue("imageUrl", currentMainPhoto, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [imageUrl, uploadedMainPhotoUrl, setValue]);

  useEffect(() => {
    const currentPhoto1 = supportingPhoto1Url || uploadedSupportingPhoto1Url || supportingPhoto1UrlRef.current;
    setValue("supportingPhoto1Url", currentPhoto1 || undefined, {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [supportingPhoto1Url, uploadedSupportingPhoto1Url, setValue]);

  useEffect(() => {
    const currentPhoto2 = supportingPhoto2Url || uploadedSupportingPhoto2Url || supportingPhoto2UrlRef.current;
    setValue("supportingPhoto2Url", currentPhoto2 || undefined, {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [supportingPhoto2Url, uploadedSupportingPhoto2Url, setValue]);

  const onSubmit = async (data: FormData): Promise<void> => {
    // Prevent submission if main image is still uploading
    if (isMainImageUploading) {
      setError(
        "Please wait for the main photo upload to complete before submitting.",
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
        mainPhotoUrlRef.current ||
        uploadedMainPhotoUrl ||
        imageUrl ||
        data.imageUrl ||
        getValues("imageUrl")
      )?.trim() || null;

    // Validate main photo is required
    if (!currentImageUrl) {
      setError("Main photo is required. Please upload a main photo before submitting.");
      setIsSubmitting(false);
      return;
    }

    // Get supporting photo URLs
    const currentSupportingPhoto1Url =
      (
        supportingPhoto1UrlRef.current ||
        uploadedSupportingPhoto1Url ||
        supportingPhoto1Url ||
        data.supportingPhoto1Url ||
        getValues("supportingPhoto1Url")
      )?.trim() || null;

    const currentSupportingPhoto2Url =
      (
        supportingPhoto2UrlRef.current ||
        uploadedSupportingPhoto2Url ||
        supportingPhoto2Url ||
        data.supportingPhoto2Url ||
        getValues("supportingPhoto2Url")
      )?.trim() || null;

    const formData: ProductFormData = {
      name: data.name,
      subtitle: data.subtitle,
      description: data.description,
      longDescription,
      price: data.price,
      priceSubtext: data.priceSubtext,
      imageColor: data.imageColor,
      imageUrl: currentImageUrl,
      supportingPhoto1Url: currentSupportingPhoto1Url || null,
      supportingPhoto2Url: currentSupportingPhoto2Url || null,
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
      {/* Hidden inputs to ensure image URLs are tracked by react-hook-form */}
      <input type="hidden" {...register("imageUrl")} />
      <input type="hidden" {...register("supportingPhoto1Url")} />
      <input type="hidden" {...register("supportingPhoto2Url")} />
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

        <S.FormGroup $fullWidth>
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

        <S.SubsectionTitle>Main Photo</S.SubsectionTitle>
        <S.FormGroup $fullWidth>
          <S.Label>Main Photo *</S.Label>
          <ImageUpload
            value={imageUrl || uploadedMainPhotoUrl || ""}
            onChange={(url) => {
              mainPhotoUrlRef.current = url;
              setUploadedMainPhotoUrl(url);
              setValue("imageUrl", url, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
              setIsMainImageUploading(false);
            }}
            onUploadStart={() => {
              setIsMainImageUploading(true);
            }}
            endpoint="productImage"
          />
          {errors.imageUrl && (
            <S.FieldError>{errors.imageUrl.message}</S.FieldError>
          )}
        </S.FormGroup>

        <S.SubsectionTitle>Supporting Photos</S.SubsectionTitle>
        <S.FormGroup $fullWidth>
          <S.SupportingPhotosContainer>
            <S.SupportingPhotoWrapper>
              <S.Label>Supporting Photo 1</S.Label>
              <ImageUpload
                value={supportingPhoto1Url || uploadedSupportingPhoto1Url || ""}
                onChange={(url) => {
                  const finalUrl = url?.trim() || null;
                  supportingPhoto1UrlRef.current = finalUrl;
                  setUploadedSupportingPhoto1Url(finalUrl);
                  setValue("supportingPhoto1Url", finalUrl || undefined, {
                    shouldValidate: false,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setIsSupportingImage1Uploading(false);
                }}
                onUploadStart={() => {
                  setIsSupportingImage1Uploading(true);
                }}
                endpoint="productImage"
              />
            </S.SupportingPhotoWrapper>
            <S.SupportingPhotoWrapper>
              <S.Label>Supporting Photo 2</S.Label>
              <ImageUpload
                value={supportingPhoto2Url || uploadedSupportingPhoto2Url || ""}
                onChange={(url) => {
                  const finalUrl = url?.trim() || null;
                  supportingPhoto2UrlRef.current = finalUrl;
                  setUploadedSupportingPhoto2Url(finalUrl);
                  setValue("supportingPhoto2Url", finalUrl || undefined, {
                    shouldValidate: false,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setIsSupportingImage2Uploading(false);
                }}
                onUploadStart={() => {
                  setIsSupportingImage2Uploading(true);
                }}
                endpoint="productImage"
              />
            </S.SupportingPhotoWrapper>
          </S.SupportingPhotosContainer>
        </S.FormGroup>
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
            onClick={() => {
              // @ts-expect-error - appendIngredient accepts string for ingredients array, but TypeScript infers wrong type
              appendIngredient("" as string);
            }}
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
          disabled={isSubmitting || isMainImageUploading}
        >
          {isSubmitting
            ? "Saving..."
            : isMainImageUploading
              ? "Uploading Main Photo..."
              : product
                ? "Update Product"
                : "Create Product"}
        </S.SubmitButton>
      </S.ButtonGroup>
    </S.Form>
  );
}
