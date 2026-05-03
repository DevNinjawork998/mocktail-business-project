import type { Metadata } from "next";
import ShippingPageClient from "./ShippingPageClient";

export const metadata: Metadata = {
  title: "Shipping Policy | Mocktails On The Go",
  description:
    "Learn about Mocktails On The Go shipping rates, delivery times, and order fulfilment across Malaysia.",
  alternates: { canonical: "https://mocktailsonthego.com/shipping" },
};

export default function ShippingPage() {
  return <ShippingPageClient />;
}
