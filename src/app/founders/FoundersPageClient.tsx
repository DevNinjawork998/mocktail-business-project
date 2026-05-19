"use client";

import React from "react";
import Navigation from "@/components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import FounderStory from "@/components/FounderStory/FounderStory";
import Footer from "@/components/Footer/Footer";
import * as S from "./FoundersPageClient.styles";
import { FounderStoryData } from "@/types/founder";

interface FoundersPageClientProps {
  storyData: FounderStoryData;
  cartIconEnabled?: boolean;
}

export default function FoundersPageClient({
  storyData,
  cartIconEnabled = true,
}: FoundersPageClientProps) {
  const breadcrumbItems = [{ label: "Meet Our Founders" }];

  return (
    <S.PageContainer>
      <Navigation cartIconEnabled={cartIconEnabled} />
      <Breadcrumb items={breadcrumbItems} />
      <FounderStory storyData={storyData} />
      <Footer />
    </S.PageContainer>
  );
}
