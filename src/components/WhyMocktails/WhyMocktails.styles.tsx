import styled from "styled-components";

export const WhyMocktailsSection = styled.section`
  background-color: ${({ theme }) => theme.colors.caramel.base};
  padding: ${({ theme }) => theme.spacing["4xl"]} ${({ theme }) => theme.spacing.md};
  position: relative;

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

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: serif;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 3rem;
    }
  `}
`;

export const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.25rem;
    }
  `}
`;

export const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.sm}) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: ${theme.breakpoints.lg}) {
      grid-template-columns: repeat(4, 1fr);
    }
  `}
`;

export const BenefitCard = styled.div`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing["2xl"]} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const BenefitIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.mauvelous.base};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const BenefitTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const BenefitDescription = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1rem;
    }
  `}
`;
