import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import * as S from "./page.styles";

export const metadata: Metadata = {
  title: "Shipping Policy | Mocktails On The Go",
  description:
    "Learn about Mocktails On The Go shipping rates, delivery times, and order fulfilment across Malaysia.",
  alternates: { canonical: "https://mocktailsonthego.com/shipping" },
};

export default function ShippingPage() {
  return (
    <S.PageContainer>
      <Navigation />
      <S.ContentSection>
        <S.Title>Shipping Information</S.Title>
        <S.Paragraph>
          We currently ship throughout Malaysia. Delivery times and shipping
          costs will be calculated at checkout based on your location.
        </S.Paragraph>
        <S.Paragraph>
          For bulk orders or special delivery requests, please contact us
          through our social media channels.
        </S.Paragraph>
      </S.ContentSection>
      <Footer />
    </S.PageContainer>
  );
}
