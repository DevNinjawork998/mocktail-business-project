import styled from "styled-components";
import Link from "next/link";

export const ShowcaseSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.mauvelous.light}25 0%,
    ${({ theme }) => theme.colors.caramel.light}30 25%,
    ${({ theme }) => theme.colors.caramel.base}20 50%,
    ${({ theme }) => theme.colors.royalOrange.light}25 75%,
    ${({ theme }) => theme.colors.mauvelous.light}20 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(
        circle at 20% 50%,
        ${({ theme }) => theme.colors.mauvelous.base}15 0%,
        transparent 60%
      ),
      radial-gradient(
        circle at 80% 50%,
        ${({ theme }) => theme.colors.royalOrange.base}15 0%,
        transparent 60%
      ),
      radial-gradient(
        circle at 50% 20%,
        ${({ theme }) => theme.colors.caramel.base}10 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  ${({ theme }) => `
    @media (min-width: 480px) {
      padding: ${theme.spacing["2xl"]} ${theme.spacing.md};
    }
    @media (min-width: ${theme.breakpoints.md}) {
      padding: ${theme.spacing["3xl"]} ${theme.spacing.md};
    }
    @media (min-width: ${theme.breakpoints.lg}) {
      padding: ${theme.spacing["4xl"]} ${theme.spacing.md};
    }
  `}
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
`;

export const SectionTitle = styled.h2`
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
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: "Poppins", sans-serif;

  ${({ theme }) => `
    @media (min-width: 480px) {
      font-size: 2.25rem;
    }
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 3rem;
    }
  `}
`;

export const SectionSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  max-width: 100%;
  margin: 0 auto;
  font-weight: 500;
  padding: 0 ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => `
    @media (min-width: 480px) {
      font-size: 1.0625rem;
      max-width: 700px;
    }
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.25rem;
    }
  `}
`;

export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  justify-items: center;
  align-items: stretch;
  padding: 0 ${({ theme }) => theme.spacing.xs};

  ${({ theme }) => `
    @media (min-width: 480px) {
      gap: ${theme.spacing.lg};
      padding: 0;
    }
    @media (min-width: ${theme.breakpoints.sm}) {
      grid-template-columns: repeat(2, 1fr);
      gap: ${theme.spacing.xl};
    }
    @media (min-width: ${theme.breakpoints.lg}) {
      grid-template-columns: repeat(3, 1fr);
      max-width: 1000px;
      margin: 0 auto;
    }
  `}
`;

export const ProductCardLink = styled(Link)`
  display: contents; /* Make link transparent to grid layout */
  text-decoration: none;
  color: inherit;
`;

export const ProductCard = styled.div`
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.currentSemantic.surface} 0%,
    ${({ theme }) => theme.colors.mauvelous.light}12 50%,
    ${({ theme }) => theme.colors.caramel.light}08 100%
  );
  border: 2px solid ${({ theme }) => theme.colors.mauvelous.base}40;
  border-radius: ${({ theme }) => theme.radii.xl};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 6px -1px ${({ theme }) => theme.colors.mauvelous.base}15,
    0 2px 4px -1px ${({ theme }) => theme.colors.mauvelous.base}08;
  display: flex;
  flex-direction: column;
  width: 100%; /* Fill grid cell completely */
  height: 100%; /* Fill grid cell height */
  min-width: 0; /* Prevent grid overflow */
  max-width: 100%; /* Don't exceed grid cell */
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
    transform: translateY(-8px) scale(1.02);
    box-shadow:
      0 20px 25px -5px ${({ theme }) => theme.colors.mauvelous.base}30,
      0 10px 10px -5px ${({ theme }) => theme.colors.royalOrange.base}25;
    border-color: ${({ theme }) => theme.colors.royalOrange.base};
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.currentSemantic.surface} 0%,
      ${({ theme }) => theme.colors.mauvelous.light}20 50%,
      ${({ theme }) => theme.colors.caramel.light}15 100%
    );

    &::before {
      opacity: 1;
    }
  }

  &:nth-child(1) {
    border-color: ${({ theme }) => theme.colors.mauvelous.base}40;

    &:hover {
      border-color: ${({ theme }) => theme.colors.mauvelous.base};
      box-shadow:
        0 20px 25px -5px ${({ theme }) => theme.colors.mauvelous.base}25,
        0 10px 10px -5px ${({ theme }) => theme.colors.mauvelous.base}15;
    }
  }

  &:nth-child(2) {
    border-color: ${({ theme }) => theme.colors.bittersweetShimmer.base}40;

    &:hover {
      border-color: ${({ theme }) => theme.colors.bittersweetShimmer.base};
      box-shadow:
        0 20px 25px -5px
          ${({ theme }) => theme.colors.bittersweetShimmer.base}25,
        0 10px 10px -5px
          ${({ theme }) => theme.colors.bittersweetShimmer.base}15;
    }
  }

  &:nth-child(3) {
    border-color: ${({ theme }) => theme.colors.royalOrange.base}40;

    &:hover {
      border-color: ${({ theme }) => theme.colors.royalOrange.base};
      box-shadow:
        0 20px 25px -5px ${({ theme }) => theme.colors.royalOrange.base}25,
        0 10px 10px -5px ${({ theme }) => theme.colors.royalOrange.base}15;
    }
  }

  &:nth-child(4) {
    border-color: ${({ theme }) => theme.colors.caramel.base}40;

    &:hover {
      border-color: ${({ theme }) => theme.colors.caramel.base};
      box-shadow:
        0 20px 25px -5px ${({ theme }) => theme.colors.caramel.base}25,
        0 10px 10px -5px ${({ theme }) => theme.colors.caramel.base}15;
    }
  }
