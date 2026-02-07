"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createTestimonial,
  type TestimonialFormData,
} from "@/app/actions/testimonials";
import * as S from "../ProductForm/ProductForm.styles";

const testimonialSchema = z.object({
  text: z.string().min(1, "Testimonial text is required"),
  customerName: z.string().min(1, "Customer name is required"),
  avatarColor: z.string().min(1, "Avatar color is required"),
  rating: z.coerce.number().int().min(1).max(5),
  order: z.coerce.number().int().min(0),
});

type FormData = z.infer<typeof testimonialSchema>;

// Preset avatar colors matching the existing testimonials
const presetColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#9B59B6",
  "#E67E22",
  "#3498DB",
  "#2ECC71",
  "#F39C12",
];

export default function TestimonialForm() {
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
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      text: "",
      customerName: "",
      avatarColor: "#FF6B6B",
      rating: 5,
      order: 0,
    },
  });

  const avatarColor = watch("avatarColor");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    const formData: TestimonialFormData = {
      text: data.text,
      customerName: data.customerName,
      avatarColor: data.avatarColor,
      rating: data.rating,
      order: data.order,
    };

    const result = await createTestimonial(formData);

    if (result.success) {
      router.push("/dashboard/testimonials");
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
        <S.SectionTitle>Testimonial Information</S.SectionTitle>

        <S.FormGroup $fullWidth>
          <S.Label>Customer Name *</S.Label>
          <S.Input
            {...register("customerName")}
            placeholder="e.g., John Doe"
            $hasError={!!errors.customerName}
          />
          {errors.customerName && (
            <S.FieldError>{errors.customerName.message}</S.FieldError>
          )}
        </S.FormGroup>

        <S.FormGroup $fullWidth>
          <S.Label>Testimonial Text *</S.Label>
          <S.TextArea
            {...register("text")}
            rows={5}
            placeholder="Enter the customer's testimonial..."
            $hasError={!!errors.text}
          />
          {errors.text && <S.FieldError>{errors.text.message}</S.FieldError>}
        </S.FormGroup>

        <S.FormGrid>
          <S.FormGroup>
            <S.Label>Rating *</S.Label>
            <S.Input
              as="select"
              {...register("rating", { valueAsNumber: true })}
              $hasError={!!errors.rating}
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </S.Input>
            {errors.rating && (
              <S.FieldError>{errors.rating.message}</S.FieldError>
            )}
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
        </S.FormGrid>
      </S.Section>

      <S.Section>
        <S.SectionTitle>Avatar Color</S.SectionTitle>

        <S.FormGroup $fullWidth>
          <S.Label>Avatar Color *</S.Label>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <S.ColorInput
              type="color"
              {...register("avatarColor")}
              $hasError={!!errors.avatarColor}
              style={{ width: "60px", height: "40px" }}
            />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue("avatarColor", color)}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    backgroundColor: color,
                    border:
                      avatarColor === color ? "3px solid #000" : "2px solid #ccc",
                    cursor: "pointer",
                  }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
          {errors.avatarColor && (
            <S.FieldError>{errors.avatarColor.message}</S.FieldError>
          )}
        </S.FormGroup>
      </S.Section>

      <S.ButtonGroup>
        <S.CancelButton type="button" onClick={() => router.back()}>
          Cancel
        </S.CancelButton>
        <S.SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Testimonial"}
        </S.SubmitButton>
      </S.ButtonGroup>
    </S.Form>
  );
}
