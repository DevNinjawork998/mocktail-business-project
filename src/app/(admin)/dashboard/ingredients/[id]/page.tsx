import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import IngredientForm from "@/components/IngredientForm";

export const metadata = {
  title: "Edit Ingredient | Admin Dashboard",
};

interface EditIngredientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditIngredientPage({
  params,
}: EditIngredientPageProps) {
  const { id } = await params;

  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
  });

  if (!ingredient) {
    notFound();
  }

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
        Edit Ingredient: {ingredient.name}
      </h1>
      <IngredientForm ingredient={ingredient} />
    </div>
  );
}
