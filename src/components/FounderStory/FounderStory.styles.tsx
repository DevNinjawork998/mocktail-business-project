import styled from "styled-components";

export const FounderStorySection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  background-color: #d4aab3;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      padding: ${theme.spacing["4xl"]} ${theme.spacing.xl};
    }
  `}
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing["3xl"]};
  align-items: center;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.lg}) {
      grid-template-columns: 1fr 1fr;
    }
  `}
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: ${({ theme }) => theme.radii["2xl"]};
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.mauvelous.base};
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.mauvelous.light} 0%,
    ${({ theme }) => theme.colors.caramel.light} 100%
  );
  color: ${({ theme }) => theme.colors.chocolateKisses.base};

  svg {
    opacity: 0.6;
  }
`;

export const FounderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  align-items: center;
`;

export const Label = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.royalOrange.base};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: serif;
  line-height: 1.2;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 3rem;
    }
  `}
`;

export const StoryText = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const QuoteBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
`;

export const Quote = styled.p`
  font-size: 1.125rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.6;
`;

export const QuoteAuthor = styled.p`
  font-size: 0.875rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  font-weight: 400;
`;

export const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.chocolateKisses.base};
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing.md};
  width: fit-content;
  align-self: center;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.chocolateKisses.dark};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;
