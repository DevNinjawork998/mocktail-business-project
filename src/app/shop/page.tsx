"use client";

import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Image from "next/image";
import {
  ShopContainer,
  ShopHeader,
  ShopTitle,
  ShopSubtitle,
  ProductsGrid,
  ProductCard,
  ProductImageContainer,
  ProductImage,
  ProductName,
  ProductDescription,
} from "./page.styles";
import Footer from "@/components/Footer/Footer";
import dynamic from "next/dynamic";
import { getAllProducts, Product } from "@/data/productService";

const HealthBenefits = dynamic(
  () => import("@/components/HealthBenefits/HealthBenefits"),
  {
    ssr: false,
  },
);

const WhyMocktails = dynamic(
  () => import("@/components/WhyMocktails/WhyMocktails"),
  {
    ssr: false,
  },
);

const CTABanner = dynamic(() => import("@/components/CTABanner/CTABanner"), {
  ssr: false,
});

const FounderStory = dynamic(
  () => import("@/components/FounderStory/FounderStory"),
  {
    ssr: false,
  },
);

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ctaBannerEnabled, setCtaBannerEnabled] = useState(true);

  const breadcrumbItems = [{ label: "Shop" }];

  useEffect(() => {
    // Check feature flag on client-side only to avoid hydration mismatch
    const envValue = process.env.NEXT_PUBLIC_ENABLE_CTABANNER;
    if (envValue !== undefined) {
      setCtaBannerEnabled(envValue === "true" || envValue === "1");
    } else {
      // Default to enabled if not specified
      setCtaBannerEnabled(true);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation />
        <Breadcrumb items={breadcrumbItems} />
        <ShopContainer>
          <ShopHeader>
            <ShopTitle>Explore Our Ingredients</ShopTitle>
            <ShopSubtitle>
              Discover our premium collection of artisanal cocktail mixes,
              crafted with the finest ingredients for the perfect drink
              experience.
            </ShopSubtitle>
          </ShopHeader>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading products...
          </div>
        </ShopContainer>
        <HealthBenefits />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <Breadcrumb items={breadcrumbItems} />
        <ShopContainer>
          <ShopHeader>
            <ShopTitle>Explore Our Ingredients</ShopTitle>
            <ShopSubtitle>
              Discover our premium collection of artisanal cocktail mixes,
              crafted with the finest ingredients for the perfect drink
              experience.
            </ShopSubtitle>
          </ShopHeader>
          <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            {error}
          </div>
        </ShopContainer>
        <HealthBenefits />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Breadcrumb items={breadcrumbItems} />
      <ShopContainer>
        <ShopHeader>
          <ShopTitle>Our Signature Collection</ShopTitle>
          <ShopSubtitle>
            Each flavor is thoughtfully crafted with premium ingredients and
            functional adaptogens.
          </ShopSubtitle>
        </ShopHeader>

        <ProductsGrid>
          {products.map((product) => (
            <ProductCard key={product.id} href={`/shop/${product.id}`}>
              <ProductImageContainer>
                {product.imageUrl ? (
                  <div>
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      sizes="(max-width: 768px) 150px, 200px"
                    />
                  </div>
                ) : (
                  <ProductImage $bgColor={product.imageColor}>
                    {product.name}
                  </ProductImage>
                )}
              </ProductImageContainer>
              <ProductName>{product.name}</ProductName>
              <ProductDescription>{product.description}</ProductDescription>
            </ProductCard>
          ))}
        </ProductsGrid>
      </ShopContainer>
      <HealthBenefits />
      <WhyMocktails />
      {ctaBannerEnabled && <CTABanner />}
      <FounderStory />
      <Footer />
    </>
  );
}
