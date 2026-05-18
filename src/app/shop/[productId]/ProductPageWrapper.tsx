"use client";

import ProductPageClient from "./ProductPageClient";
import { Product } from "@/data/serverProductService";

interface ProductPageWrapperProps {
  product: Product;
  otherProducts: Product[];
}

export default function ProductPageWrapper({
  product,
  otherProducts,
}: ProductPageWrapperProps) {
  return <ProductPageClient product={product} otherProducts={otherProducts} />;
}
