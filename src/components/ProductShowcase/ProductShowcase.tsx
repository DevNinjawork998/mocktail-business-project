"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as S from "./ProductShowcase.styles";
import { getAllProducts, Product } from "@/data/productService";

/**
 * Build image URLs array: main imageUrl first, then supporting photos from ProductImage (order 1, 2)
 */
function buildImageUrls(
  imageUrl?: string | null,
  images?: Array<{ url: string; order: number }>,
): string[] {
  const urls: string[] = [];
  const urlSet = new Set<string>();

  // Always start with main imageUrl
  if (imageUrl) {
    urls.push(imageUrl);
    urlSet.add(imageUrl);
  }

  // Then add supporting photos from ProductImage records (order 1, 2 only)
  if (images && images.length > 0) {
    const orderMap = new Map<number, string>();

    images.forEach((img) => {
      // Only process order 1 and 2 (strictly)
      if (img.order <= 0 || img.order > 2) {
        return;
      }
      // Skip if URL matches imageUrl
      if (imageUrl && img.url === imageUrl) {
        return;
      }
      // Skip if URL already exists
      if (urlSet.has(img.url)) {
        return;
      }
      // Only keep the first occurrence of each order
      if (!orderMap.has(img.order)) {
        orderMap.set(img.order, img.url);
      }
    });

    // Sort by order and add to URLs
    const sortedOrders = Array.from(orderMap.keys()).sort((a, b) => a - b);
    sortedOrders.forEach((order) => {
      const url = orderMap.get(order);
      if (url && !urlSet.has(url)) {
        urls.push(url);
        urlSet.add(url);
      }
    });
  }

  // Safety limit: Only return max 3 images (main + 2 supporting)
  return urls.slice(0, 3);
}

/**
 * Rotating Product Image Component
 */
function RotatingProductImage({
  imageUrls,
  productName,
  imageColor,
}: {
  imageUrls: string[];
  productName: string;
  imageColor: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;

  const hasMultipleImages = imageUrls.length > 1;

  const goToSlide = useCallback(
    (index: number) => {
      if (!hasMultipleImages) return;
      setCurrentIndex(index);
    },
    [hasMultipleImages],
  );

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (!hasMultipleImages || imageUrls.length === 0) return;

    const intervalId = setInterval(() => {
      const current = currentIndexRef.current;
      const nextIndex = current < imageUrls.length - 1 ? current + 1 : 0;
      goToSlide(nextIndex);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [hasMultipleImages, imageUrls.length, goToSlide]);

  if (imageUrls.length === 0) {
    return (
      <S.ProductImagePlaceholder $bgColor={imageColor}>
        {productName}
      </S.ProductImagePlaceholder>
    );
  }

  return (
    <>
      {imageUrls.map((url, index) => (
        <Image
          key={`${url}-${index}`}
          src={url}
          alt={`${productName} - Image ${index + 1}`}
          fill
          sizes="(max-width: 768px) 200px, 300px"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            position: "absolute",
          }}
        />
      ))}
    </>
  );
}

/**
 * Extract section title from longDescription HTML
 */
function extractSectionTitle(longDescription: string): string | null {
  if (!longDescription) return null;

  // Try to extract h3 tag content
  const h3Match = longDescription.match(/<h3[^>]*>(.*?)<\/h3>/i);
  if (h3Match) {
    // Remove HTML tags and decode entities
    return h3Match[1]
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  }

  return null;
}

/**
 * Render subtitle - use section title if available, otherwise use original subtitle
 * If section title exists, make it a clickable span (not Link) to avoid nested <a> tags
 * since the subtitle is inside ProductCardLink which is already an anchor
 */
function SubtitleWithLink({
  subtitle,
  sectionTitle,
  productId,
  onNavigate,
}: {
  subtitle: string;
  sectionTitle: string | null;
  productId: string;
  onNavigate: (url: string) => void;
}): React.ReactNode {
  if (sectionTitle) {
    return (
      <span
        role="link"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNavigate(`/shop/${productId}#section-title`);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onNavigate(`/shop/${productId}#section-title`);
          }
        }}
      >
        {sectionTitle}
      </span>
    );
  }
  return subtitle;
}

// Extended Product type to include images
type ProductWithImages = Product & {
  images?: Array<{ url: string; order: number }>;
};

const ProductShowcase = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData.slice(0, 4)); // Only show first 4 products
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <S.ShowcaseSection>
        <S.Container>
          <S.SectionHeader>
            <S.SectionTitle>Our Signature Collection</S.SectionTitle>
            <S.SectionSubtitle>
              Each flavor is thoughtfully crafted with premium ingredients and
              functional adaptogens.
            </S.SectionSubtitle>
          </S.SectionHeader>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading products...
          </div>
        </S.Container>
      </S.ShowcaseSection>
    );
  }
  return (
    <S.ShowcaseSection>
      <S.Container>
        <S.SectionHeader>
          <S.SectionTitle>Our Signature Collection</S.SectionTitle>
          <S.SectionSubtitle>
            Each flavor is thoughtfully crafted with premium ingredients and
            functional adaptogens.
          </S.SectionSubtitle>
        </S.SectionHeader>

        <S.ProductsGrid>
          {products.map((product) => {
            const imageUrls = buildImageUrls(product.imageUrl, product.images);

            return (
              <S.ProductCardLink key={product.id} href={`/shop/${product.id}`}>
                <S.ProductCard>
                  <S.ProductImage>
                    <RotatingProductImage
                      imageUrls={imageUrls}
                      productName={product.name}
                      imageColor={product.imageColor}
                    />
                  </S.ProductImage>
                <S.ProductContent>
                  <S.ProductName>{product.name}</S.ProductName>
                  <S.ProductSubtitle>
                    <SubtitleWithLink
                      subtitle={product.subtitle}
                      sectionTitle={extractSectionTitle(
                        product.longDescription,
                      )}
                      productId={product.id}
                      onNavigate={(url) => router.push(url)}
                    />
                  </S.ProductSubtitle>
                  <S.AddToCartButton
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Add to cart functionality can be added here
                    }}
                  >
                    Add to Cart
                  </S.AddToCartButton>
                </S.ProductContent>
              </S.ProductCard>
            </S.ProductCardLink>
            );
          })}
        </S.ProductsGrid>
      </S.Container>
    </S.ShowcaseSection>
  );
};

export default ProductShowcase;
