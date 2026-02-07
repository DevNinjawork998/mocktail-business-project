"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteTestimonial } from "@/app/actions/testimonials";
import * as S from "../products/ProductsListClient.styles";

interface Testimonial {
  id: string;
  text: string;
  customerName: string;
  avatarColor: string;
  rating: number;
  order: number;
  updatedAt: Date;
}

interface TestimonialsListClientProps {
  testimonials: Testimonial[];
}

export default function TestimonialsListClient({
  testimonials,
}: TestimonialsListClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, customerName: string) => {
    if (!confirm(`Are you sure you want to delete testimonial from "${customerName}"?`)) {
      return;
    }

    setDeletingId(id);
    const result = await deleteTestimonial(id);

    if (!result.success) {
      alert(result.error);
    }

    setDeletingId(null);
    router.refresh();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>{index < rating ? "★" : "☆"}</span>
    ));
  };

  return (
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <S.Title>Testimonials</S.Title>
          <S.Subtitle>{testimonials.length} testimonials total</S.Subtitle>
        </S.HeaderContent>
        <Link href="/dashboard/testimonials/new">
          <S.AddButton>+ Add Testimonial</S.AddButton>
        </Link>
      </S.Header>

      {testimonials.length === 0 ? (
        <S.EmptyState>
          <S.EmptyIcon>💬</S.EmptyIcon>
          <S.EmptyTitle>No testimonials yet</S.EmptyTitle>
          <S.EmptyText>
            Create your first testimonial to get started.
          </S.EmptyText>
          <Link href="/dashboard/testimonials/new">
            <S.AddButton>+ Add Testimonial</S.AddButton>
          </Link>
        </S.EmptyState>
      ) : (
        <S.Table>
          <S.TableHeader>
            <S.TableRow>
              <S.TableHead>Customer</S.TableHead>
              <S.TableHead>Testimonial</S.TableHead>
              <S.TableHead>Rating</S.TableHead>
              <S.TableHead>Updated</S.TableHead>
              <S.TableHead>Actions</S.TableHead>
            </S.TableRow>
          </S.TableHeader>
          <S.TableBody>
            {testimonials.map((testimonial) => (
              <S.TableRow key={testimonial.id}>
                <S.TableCell>
                  <S.ProductInfo>
                    <S.ProductImagePlaceholder
                      style={{ backgroundColor: testimonial.avatarColor }}
                    >
                      {testimonial.customerName[0].toUpperCase()}
                    </S.ProductImagePlaceholder>
                    <S.ProductDetails>
                      <S.ProductName>{testimonial.customerName}</S.ProductName>
                    </S.ProductDetails>
                  </S.ProductInfo>
                </S.TableCell>
                <S.TableCell>
                  <div style={{ maxWidth: "400px" }}>
                    {truncateText(testimonial.text)}
                  </div>
                </S.TableCell>
                <S.TableCell>
                  <div style={{ color: "#FFD700" }}>
                    {renderStars(testimonial.rating)}
                  </div>
                </S.TableCell>
                <S.TableCell>
                  {new Date(testimonial.updatedAt).toLocaleDateString()}
                </S.TableCell>
                <S.TableCell>
                  <S.Actions>
                    <S.DeleteButton
                      onClick={() =>
                        handleDelete(testimonial.id, testimonial.customerName)
                      }
                      disabled={deletingId === testimonial.id}
                    >
                      {deletingId === testimonial.id ? "..." : "Delete"}
                    </S.DeleteButton>
                  </S.Actions>
                </S.TableCell>
              </S.TableRow>
            ))}
          </S.TableBody>
        </S.Table>
      )}
    </S.Container>
  );
}
