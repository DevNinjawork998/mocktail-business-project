"use client";
import React from "react";
import {
  BannerContainer,
  BannerContent,
  BannerText,
} from "./RunningBanner.styles";
import { bannerData } from "@/data/bannerData";

const RunningBanner: React.FC = () => {
  // Filter out images, keep only messages for now
  const messagesOnly = bannerData.filter((item) => item.type === "message");
  // Duplicate content to create a seamless loop
  const duplicatedBannerData = [...messagesOnly, ...messagesOnly];

  return (
    <BannerContainer>
      <BannerContent>
        {duplicatedBannerData.map((item, index) => (
          <BannerText key={`${item.type}-${index}`}>{item.content}</BannerText>
        ))}
      </BannerContent>
    </BannerContainer>
  );
};

export default RunningBanner;
