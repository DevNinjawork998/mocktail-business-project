import type { Metadata } from "next";
import Navigation from "../../components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import ShopPageClient from "./ShopPageClient";
import { getAllProducts, type Product } from "@/data/serverProductService";
import { cartFlag, ctaBannerFlag } from "@/flags";

export const metadata: Metadata = {
  title: "Shop | Mocktails On The Go",
  description:
    "Explore our signature collection of adaptogenic mocktails. Premium halal-certified drinks crafted with functional herbs and natural ingredients.",
  alternates: {
    canonical: "https://mocktailsonthego.com/shop",
  },
  openGraph: {
    title: "Shop | Mocktails On The Go",
    description:
      "Explore our signature collection of adaptogenic mocktails. Premium halal-certified drinks crafted with functional herbs and natural ingredients.",
    url: "https://mocktailsonthego.com/shop",
    siteName: "Mocktails On The Go",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop | Mocktails On The Go",
    description:
      "Explore our signature collection of adaptogenic mocktails. Premium halal-certified drinks crafted with functional herbs and natural ingredients.",
  },
};

export default async function ShopPage() {
  const [products, cartIconEnabled, ctaBannerEnabled] = await Promise.all([
    getAllProducts().catch((): Product[] => []),
    cartFlag(),
    ctaBannerFlag(),
  ]);

  return (
    <>
      <Navigation cartIconEnabled={cartIconEnabled} />
      <ShopPageClient products={products} ctaBannerEnabled={ctaBannerEnabled} />
      <Footer />
    </>
  );
}
