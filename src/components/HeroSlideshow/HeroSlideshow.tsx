"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { getLandingHeroSlideUrls } from "@/app/actions/settings";
import * as S from "./HeroSlideshow.styles";

const FALLBACK_LANDING_PHOTO_URL =
  process.env.NEXT_PUBLIC_LANDING_PHOTO_URL ||
  "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGLDgNsR5ihjkVF8eaqWlO3pXP4g9ZHb0cCNLnI";

const ROTATE_MS = 5000;

const HeroSlideshow = () => {
  const [urls, setUrls] = useState<string[]>([FALLBACK_LANDING_PHOTO_URL]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getLandingHeroSlideUrls();
        if (result.success && result.data && result.data.length > 0) {
          setUrls(result.data);
          setActiveIndex(0);
        } else {
          setUrls([FALLBACK_LANDING_PHOTO_URL]);
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("Error fetching landing hero slides:", error);
        setUrls([FALLBACK_LANDING_PHOTO_URL]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const displayUrls =
    reduceMotion && urls.length > 1 ? [urls[0] as string] : urls;
  const shouldRotate =
    !reduceMotion && displayUrls.length > 1 && !isLoading;

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
        {!isLoading &&
          displayUrls.map((url, i) => (
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
