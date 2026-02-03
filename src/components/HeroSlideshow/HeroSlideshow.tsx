"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getLandingPhotoUrl } from "@/app/actions/settings";
import * as S from "./HeroSlideshow.styles";

// Fallback URL if no landing photo is set in database
const FALLBACK_LANDING_PHOTO_URL =
  process.env.NEXT_PUBLIC_LANDING_PHOTO_URL ||
  "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGLDgNsR5ihjkVF8eaqWlO3pXP4g9ZHb0cCNLnI";

const HeroSlideshow = () => {
  const [imageUrl, setImageUrl] = useState<string>(FALLBACK_LANDING_PHOTO_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLandingPhoto = async () => {
      try {
        const result = await getLandingPhotoUrl();
        if (result.success && result.data) {
          setImageUrl(result.data);
        }
      } catch (error) {
        console.error("Error fetching landing photo:", error);
        // Keep fallback URL on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingPhoto();
  }, []);

  return (
    <S.ProductImageContainer>
      <S.ImageWrapper>
        {!isLoading && (
          <Image
            src={imageUrl}
            alt="Mocktails On the Go - Fresh Mocktail"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        )}
      </S.ImageWrapper>
      <S.Badge>🌿 Adaptogen Powered</S.Badge>
      <S.BadgeBottom>🍊 Wholesome Ingredients Only</S.BadgeBottom>
    </S.ProductImageContainer>
  );
};

export default HeroSlideshow;
