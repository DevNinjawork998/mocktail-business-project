"use client";
import React from "react";
import {
  BannerContainer,
  BannerContent,
  BannerText,
  ImageWrapper,
  BannerImage,
} from "./RunningBanner.styles";
import { bannerData } from "@/data/bannerData";

const RunningBanner: React.FC = () => {
  // Duplicate content to create a seamless loop
  const duplicatedBannerData = [...bannerData, ...bannerData];

  return (
    <BannerContainer>
      <BannerContent>
        {duplicatedBannerData.map((item, index) => (
          <React.Fragment key={`${item.type}-${index}`}>
            {item.type === "message" ? (
              <BannerText>{item.content}</BannerText>
            ) : (
              <ImageWrapper>
                <BannerImage src={item.src} alt={item.alt} />
              </ImageWrapper>
            )}
          </React.Fragment>
        ))}
      </BannerContent>
    </BannerContainer>
  );
};

export default RunningBanner;
