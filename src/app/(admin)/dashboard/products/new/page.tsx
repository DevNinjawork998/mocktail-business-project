"use client";

import dynamic from "next/dynamic";

const ProductForm = dynamic(() => import("@/components/ProductForm"), {
  ssr: false,
});

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
