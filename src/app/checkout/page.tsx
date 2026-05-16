import type { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";
import ClientOnly from "@/components/ui/ClientOnly/ClientOnly";

export const metadata: Metadata = {
  title: "Checkout | Mocktails On The Go",
  robots: { index: false, follow: false },
};
import Navigation from "../../components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import { stripeFlag, cartFlag } from "@/flags";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout" },
  ];

  const [stripeEnabled, cartIconEnabled] = await Promise.all([
    stripeFlag(),
    cartFlag(),
  ]);

  return (
    <>
      <Navigation cartIconEnabled={cartIconEnabled} />
      <Breadcrumb items={breadcrumbItems} />
      <CheckoutPageClient stripeEnabled={stripeEnabled} />
      <Footer />
    </>
  );
}
