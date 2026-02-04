"use client";

import React from "react";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import * as S from "./page.styles";

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
