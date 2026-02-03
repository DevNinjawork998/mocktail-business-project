"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as S from "./ProductShowcase.styles";
import { getAllProducts, Product } from "@/data/productService";

const ProductShowcase = () => {
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
            <S.ProductCard key={product.id} href={`/shop/${product.id}`} as={Link}>
              <S.ProductImage>
                {product.imageUrl ? (
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 200px, 300px"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <S.ProductImagePlaceholder $bgColor={product.imageColor}>
                    {product.name}
                  </S.ProductImagePlaceholder>
                )}
              </S.ProductImage>
              <S.ProductContent>
                <S.ProductName>{product.name}</S.ProductName>
                <S.ProductDescription>{product.description}</S.ProductDescription>
                <S.AddToCartButton onClick={(e) => e.preventDefault()}>
                  Add to Cart
                </S.AddToCartButton>
              </S.ProductContent>
            </S.ProductCard>
          ))}
        </S.ProductsGrid>
      </S.Container>
    </S.ShowcaseSection>
  );
};

export default ProductShowcase;
