import IngredientForm from "@/components/IngredientForm";

export const metadata = {
  title: "New Ingredient | Admin Dashboard",
};

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
