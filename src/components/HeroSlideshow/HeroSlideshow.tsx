"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import * as S from "./HeroSlideshow.styles";

interface HeroSlideshowProps {
  heroUrls: string[];
  firstImageUrl: string;
}

const ROTATE_MS = 5000;

const HeroSlideshow = ({ heroUrls, firstImageUrl }: HeroSlideshowProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useLayoutEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (): void => {
      setReduceMotion(mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
    };
  }, []);

  const displayUrls =
    reduceMotion && heroUrls.length > 1 ? [heroUrls[0] as string] : heroUrls;
  const shouldRotate = !reduceMotion && displayUrls.length > 1;

  useEffect(() => {
    if (!shouldRotate) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % displayUrls.length);
    }, ROTATE_MS);
    return () => {
      window.clearInterval(timer);
    };
  }, [shouldRotate, displayUrls.length]);

  useEffect(() => {
    if (activeIndex >= displayUrls.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, displayUrls.length]);

  return (
    <S.ProductImageContainer>
      <S.ImageWrapper>
        {displayUrls.map((url, i) => (
          <S.Slide key={`${url}-${i}`} $active={i === activeIndex}>
            <Image
              src={url}
              alt="Mocktails On the Go - Fresh Mocktail"
              fill
              style={{ objectFit: "cover" }}
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </S.Slide>
        ))}
      </S.ImageWrapper>
      <S.Badge>🌿 Adaptogen Powered</S.Badge>
      <S.BadgeBottom>🍊 Wholesome Ingredients Only</S.BadgeBottom>
    </S.ProductImageContainer>
  );
};

export default HeroSlideshow;
