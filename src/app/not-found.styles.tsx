"use client";

import styled from "styled-components";
import Link from "next/link";

export const NotFoundContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.chocolateKisses.base} 0%,
    ${({ theme }) => theme.colors.chocolateKisses.dark} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
  overflow: hidden;
`;

export const NotFoundContent = styled.div`
  text-align: center;
  max-width: 600px;
  z-index: 2;
  position: relative;
`;

export const NotFoundTitle = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.caramel.base};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 8rem;
    }
  `}
`;

export const NotFoundSubtitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.mauvelous.base};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 2.5rem;
    }
  `}
`;

export const NotFoundDescription = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.mauvelous.base};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  line-height: 1.6;
  opacity: 0.9;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
`;

export const BackButton = styled(Link)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.royalOrange.base},
    ${({ theme }) => theme.colors.bittersweetShimmer.base}
  );
  color: white;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.full};
  text-decoration: none;
  font-weight: bold;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

export const SecondaryButton = styled(Link)`
  background: transparent;
  color: ${({ theme }) => theme.colors.caramel.base};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border: 2px solid ${({ theme }) => theme.colors.caramel.base};
  border-radius: ${({ theme }) => theme.radii.full};
  text-decoration: none;
  font-weight: bold;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    background: ${({ theme }) => theme.colors.caramel.base};
    color: ${({ theme }) => theme.colors.chocolateKisses.base};
    transform: translateY(-2px);
  }
`;

export const BackgroundDecoration = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1;
  pointer-events: none;
`;

export const DecorativeCircle = styled.div<{
  $size: string;
  $position: string;
}>`
  position: absolute;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.caramel.base} 0%,
    ${({ theme }) => theme.colors.mauvelous.base} 100%
  );
  ${({ $position }) => $position}
  filter: blur(2rem);
`;

export const Emoji = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;
