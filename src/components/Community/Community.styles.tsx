import styled from "styled-components";

export const CommunitySection = styled.section`
  background-color: ${({ theme }) => theme.colors.mauvelous.base};
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  position: relative;
  overflow: hidden;

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

export const ContentWrapper = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: "Poppins", sans-serif;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 3.5rem;
    }
  `}
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.125rem;
    }
  `}
`;

export const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      grid-template-columns: repeat(3, 1fr);
      gap: ${theme.spacing.lg};
    }
    
    @media (min-width: ${theme.breakpoints.lg}) {
      grid-template-columns: repeat(4, 1fr);
      gap: ${theme.spacing.xl};
    }
  `}
`;

export const PhotoCard = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:hover > div {
    opacity: 1;
  }
`;

export const PhotoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(69, 21, 21, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

export const InstagramIcon = styled.svg`
  width: 3rem;
  height: 3rem;
  color: white;
`;

export const CTAButton = styled.button`
  background-color: ${({ theme }) => theme.colors.chocolateKisses.base};
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.chocolateKisses.dark};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.125rem;
      padding: ${theme.spacing.lg} ${theme.spacing["2xl"]};
    }
  `}
`;

export const HashtagText = styled.span`
  font-weight: 700;
`;

export const CallToAction = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-style: italic;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1rem;
    }
  `}
`;
