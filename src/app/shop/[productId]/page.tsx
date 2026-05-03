import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductPageWrapper from "./ProductPageWrapper";
import Navigation from "../../../components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import { getProductById, getOtherProducts } from "@/data/serverProductService";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProductById(productId).catch(() => null);

  if (!product) {
    return { title: "Product Not Found | Mocktails On The Go" };
  }

  const imageUrl =
    product.images?.[0]?.url ??
    product.imageUrl ??
    "https://mocktailsonthego.com/images/motg-logo.png";

  return {
    title: `${product.name} | Mocktails On The Go`,
    description: product.description,
    alternates: {
      canonical: `https://mocktailsonthego.com/shop/${productId}`,
    },
    openGraph: {
      title: `${product.name} | Mocktails On The Go`,
      description: product.description,
      url: `https://mocktailsonthego.com/shop/${productId}`,
      siteName: "Mocktails On The Go",
      images: [{ url: imageUrl, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Mocktails On The Go`,
      description: product.description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  try {
    const product = await getProductById(productId);

    if (!product) {
      notFound();
    }

    const otherProducts = await getOtherProducts(productId);

    const breadcrumbItems = [
      { label: "Shop", href: "/shop" },
      { label: product.name },
    ];

    const imageUrl =
      product.images?.[0]?.url ??
      product.imageUrl ??
      "https://mocktailsonthego.com/images/motg-logo.png";

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: imageUrl,
      brand: {
        "@type": "Brand",
        name: "Mocktails On The Go",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        price: product.price.replace(/[^0-9.]/g, ""),
        availability: "https://schema.org/InStock",
        url: `https://mocktailsonthego.com/shop/${productId}`,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <Navigation />
        <Breadcrumb items={breadcrumbItems} />
        <ProductPageWrapper product={product} otherProducts={otherProducts} />
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
