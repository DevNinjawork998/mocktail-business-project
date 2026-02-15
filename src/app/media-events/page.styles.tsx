import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.currentSemantic.background};
  padding-top: 4rem; /* Account for fixed navigation bar */
`;

export const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.royalOrange.base} 0%,
    ${({ theme }) => theme.colors.bittersweetShimmer.base} 100%
  );
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: white;
`;

export const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: "Poppins", sans-serif;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 4rem;
    }
  `}
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.95;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.5rem;
    }
  `}
`;

export const ContentSection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  font-family: "Poppins", sans-serif;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 2.5rem;
    }
  `}
`;

export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing["4xl"]};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      grid-template-columns: repeat(2, 1fr);
      gap: ${theme.spacing["2xl"]};
    }
  `}
`;

export const EventCard = styled.div`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border: 1px solid ${({ theme }) => theme.currentSemantic.borderLight};
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const EventImage = styled.div`
  width: 100%;
  height: 250px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.mauvelous.light} 0%,
    ${({ theme }) => theme.colors.caramel.light} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
`;

export const EventContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const EventDate = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.royalOrange.base};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const EventTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const EventDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const EventButton = styled.a`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.royalOrange.base};
  color: white;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bittersweetShimmer.base};
    transform: translateY(-2px);
  }
`;

export const ComingSoon = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};

  h3 {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.semantic.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  }
`;
