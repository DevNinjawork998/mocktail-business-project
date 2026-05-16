"use client";

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
  const match = longDescription.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  if (!match) return "";
  return match[1].replace(/<[^>]+>/g, "").trim();
}

interface ShopPageClientProps {
  products: Product[];
  ctaBannerEnabled: boolean;
}

export default function ShopPageClient({
  products,
  ctaBannerEnabled,
}: ShopPageClientProps) {
  const breadcrumbItems = [{ label: "Shop" }];

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
