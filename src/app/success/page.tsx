import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Order Confirmed | Mocktails On The Go",
  robots: { index: false, follow: false },
};
import Navigation from "../../components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import SuccessPageClient from "./SuccessPageClient";
import { cartFlag } from "@/flags";

export default async function SuccessPage() {
  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: "Checkout", href: "/checkout" },
    { label: "Success" },
  ];

  const cartIconEnabled = (await cartFlag()) ?? true;

  return (
    <>
      <Navigation cartIconEnabled={cartIconEnabled} />
      <Breadcrumb items={breadcrumbItems} />
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessPageClient />
      </Suspense>
      <Footer />
    </>
  );
}
