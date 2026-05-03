import Link from "next/link";
import { getLandingHeroSlideUrls } from "@/app/actions/settings";
import * as S from "./LandingPage.styles";
import RunningBanner from "../RunningBanner/RunningBanner";
import HeroSlideshow from "../HeroSlideshow/HeroSlideshow";

const FALLBACK_LANDING_PHOTO_URL =
  process.env.NEXT_PUBLIC_LANDING_PHOTO_URL ||
  "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGLDgNsR5ihjkVF8eaqWlO3pXP4g9ZHb0cCNLnI";

const LandingPage = async () => {
  // Fetch hero URLs server-side to make image discoverable from HTML
  let heroUrls: string[] = [FALLBACK_LANDING_PHOTO_URL];
  try {
    const result = await getLandingHeroSlideUrls();
    if (result.success && result.data && result.data.length > 0) {
      heroUrls = result.data;
    }
  } catch (error) {
    console.error("Error fetching landing hero slides:", error);
  }

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
                Mocktails that
                <br />
                <S.TitleAccent>Fuel your day</S.TitleAccent>
              </S.Title>

              <S.Subtitle>
                These aren&apos;t just mocktails.They&apos;re your mid-day
                reset, your pre & post-gym treat, your bring-to-the-party
                bottle. Healthy but full of tasty flavour.
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
            <HeroSlideshow heroUrls={heroUrls} firstImageUrl={heroUrls[0]} />
          </S.RightContent>
        </S.MainGrid>
      </S.Container>
    </S.LandingSection>
  );
};

export default LandingPage;
