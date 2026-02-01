import { prisma } from "@/lib/prisma";
import IngredientsListClient from "./IngredientsListClient";

export default async function IngredientsPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      icon: true,
      type: true,
      imageUrl: true,
      updatedAt: true,
    },
  });

  return <IngredientsListClient ingredients={ingredients} />;
}