`;

export const ProductImage = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4; /* Fixed aspect ratio for uniform sizing */
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.mauvelous.light}08 0%,
    ${({ theme }) => theme.currentSemantic.backgroundSecondary} 50%,
    ${({ theme }) => theme.colors.royalOrange.light}08 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  transition: background 0.4s ease;
  flex-shrink: 0; /* Prevent image container from shrinking */
  box-sizing: border-box; /* Include padding in width calculation */

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      ${({ theme }) => theme.colors.mauvelous.base}05 100%
    );
    pointer-events: none;
    transition: opacity 0.4s ease;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    position: relative;
    z-index: 1;
    transition: transform 0.4s ease;
  }

  ${ProductCard}:hover & {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.mauvelous.light}15 0%,
      ${({ theme }) => theme.currentSemantic.backgroundSecondary} 50%,
      ${({ theme }) => theme.colors.royalOrange.light}15 100%
    );

    &::after {
      opacity: 0.5;
    }

    img {
      transform: scale(1.05);
    }
  }
`;

export const ProductImagePlaceholder = styled.div<{ $bgColor: string }>`
  width: 100%;
  height: 100%;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const ProductContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(
    180deg,
    transparent 0%,
    ${({ theme }) => theme.colors.caramel.light}05 100%
  );
  min-height: 0; /* Allow flex item to shrink if needed */
  justify-content: space-between; /* Distribute content evenly */
`;

export const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantic.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  padding: 0;
  text-align: center;
  flex-shrink: 0; /* Prevent name from shrinking */
  min-height: 1.5rem; /* Consistent height */
  transition: color 0.2s ease;

  /* Card hover effect will handle color change */
`;

export const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  line-height: 1.6;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  padding: 0;
  flex: 1;
  text-align: center;
`;

export const ProductSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  line-height: 1.6;
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  padding: 0;
  flex: 1;
  text-align: center;
  min-height: 2rem; /* Consistent minimum height */

  a,
  span[role="link"] {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s ease;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.chocolateKisses.dark};
      text-decoration: underline;
    }
  }
`;

export const ProductTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  justify-content: center;
`;

export const Tag = styled.span`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.mauvelous.light} 0%,
    ${({ theme }) => theme.colors.caramel.light} 100%
  );
  color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid ${({ theme }) => theme.colors.mauvelous.base}30;
  transition: all 0.3s ease;

  ${ProductCard}:hover & {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.mauvelous.base} 0%,
      ${({ theme }) => theme.colors.caramel.base} 100%
    );
    color: ${({ theme }) => theme.colors.chocolateKisses.base};
    transform: scale(1.05);
  }
`;

export const AddToCartButton = styled.button`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.chocolateKisses.base} 0%,
    ${({ theme }) => theme.colors.bittersweetShimmer.base} 100%
  );
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.chocolateKisses.base}20;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.bittersweetShimmer.base} 0%,
      ${({ theme }) => theme.colors.royalOrange.base} 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.royalOrange.base}30;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;
