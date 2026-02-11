import styled from "styled-components";

export const Section = styled.section`
  margin: 1rem auto 0 auto;
  max-width: 1400px;
  padding: 1.5rem 1rem;
  background: ${({ theme }) => theme.semantic.background};
  border-radius: 1rem;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;

  ${({ theme }) => `
    @media (min-width: 480px) {
      padding: 2rem 1.25rem;
      border-radius: 1.25rem;
      margin-bottom: 3rem;
    }
    @media (min-width: ${theme.breakpoints.md}) {
      margin: 2rem auto 0 auto;
      padding: 3rem 1.5rem;
      border-radius: 1.5rem;
      margin-bottom: 4rem;
    }
  `}
`;

export const Headline = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.semantic.primary};
  margin-bottom: 1rem;
  text-align: center;

  ${({ theme }) => `
    @media (min-width: 480px) {
      font-size: 2.25rem;
      margin-bottom: 1.25rem;
    }
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }
  `}
`;

export const Intro = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.semantic.text};
  margin-bottom: 1.5rem;
  text-align: center;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0 ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => `
    @media (min-width: 480px) {
      font-size: 1.05rem;
      max-width: 800px;
      margin-bottom: 2rem;
    }
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.1rem;
      margin-bottom: 3rem;
    }
  `}
`;

export const IngredientsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  max-width: 1400px;
  margin: 0 auto;

  ${({ theme }) => `
    @media (min-width: 480px) {
      gap: 1.5rem;
    }
    @media (min-width: ${theme.breakpoints.sm}) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
    @media (min-width: ${theme.breakpoints.md}) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: ${theme.breakpoints.lg}) {
      grid-template-columns: repeat(5, 1fr);
    }
  `}
`;

export const IngredientCard = styled.div`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const IngredientImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
`;

export const IngredientContent = styled.div`
  padding: 1.25rem;
  text-align: center;
`;

export const IngredientName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantic.primary};
  margin-bottom: 0.5rem;
`;

export const IngredientSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  line-height: 1.5;
  margin: 0;
`;

export const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 16px;
  overflow: hidden;
`;

export const CardFront = styled(CardFace)`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.12),
    0 4px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
`;

export const FlipCardContainer = styled.div`
  perspective: 1000px;
  height: 100%;
  min-height: 300px;

  &:hover ${CardFront} {
    box-shadow:
      0 12px 24px rgba(0, 0, 0, 0.15),
      0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const FlipCard = styled.div<{ $isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  transition:
    transform 0.6s,
    box-shadow 0.3s ease;
  transform-style: preserve-3d;
  transform: ${({ $isFlipped }) =>
    $isFlipped ? "rotateY(180deg)" : "rotateY(0)"};
  cursor: pointer;

  &:hover {
    transform: ${({ $isFlipped }) =>
      $isFlipped ? "rotateY(180deg) scale(1.02)" : "rotateY(0) scale(1.02)"};
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
  padding: 1.5rem;
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
`;

export const BackContent = styled.div`
  text-align: center;
  width: 100%;
`;

export const BackTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
  font-family: serif;
`;

export const BackSubtitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const BackDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: white;
  text-align: center;
  margin: 0;
`;
