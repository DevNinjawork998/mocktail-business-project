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

  // Type assertion needed due to Prisma Proxy wrapper interfering with type inference
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = (await (prisma.product.findUnique as any)({
    where: { id },
    include: {
      images: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })) as {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    longDescription: string;
    price: string;
    priceSubtext: string;
    imageColor: string;
    imageUrl: string | null;
    features: unknown;
    ingredients: unknown;
    productBrief: string | null;
    nutritionFacts: unknown;
    images: Array<{ url: string; order: number }>;
    createdAt: Date;
    updatedAt: Date;
  } | null;

  if (!product) {
    notFound();
  }

  const formattedProduct = {
    ...product,
    features: product.features as Array<{ text: string; color: string }>,
    ingredients: product.ingredients as string[] | null,
    images: product.images.map((img) => ({
      url: img.url,
      order: img.order,
    })),
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
