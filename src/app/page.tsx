"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation/Navigation";
import LandingPage from "@/components/LandingPage/LandingPage";
import Footer from "@/components/Footer/Footer";
import * as S from "./page.styles";
import dynamic from "next/dynamic";

// Dynamically import sections for better performance
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

export default function Home() {
  const [ctaBannerEnabled, setCtaBannerEnabled] = useState(true);

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

  return (
    <S.PageContainer>
      <Navigation />
      <LandingPage />
      <ProductShowcase />
      <HealthBenefits />
      <WhyMocktails />
      {ctaBannerEnabled && <CTABanner />}
      <FounderStory />
      <Footer />
    </S.PageContainer>
  );
}
