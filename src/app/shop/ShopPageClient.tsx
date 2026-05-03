"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Image from "next/image";
import {
  ShopContainer,
  ShopHeader,
  ShopTitle,
  ShopSubtitle,
  ProductsGrid,
  ProductCardLink,
  ProductCard,
  ProductImageContainer,
  ProductImage,
  ProductName,
  ProductDescription,
} from "./page.styles";
import dynamic from "next/dynamic";
import { Product } from "@/data/productService";

const HealthBenefits = dynamic(
  () => import("@/components/HealthBenefits/HealthBenefits"),
  { ssr: false },
);

const WhyMocktails = dynamic(
  () => import("@/components/WhyMocktails/WhyMocktails"),
  { ssr: false },
);

const CTABanner = dynamic(() => import("@/components/CTABanner/CTABanner"), {
  ssr: false,
});

const FounderStory = dynamic(
  () => import("@/components/FounderStory/FounderStory"),
  { ssr: false },
);

function extractSectionTitle(longDescription: string): string {
  if (!longDescription) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(longDescription, "text/html");
  const h3Element = doc.querySelector("h3");
  return h3Element?.textContent?.trim() || "";
}

interface ShopPageClientProps {
  products: Product[];
}

export default function ShopPageClient({ products }: ShopPageClientProps) {
  const [ctaBannerEnabled, setCtaBannerEnabled] = useState(true);

  const breadcrumbItems = [{ label: "Shop" }];

  useEffect(() => {
    const envValue = process.env.NEXT_PUBLIC_ENABLE_CTABANNER;
    if (envValue !== undefined) {
      setCtaBannerEnabled(envValue === "true" || envValue === "1");
    } else {
      setCtaBannerEnabled(true);
    }
  }, []);

  return (
    <>
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
            <ProductCardLink key={product.id} href={`/shop/${product.id}`}>
              <ProductCard>
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
                <ProductDescription>
                  {extractSectionTitle(product.longDescription) ||
                    product.description}
                </ProductDescription>
              </ProductCard>
            </ProductCardLink>
          ))}
        </ProductsGrid>
      </ShopContainer>
      <HealthBenefits />
      <WhyMocktails />
      {ctaBannerEnabled && <CTABanner />}
      <FounderStory />
    </>
  );
}
