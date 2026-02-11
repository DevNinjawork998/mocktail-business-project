import styled from "styled-components";

export const CTASection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.royalOrange.base} 0%,
    ${({ theme }) => theme.colors.bittersweetShimmer.base} 100%
  );
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.sm};
  text-align: center;
  position: relative;
  overflow: hidden;

  ${({ theme }) => `
    @media (min-width: 480px) {
      padding: ${theme.spacing["2xl"]} ${theme.spacing.md};
    }
    @media (min-width: ${theme.breakpoints.md}) {
      padding: ${theme.spacing["4xl"]} ${theme.spacing.xl};
    }
  `}
`;

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
`;

export const Heading = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: serif;

  ${({ theme }) => `
    @media (min-width: 480px) {
      font-size: 2.25rem;
    }
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 3.5rem;
    }
  `}
`;

export const Subtext = styled.p`
  font-size: 0.9375rem;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0 ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => `
    @media (min-width: 480px) {
      font-size: 1.0625rem;
      margin-bottom: ${theme.spacing["2xl"]};
      max-width: 600px;
    }
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.25rem;
    }
  `}
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: center;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.sm}) {
      flex-direction: row;
      gap: ${theme.spacing.lg};
    }
  `}
`;

export const PrimaryButton = styled.a`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing["2xl"]};
  background-color: ${({ theme }) => theme.colors.chocolateKisses.base};
  color: white;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.colors.chocolateKisses.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.chocolateKisses.dark};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.sm}) {
      width: 100%;
      max-width: 300px;
    }
  `}
`;

export const SecondaryButton = styled.a`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing["2xl"]};
  background-color: transparent;
  color: white;
  border: 2px solid white;
  border-radius: ${({ theme }) => theme.radii.full};
  font-weight: 600;
  font-size: 1.125rem;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.currentSemantic.surfaceHover};
    color: ${({ theme }) => theme.colors.royalOrange.base};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.sm}) {
      width: 100%;
      max-width: 300px;
    }
  `}
`;

export const BackgroundDecoration = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: ${({ theme }) => theme.currentSemantic.surface};
    top: -200px;
    right: -200px;
  }

  &::after {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: ${({ theme }) => theme.currentSemantic.surface};
    bottom: -150px;
    left: -150px;
  }
`;
