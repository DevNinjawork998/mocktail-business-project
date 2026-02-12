"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as S from "./ProductShowcase.styles";
import { getAllProducts, Product } from "@/data/productService";

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

const ProductShowcase = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
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
          {products.map((product) => (
            <S.ProductCardLink key={product.id} href={`/shop/${product.id}`}>
              <S.ProductCard>
                <S.ProductImage>
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 200px, 300px"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                  ) : (
                    <S.ProductImagePlaceholder $bgColor={product.imageColor}>
                      {product.name}
                    </S.ProductImagePlaceholder>
                  )}
                </S.ProductImage>
                <S.ProductContent>
                  <S.ProductName>
                    {product.name}
                  </S.ProductName>
                  <S.ProductSubtitle>
                    <SubtitleWithLink
                      subtitle={product.subtitle}
                      sectionTitle={extractSectionTitle(product.longDescription)}
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
          ))}
        </S.ProductsGrid>
      </S.Container>
    </S.ShowcaseSection>
  );
};

export default ProductShowcase;
