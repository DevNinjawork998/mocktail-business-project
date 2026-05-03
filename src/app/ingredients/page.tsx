import { prisma } from "@/lib/prisma";
import IngredientsPageClient from "./IngredientsPageClient";

export default async function IngredientsPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { order: "asc" },
  });

  return <IngredientsPageClient ingredients={ingredients} />;
}
