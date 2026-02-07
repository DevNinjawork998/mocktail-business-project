"use client";

import React from "react";
import Image from "next/image";
import {
  CommunitySection,
  Container,
  ContentWrapper,
  Title,
  Subtitle,
  PhotoGrid,
  PhotoCard,
  PhotoWrapper,
  PhotoOverlay,
  CTAButton,
  HashtagText,
  CallToAction,
  InstagramIcon,
} from "./Community.styles";

// Instagram Icon Component
const InstagramIconSVG = () => (
  <InstagramIcon
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </InstagramIcon>
);

interface InstagramPost {
  id: string;
  postUrl: string;
  imageUrl: string | null;
}

interface CommunityProps {
  instagramPosts?: InstagramPost[];
}

const Community: React.FC<CommunityProps> = ({ instagramPosts = [] }) => {
  const handleInstagramClick = () => {
    window.open(
      "https://www.instagram.com/mocktailsonthego_motg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      "_blank",
    );
  };

  // If no posts, show empty state or placeholder
  if (!instagramPosts || instagramPosts.length === 0) {
    return (
      <CommunitySection>
        <Container>
          <ContentWrapper>
            <Title>Our Community</Title>
            <Subtitle>
              Join our vibrant community of mocktail lovers. Tag us in a picture
              to be featured!
            </Subtitle>
          </ContentWrapper>

          <ContentWrapper>
            <CTAButton onClick={handleInstagramClick}>
              <InstagramIconSVG />
              <HashtagText>@MocktailsOnTheGo</HashtagText>
            </CTAButton>
            <CallToAction>
              Share your mocktail moments with{" "}
              <HashtagText>#MocktailsOnTheGo</HashtagText>
            </CallToAction>
          </ContentWrapper>
        </Container>
      </CommunitySection>
    );
  }

  return (
    <CommunitySection>
      <Container>
        <ContentWrapper>
          <Title>Our Community</Title>
          <Subtitle>
            Join our vibrant community of mocktail lovers. Tag us in a picture
            to be featured!
          </Subtitle>
        </ContentWrapper>

        <PhotoGrid>
          {instagramPosts.map((post) => (
            <PhotoCard
              key={post.id}
              onClick={() => window.open(post.postUrl, "_blank")}
            >
              {post.imageUrl ? (
                <>
                  <PhotoWrapper>
                    <Image
                      src={post.imageUrl}
                      alt="Instagram post"
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                  </PhotoWrapper>
                  <PhotoOverlay>
                    <InstagramIconSVG />
                  </PhotoOverlay>
                </>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#F4F4F4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(69, 21, 21, 0.5)",
                  }}
                >
                  <InstagramIconSVG />
                </div>
              )}
            </PhotoCard>
          ))}
        </PhotoGrid>

        <ContentWrapper>
          <CTAButton onClick={handleInstagramClick}>
            <InstagramIconSVG />
            <HashtagText>@MocktailsOnTheGo</HashtagText>
          </CTAButton>
          <CallToAction>
            Share your mocktail moments with{" "}
            <HashtagText>#MocktailsOnTheGo</HashtagText>
          </CallToAction>
        </ContentWrapper>
      </Container>
    </CommunitySection>
  );
};

export default Community;
