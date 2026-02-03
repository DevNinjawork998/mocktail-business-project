import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export const metadata = {
  title: "Edit Product | Admin Dashboard",
};

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const formattedProduct = {
    ...product,
    features: product.features as Array<{ text: string; color: string }>,
    ingredients: product.ingredients as string[] | null,
  };

  return (
    <div>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          fontFamily: "serif",
        }}
      >
        Edit Product: {product.name}
      </h1>
      <ProductForm product={formattedProduct} />
    </div>
  );
}
