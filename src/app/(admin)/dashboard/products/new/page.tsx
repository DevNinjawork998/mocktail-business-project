import ProductForm from "@/components/ProductForm";

export const metadata = {
  title: "New Product | Admin Dashboard",
};

export default function NewProductPage() {
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
        Create New Product
      </h1>
      <ProductForm />
    </div>
  );
}
