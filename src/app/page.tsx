import type { Metadata } from "next";
import { getLandingHeroSlideUrls } from "@/app/actions/settings";
import HomePageClient from "./HomePageClient";
import { cartFlag, ctaBannerFlag } from "@/flags";

export const metadata: Metadata = {
  title: "Mocktails On The Go | Adaptogenic Mocktails",
  description:
    "Premium adaptogenic mocktails crafted with functional ingredients. Shop our signature collection and fuel your day the healthy way.",
  alternates: { canonical: "https://mocktailsonthego.com" },
  openGraph: {
    title: "Mocktails On The Go | Adaptogenic Mocktails",
    description:
      "Premium adaptogenic mocktails crafted with functional ingredients. Shop our signature collection and fuel your day the healthy way.",
    url: "https://mocktailsonthego.com",
  },
};

const FALLBACK_LANDING_PHOTO_URL =
  process.env.NEXT_PUBLIC_LANDING_PHOTO_URL ||
  "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGLDgNsR5ihjkVF8eaqWlO3pXP4g9ZHb0cCNLnI";

export default async function Home() {
  const [heroResult, cartIconEnabledRaw, ctaBannerEnabledRaw] =
    await Promise.all([
      getLandingHeroSlideUrls().catch(() => ({
        success: false as const,
        data: undefined,
      })),
      cartFlag(),
      ctaBannerFlag(),
    ]);
  const cartIconEnabled = cartIconEnabledRaw ?? true;
  const ctaBannerEnabled = ctaBannerEnabledRaw ?? true;

  const heroUrls =
    heroResult.success && heroResult.data && heroResult.data.length > 0
      ? heroResult.data
      : [FALLBACK_LANDING_PHOTO_URL];

  return (
    <HomePageClient
      heroUrls={heroUrls}
      cartIconEnabled={cartIconEnabled}
      ctaBannerEnabled={ctaBannerEnabled}
    />
  );
}
