import { notFound } from "next/navigation";
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

    return (
      <>
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
