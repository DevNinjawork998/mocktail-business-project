"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteTestimonial } from "@/app/actions/testimonials";
import { deleteInstagramPost } from "@/app/actions/instagramPosts";
import { extractInstagramPostId } from "@/lib/instagram";
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

interface InstagramPost {
  id: string;
  postUrl: string;
  imageUrl: string | null;
  order: number;
  updatedAt: Date;
}

interface CommunityListClientProps {
  testimonials: Testimonial[];
  instagramPosts: InstagramPost[];
}

export default function CommunityListClient({
  testimonials,
  instagramPosts,
}: CommunityListClientProps) {
  const router = useRouter();
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<
    string | null
  >(null);
  const [deletingInstagramId, setDeletingInstagramId] = useState<
    string | null
  >(null);

  const handleDeleteTestimonial = async (
    id: string,
    customerName: string,
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete testimonial from "${customerName}"?`,
      )
    ) {
      return;
    }

    setDeletingTestimonialId(id);
    const result = await deleteTestimonial(id);

    if (!result.success) {
      alert(result.error);
    }

    setDeletingTestimonialId(null);
    router.refresh();
  };

  const handleDeleteInstagramPost = async (id: string, postUrl: string) => {
    const postId = extractInstagramPostId(postUrl);
    const displayText = postId || postUrl.substring(0, 30);

    if (
      !confirm(
        `Are you sure you want to delete Instagram post "${displayText}"?`,
      )
    ) {
      return;
    }

    setDeletingInstagramId(id);
    const result = await deleteInstagramPost(id);

    if (!result.success) {
      alert(result.error);
    }

    setDeletingInstagramId(null);
    router.refresh();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const truncateUrl = (url: string, maxLength: number = 60) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>{index < rating ? "★" : "☆"}</span>
    ));
  };

  return (
    <S.Container>
      {/* Main Page Header */}
      <S.Header style={{ marginBottom: "2rem" }}>
        <S.HeaderContent>
          <S.Title>Community</S.Title>
          <S.Subtitle>
            Manage testimonials and Instagram posts
          </S.Subtitle>
        </S.HeaderContent>
      </S.Header>

      {/* Testimonials Section */}
      <div style={{ marginBottom: "3rem" }}>
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
                          handleDeleteTestimonial(
                            testimonial.id,
                            testimonial.customerName,
                          )
                        }
                        disabled={deletingTestimonialId === testimonial.id}
                      >
                        {deletingTestimonialId === testimonial.id
                          ? "..."
                          : "Delete"}
                      </S.DeleteButton>
                    </S.Actions>
                  </S.TableCell>
                </S.TableRow>
              ))}
            </S.TableBody>
          </S.Table>
        )}
      </div>

      {/* Instagram Posts Section */}
      <div>
        <S.Header>
          <S.HeaderContent>
            <S.Title>Instagram Posts</S.Title>
            <S.Subtitle>{instagramPosts.length} posts total</S.Subtitle>
          </S.HeaderContent>
          <Link href="/dashboard/instagram-posts/new">
            <S.AddButton>+ Add Instagram Post</S.AddButton>
          </Link>
        </S.Header>

        {instagramPosts.length === 0 ? (
          <S.EmptyState>
            <S.EmptyIcon>📷</S.EmptyIcon>
            <S.EmptyTitle>No Instagram posts yet</S.EmptyTitle>
            <S.EmptyText>
              Add your first Instagram post to get started.
            </S.EmptyText>
            <Link href="/dashboard/instagram-posts/new">
              <S.AddButton>+ Add Instagram Post</S.AddButton>
            </Link>
          </S.EmptyState>
        ) : (
          <S.Table>
            <S.TableHeader>
              <S.TableRow>
                <S.TableHead>Image</S.TableHead>
                <S.TableHead>Post ID</S.TableHead>
                <S.TableHead>Post URL</S.TableHead>
                <S.TableHead>Order</S.TableHead>
                <S.TableHead>Updated</S.TableHead>
                <S.TableHead>Actions</S.TableHead>
              </S.TableRow>
            </S.TableHeader>
            <S.TableBody>
              {instagramPosts.map((post) => {
                const postId = extractInstagramPostId(post.postUrl);
                return (
                  <S.TableRow key={post.id}>
                    <S.TableCell>
                      {post.imageUrl ? (
                        <S.ProductImagePlaceholder
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            padding: 0,
                            position: "relative",
                          }}
                        >
                          <Image
                            src={post.imageUrl}
                            alt="Instagram post"
                            fill
                            sizes="60px"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        </S.ProductImagePlaceholder>
                      ) : (
                        <S.ProductImagePlaceholder
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "8px",
                          }}
                        >
                          📷
                        </S.ProductImagePlaceholder>
                      )}
                    </S.TableCell>
                    <S.TableCell>
                      <S.ProductName>{postId || "N/A"}</S.ProductName>
                    </S.TableCell>
                    <S.TableCell>
                      <div style={{ maxWidth: "400px" }}>
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "inherit",
                            textDecoration: "underline",
                            wordBreak: "break-all",
                          }}
                        >
                          {truncateUrl(post.postUrl)}
                        </a>
                      </div>
                    </S.TableCell>
                    <S.TableCell>{post.order}</S.TableCell>
                    <S.TableCell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </S.TableCell>
                    <S.TableCell>
                      <S.Actions>
                        <S.DeleteButton
                          onClick={() =>
                            handleDeleteInstagramPost(post.id, post.postUrl)
                          }
                          disabled={deletingInstagramId === post.id}
                        >
                          {deletingInstagramId === post.id ? "..." : "Delete"}
                        </S.DeleteButton>
                      </S.Actions>
                    </S.TableCell>
                  </S.TableRow>
                );
              })}
            </S.TableBody>
          </S.Table>
        )}
      </div>
    </S.Container>
  );
}
