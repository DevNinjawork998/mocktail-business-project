"use client";

import Navigation from "@/components/Navigation/Navigation";
import LandingPage from "@/components/LandingPage/LandingPage";
import Footer from "@/components/Footer/Footer";
import * as S from "./page.styles";
import dynamic from "next/dynamic";

const ProductShowcase = dynamic(
  () => import("@/components/ProductShowcase/ProductShowcase"),
  { ssr: false },
);

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

interface HomePageClientProps {
  heroUrls: string[];
  cartIconEnabled: boolean;
  ctaBannerEnabled: boolean;
}

export default function HomePageClient({
  heroUrls,
  cartIconEnabled,
  ctaBannerEnabled,
}: HomePageClientProps) {
  return (
    <S.PageContainer>
      <Navigation cartIconEnabled={cartIconEnabled} />
      <LandingPage heroUrls={heroUrls} />
      <ProductShowcase />
      <HealthBenefits />
      <WhyMocktails />
      {ctaBannerEnabled && <CTABanner />}
      <FounderStory />
      <Footer />
    </S.PageContainer>
  );
}
