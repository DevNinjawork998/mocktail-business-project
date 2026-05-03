import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Our Ingredients | Mocktails On The Go",
  description:
    "Discover the premium adaptogenic herbs and natural ingredients that make Mocktails On The Go unique. 100% halal, zero alcohol.",
  alternates: { canonical: "https://mocktailsonthego.com/ingredients" },
  openGraph: {
    title: "Our Ingredients | Mocktails On The Go",
    description:
      "Discover the premium adaptogenic herbs and natural ingredients that make Mocktails On The Go unique. 100% halal, zero alcohol.",
    url: "https://mocktailsonthego.com/ingredients",
  },
};
import IngredientsPageClient from "./IngredientsPageClient";

export default async function IngredientsPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { order: "asc" },
  });

  return <IngredientsPageClient ingredients={ingredients} />;
}
