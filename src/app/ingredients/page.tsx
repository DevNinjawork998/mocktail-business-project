import type { Metadata } from "next";
import IngredientsPageClient, {
  type Ingredient,
} from "./IngredientsPageClient";
import { cartFlag } from "@/flags";

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

export const dynamic = "force-dynamic";

export default async function IngredientsPage() {
  const cartIconEnabledRaw = await cartFlag();
  const cartIconEnabled = cartIconEnabledRaw ?? true;

  const hasDatabaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DIRECT_URL ||
    process.env.PRISMA_DATABASE_URL;

  let ingredients: Ingredient[] = [];

  if (hasDatabaseUrl) {
    try {
      const { prisma } = await import("@/lib/prisma");
      ingredients = await prisma.ingredient
        .findMany({ orderBy: { order: "asc" } })
        .catch(() => []);
    } catch (_error) {
      // Silently handle errors — empty array will be used
    }
  }

  return <IngredientsPageClient ingredients={ingredients} cartIconEnabled={cartIconEnabled} />;
}
