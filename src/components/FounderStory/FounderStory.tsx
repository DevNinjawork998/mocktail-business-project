"use client";

import Image from "next/image";
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

const FounderStory = () => {
  return (
    <FounderStorySection>
      <Container>
        <ContentGrid>
          {/* Image on Left */}
          <ImageContainer>
            <Image
              src="/images/founder/founder.png"
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

            <StoryText>
              Growing up, stress was a constant companion in my life. For a long
              time, the only way I knew how to cope was by turning to alcohol. I
              wasn&apos;t addicted, but I loved experimenting with fun cocktails
              for family and friends, creating little moments of joy. Yet, over
              time, I realized that the satisfaction was fleeting. The
              hangovers, the calories, and the guilt that followed each drink
              began to weigh on me.
            </StoryText>

            <StoryText>
              One day, I asked myself a simple but powerful question: What if I
              could enjoy drinks without the guilt? That question sparked a
              journey. I tried everything, flavoured sodas, zero-calorie
              sparkling waters, kombuchas. They tasted good, but they
              didn&apos;t nourish me or make me feel better in the long run.
              Even the mocktails I found in stores felt like watered-down
              versions of real cocktails, missing the magic and craft behind
              them.
            </StoryText>

            <StoryText>
              That&apos;s when I knew I wanted to change the drinking scene in
              Malaysia. I envisioned something different, mocktails that
              weren&apos;t just alcohol-free, but functional, inclusive, and
              designed for everyone. Drinks that could be a true companion,
              refreshing, uplifting, and guilt-free. With that vision, Mocktails
              On The Go was born. We created bottled mocktails that are low in
              calories and sugar, but enriched with functional botanicals like
              ashwagandha, baobab, and maca.
            </StoryText>

            <StoryText>
              This brand is more than just drinks. It&apos;s about rewriting the
              story of social sipping, celebrating without compromise,
              connecting without guilt, and feeling good about what you put into
              your body. From our hearts to yours, I truly hope our mocktails
              bring you the same comfort, confidence, and happiness they&apos;ve
              brought us. And if they make even a small difference in your life,
              then this journey has been worth every sleepless night and step of
              the way.
            </StoryText>

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
              <Quote>
                &quot;Sip without guilt with our mocktails&quot;
              </Quote>
              <QuoteAuthor>- Krishanthini, founder</QuoteAuthor>
            </QuoteBox>
          </ContentContainer>
        </ContentGrid>
      </Container>
    </FounderStorySection>
  );
};

export default FounderStory;
