import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const [productCount, ingredientCount] = await Promise.all([
    prisma.product.count(),
    prisma.ingredient.count(),
  ]);

  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  });

  return (
    <DashboardClient
      productCount={productCount}
      ingredientCount={ingredientCount}
      recentProducts={recentProducts}
    />
  );
}
