"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FounderStoryData, DEFAULT_FOUNDER_STORY } from "@/types/founder";
import { getFounderStory } from "@/app/actions/settings";
import {
  FounderStorySection,
  Container,
  ContentGrid,
  ImageContainer,
  ContentContainer,
  Label,
  Title,
  StoryText,
  QuoteBox,
  Quote,
  QuoteAuthor,
  CTAButton,
} from "./FounderStory.styles";

interface FounderStoryProps {
  storyData?: FounderStoryData;
}

const FounderStory = ({ storyData: initialStoryData }: FounderStoryProps) => {
  const [storyData, setStoryData] = useState<FounderStoryData>(
    initialStoryData || DEFAULT_FOUNDER_STORY,
  );

  useEffect(() => {
    if (!initialStoryData) {
      getFounderStory()
        .then((res) => {
          if (res.success && res.data) {
            setStoryData(res.data);
          }
        })
        .catch(console.error);
    }
  }, [initialStoryData]);

  return (
    <FounderStorySection>
      <Container>
        <ContentGrid>
          {/* Image on Left */}
          <ImageContainer>
            <Image
              src={storyData.imageUrl || "/images/founder/founder.png"}
              alt="Founder of Mocktails On the Go"
              width={600}
              height={750}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              priority
            />
          </ImageContainer>

          {/* Content on Right */}
          <ContentContainer>
            <div>
              <Label>MEET OUR FOUNDER</Label>
              <Title>The Story Behind the Sip</Title>
            </div>

            {storyData.paragraphs.map((paragraph, index) => (
              <StoryText key={index}>{paragraph}</StoryText>
            ))}

            <CTAButton
              href="https://www.instagram.com/mocktailsonthego_motg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
              target="_blank"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Follow Our Journey
            </CTAButton>

            <QuoteBox>
              <Quote>&quot;{storyData.quote}&quot;</Quote>
              <QuoteAuthor>{storyData.author}</QuoteAuthor>
            </QuoteBox>
          </ContentContainer>
        </ContentGrid>
      </Container>
    </FounderStorySection>
  );
};

export default FounderStory;
