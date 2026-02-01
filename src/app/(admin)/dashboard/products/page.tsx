import { prisma } from "@/lib/prisma";
import ProductsListClient from "./ProductsListClient";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      subtitle: true,
      price: true,
      imageUrl: true,
      updatedAt: true,
    },
  });

  return <ProductsListClient products={products} />;
}
