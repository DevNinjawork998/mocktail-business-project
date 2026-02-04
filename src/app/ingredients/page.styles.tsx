import styled, { keyframes } from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.currentSemantic.background};
`;

export const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.caramel.light} 0%,
    ${({ theme }) => theme.colors.mauvelous.light} 100%
  );
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

export const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: serif;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 4rem;
    }
  `}
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  max-width: 700px;
  margin: 0 auto;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.5rem;
    }
  `}
`;

export const IngredientsSection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  max-width: 1400px;
  margin: 0 auto;
`;

export const FeaturedIngredient = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.mauvelous.base} 0%,
    ${({ theme }) => theme.colors.royalOrange.base} 100%
  );
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing["3xl"]};
  margin-bottom: ${({ theme }) => theme.spacing["4xl"]};
  text-align: center;
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

export const FeaturedTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: serif;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 3rem;
    }
  `}
`;

export const FeaturedCaption = styled.p`
  font-size: 1.5rem;
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.75rem;
    }
  `}
`;

export const FeaturedBenefit = styled.p`
  font-size: 1.125rem;
  opacity: 0.95;
`;

const scrollAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

export const CarouselContainer = styled.div`
  overflow: hidden;
  width: 100%;
  position: relative;
  padding: ${({ theme }) => theme.spacing.md} 0;
  margin-top: ${({ theme }) => theme.spacing["2xl"]};
`;

export const CarouselTrack = styled.div<{ $isPaused?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  width: fit-content;
  animation: ${scrollAnimation} 40s linear infinite;
  animation-play-state: ${({ $isPaused }) =>
    $isPaused ? "paused" : "running"};
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

export const CarouselCardWrapper = styled.div`
  flex-shrink: 0;
  width: 280px;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.sm}) {
      width: 300px;
    }
  `}
`;

export const FlipCardContainer = styled.div`
  perspective: 1000px;
  height: 350px;
  width: 100%;
`;

export const FlipCard = styled.div<{ $isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform: ${({ $isFlipped }) =>
    $isFlipped ? "rotateY(180deg)" : "rotateY(0)"};
  cursor: pointer;
`;

export const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
`;

export const CardFront = styled(CardFace)`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border: 1px solid ${({ theme }) => theme.currentSemantic.borderLight};
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.12),
    0 4px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow:
      0 12px 24px rgba(0, 0, 0, 0.15),
      0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const CardBack = styled(CardFace)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.mauvelous.base} 0%,
    ${({ theme }) => theme.colors.royalOrange.base} 100%
  );
  transform: rotateY(180deg);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
`;

export const IngredientCard = styled.div`
  height: 100%;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

export const IngredientImage = styled.div`
  width: 100%;
  height: 180px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const IngredientIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.mauvelous.base} 0%,
    ${({ theme }) => theme.colors.royalOrange.base} 100%
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const IngredientName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const IngredientSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.royalOrange.base};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const IngredientDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: white;
  text-align: center;
`;

export const BackTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: serif;
`;

export const BackSubtitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-transform: uppercase;
  letter-spacing: 1px;
`;
