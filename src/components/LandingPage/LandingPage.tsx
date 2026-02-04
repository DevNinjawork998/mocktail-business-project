"use client";

import Link from "next/link";
import * as S from "./LandingPage.styles";
import RunningBanner from "../RunningBanner/RunningBanner";
import dynamic from "next/dynamic";

const HeroSlideshow = dynamic(() => import("../HeroSlideshow/HeroSlideshow"), {
  ssr: false,
});

const LandingPage = () => {
  return (
    <S.LandingSection>
      <RunningBanner />
      {/* Gradient Background */}
      <S.GradientBackground />
      <S.OverlayBackground />

      <S.Container>
        <S.MainGrid>
          {/* Left Content */}
          <S.LeftContent>
            <S.Badge>Fresh. Functional. Delicious.</S.Badge>
            <S.ContentSection>
              <S.Title>
                Mocktails that fuel
                <br />
                <S.TitleAccent>your day</S.TitleAccent>
              </S.Title>

              <S.Subtitle>
                Mocktails Made for Movement. These aren&apos;t just mocktails.
                They&apos;re your mid-day reset, your pre & post-gym treat, your
                bring-to-the-party bottle. Healthy but full of tasty flavour.
              </S.Subtitle>
            </S.ContentSection>

            {/* CTA Buttons */}
            <S.CTAContainer>
              <Link href="/shop">
                <S.CTAButton>
                  <S.CTAContent>
                    <span>Shop Now</span>
                  </S.CTAContent>
                </S.CTAButton>
              </Link>
              <Link href="/ingredients">
                <S.CTAButtonSecondary>
                  <S.CTAContentSecondary>
                    <span>Explore Ingredients</span>
                  </S.CTAContentSecondary>
                </S.CTAButtonSecondary>
              </Link>
            </S.CTAContainer>
          </S.LeftContent>

          {/* Right Content - Product Image */}
          <S.RightContent>
            <HeroSlideshow />
          </S.RightContent>
        </S.MainGrid>
      </S.Container>
    </S.LandingSection>
  );
};

export default LandingPage;
