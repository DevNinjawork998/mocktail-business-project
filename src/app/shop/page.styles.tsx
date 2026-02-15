import styled from "styled-components";
import Link from "next/link";
import { media } from "@/theme/styled-theme";

export const ShopContainer = styled.div`
  min-height: 100vh;
  background: #d4aab3;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-top: calc(4rem + ${({ theme }) => theme.spacing.lg});
  position: relative;
  overflow: hidden;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      padding: ${theme.spacing["2xl"]} ${theme.spacing.md};
      padding-top: calc(4rem + ${theme.spacing["2xl"]});
    }
  `}
  ${media.lg} {
    padding: ${({ theme }) => theme.spacing["4xl"]}
      ${({ theme }) => theme.spacing.xl};
    padding-top: calc(4rem + ${({ theme }) => theme.spacing["4xl"]});
  }
`;

export const ShopHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
  z-index: 1;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      margin-bottom: ${theme.spacing["3xl"]};
    }
  `}
`;

export const ShopTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.chocolateKisses.base} 0%,
    ${({ theme }) => theme.colors.bittersweetShimmer.base} 50%,
    ${({ theme }) => theme.colors.royalOrange.base} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.chocolateKisses.base} 0%,
    ${({ theme }) => theme.colors.bittersweetShimmer.base} 50%,
    ${({ theme }) => theme.colors.royalOrange.base} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: "Poppins", sans-serif;

  ${({ theme: _theme }) => `
    @media (min-width: 480px) {
      font-size: 2.25rem;
    }
  `}
  ${media.lg} {
    font-size: 3.5rem;
  }
`;

export const ShopSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  max-width: 100%;
  margin: 0 auto;
  font-weight: 500;
  opacity: 0.85;
  padding: 0 ${({ theme }) => theme.spacing.sm};

  ${({ theme: _theme }) => `
    @media (min-width: 480px) {
      font-size: 1.0625rem;
      max-width: 600px;
    }
  `}
  ${media.md} {
    font-size: 1.125rem;
  }
`;

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  ${({ theme }) => `
    @media (min-width: 480px) {
      gap: ${theme.spacing.lg};
    }
  `}
  ${media.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ProductCardLink = styled(Link)`
  display: contents; /* Make link transparent to grid layout */
  text-decoration: none;
  color: inherit;
`;

// ProductCard is now a div container, not a link
export const ProductCard = styled.div`
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.currentSemantic.surface} 0%,
    ${({ theme }) => theme.colors.mauvelous.light}10 50%,
    ${({ theme }) => theme.colors.caramel.light}08 100%
  );
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid ${({ theme }) => theme.colors.mauvelous.base}35;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px ${({ theme }) => theme.colors.mauvelous.base}12,
    0 2px 4px -1px ${({ theme }) => theme.colors.mauvelous.base}06;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.mauvelous.base} 0%,
      ${({ theme }) => theme.colors.caramel.base} 50%,
      ${({ theme }) => theme.colors.royalOrange.base} 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow:
      0 20px 25px -5px ${({ theme }) => theme.colors.mauvelous.base}25,
      0 10px 10px -5px ${({ theme }) => theme.colors.royalOrange.base}20;
    border-color: ${({ theme }) => theme.colors.royalOrange.base};
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.currentSemantic.surface} 0%,
      ${({ theme }) => theme.colors.mauvelous.light}18 50%,
      ${({ theme }) => theme.colors.caramel.light}12 100%
    );

    &::before {
      opacity: 1;
    }
  }
`;

export const ProductImageContainer = styled.div`
  background: transparent;
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  height: 280px;
  width: 100%;

  /* Standardize image wrapper - responsive dimensions */
  > div {
    position: relative;
    width: 140px;
    height: 200px;
    margin: 0 auto;
  }

  ${({ theme }) => `
    @media (min-width: 480px) {
      padding: ${theme.spacing.lg} ${theme.spacing.md};
      height: 320px;
      > div {
        width: 180px;
        height: 250px;
      }
    }
    @media (min-width: ${theme.breakpoints.md}) {
      padding: ${theme.spacing.xl} ${theme.spacing.lg};
      height: 350px;
      margin-bottom: ${theme.spacing.lg};
      > div {
        width: 200px;
        height: 280px;
      }
    }
  `}
`;

export const ProductImage = styled.div<{ $bgColor: string }>`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin: 0 auto;
`;

export const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-align: center;
  transition: color 0.3s ease;
  ${({ theme: _theme }) => `
    @media (min-width: 480px) {
      font-size: 1.25rem;
    }
  `}
`;

export const ProductDescription = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  text-align: center;
  line-height: 1.6;
  flex: 1;
  opacity: 0.8;
  font-weight: 500;

  ${({ theme: _theme }) => `
    @media (min-width: 480px) {
      font-size: 0.875rem;
    }
  `}
`;
