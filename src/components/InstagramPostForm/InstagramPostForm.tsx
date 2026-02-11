"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createInstagramPost,
  type InstagramPostFormData,
} from "@/app/actions/instagramPosts";
import ImageUpload from "../ImageUpload/ImageUpload";
import * as S from "../ProductForm/ProductForm.styles";

const instagramPostSchema = z.object({
  postUrl: z
    .string()
    .min(1, "Instagram post URL is required")
    .refine(
      (url) => {
        // Basic validation - full validation happens on server
        return (
          url.includes("instagram.com/p/") || url.includes("instagr.am/p/")
        );
      },
      "Must be a valid Instagram post URL",
    ),
  imageUrl: z.string().url("Image is required"),
  order: z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof instagramPostSchema>;

export default function InstagramPostForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(instagramPostSchema),
    defaultValues: {
      postUrl: "",
      imageUrl: "",
      order: 0,
    },
  });

  const watchedImageUrl = watch("imageUrl");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    const formData: InstagramPostFormData = {
      postUrl: data.postUrl,
      imageUrl: data.imageUrl,
      order: data.order,
    };

    const result = await createInstagramPost(formData);

    if (result.success) {
      router.push("/dashboard/community");
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
        <S.SectionTitle>Instagram Post Information</S.SectionTitle>

        <S.FormGroup $fullWidth>
          <S.Label>Instagram Post URL *</S.Label>
          <S.Input
            {...register("postUrl")}
            placeholder="https://www.instagram.com/p/DQZKnWXkqT-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
            $hasError={!!errors.postUrl}
          />
          {errors.postUrl && (
            <S.FieldError>{errors.postUrl.message}</S.FieldError>
          )}
          <S.HelpText>
            Paste the full Instagram post URL. Example:
            https://www.instagram.com/p/POST_ID/
          </S.HelpText>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>Display Order</S.Label>
          <S.Input
            type="number"
            {...register("order", { valueAsNumber: true })}
            placeholder="0"
            $hasError={!!errors.order}
          />
          {errors.order && (
            <S.FieldError>{errors.order.message}</S.FieldError>
          )}
          <S.HelpText>
            Lower numbers appear first. Default is 0.
          </S.HelpText>
        </S.FormGroup>
      </S.Section>

      <S.Section>
        <S.SectionTitle>Post Image</S.SectionTitle>

        <S.FormGroup $fullWidth>
          <ImageUpload
            value={watchedImageUrl || imageUrl || ""}
            onChange={(url) => {
              setImageUrl(url);
              setValue("imageUrl", url, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
            endpoint="productImage"
            label="Instagram Post Image *"
          />
          {errors.imageUrl && (
            <S.FieldError>{errors.imageUrl.message}</S.FieldError>
          )}
          <S.HelpText>
            Upload the image from the Instagram post. This will be displayed in the community section.
          </S.HelpText>
        </S.FormGroup>
      </S.Section>

      <S.ButtonGroup>
        <S.CancelButton type="button" onClick={() => router.back()}>
          Cancel
        </S.CancelButton>
        <S.SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Instagram Post"}
        </S.SubmitButton>
      </S.ButtonGroup>
    </S.Form>
  );
}
