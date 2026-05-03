"use client";

import dynamic from "next/dynamic";

const IngredientForm = dynamic(() => import("@/components/IngredientForm/IngredientForm"), {
  ssr: false,
});

export default function NewIngredientPage() {
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
        Create New Ingredient
      </h1>
      <IngredientForm />
    </div>
  );
}

