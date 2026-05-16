import Navigation from "../../components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import { CartPageBackground } from "./CartPageClient.styles";
import CartPageClient from "./CartPageClient";
import { cartFlag } from "@/flags";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const breadcrumbItems = [{ label: "Shop", href: "/shop" }, { label: "Cart" }];
  const cartIconEnabled = await cartFlag();

  return (
    <CartPageBackground>
      <Navigation cartIconEnabled={cartIconEnabled} />
      <Breadcrumb items={breadcrumbItems} />
      <CartPageClient />
      <Footer />
    </CartPageBackground>
  );
}
