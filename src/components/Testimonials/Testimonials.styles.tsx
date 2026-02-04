import styled, { keyframes } from "styled-components";

export const TestimonialsSection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.chocolateKisses.base} 0%,
    ${({ theme }) => theme.colors.chocolateKisses.dark} 100%
  );
  padding: ${({ theme }) => theme.spacing["4xl"]} 0;
  position: relative;
  overflow: hidden;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.caramel.base};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 3rem;
    }
  `}
`;

export const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.mauvelous.base};
  max-width: 36rem;
  margin: 0 auto;
`;

const scrollAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

export const TestimonialsContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

export const CarouselTrack = styled.div<{ $isPaused?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  width: fit-content;
  animation: ${scrollAnimation} 30s linear infinite;
  animation-play-state: ${({ $isPaused }) =>
    $isPaused ? "paused" : "running"};
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

export const TestimonialCard = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.royalOrange.base} 0%,
    ${({ theme }) => theme.colors.bittersweetShimmer.base} 100%
  );
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  width: 320px;
  min-width: 320px;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      width: 380px;
      min-width: 380px;
    }
  `}

  &:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.caramel.base} 0%,
      ${({ theme }) => theme.colors.mauvelous.base} 100%
    );
  }
`;

export const TestimonialContent = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const TestimonialText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-style: italic;

  &::before {
    content: '"';
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.caramel.base};
    margin-right: 0.2em;
  }

  &::after {
    content: '"';
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.caramel.base};
    margin-left: 0.2em;
  }
`;

export const TestimonialFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const CustomerAvatar = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.125rem;
  flex-shrink: 0;
`;

export const CustomerInfo = styled.div`
  flex: 1;
`;

export const CustomerName = styled.div`
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
`;

export const RatingStars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const Star = styled.span`
  color: ${({ theme }) => theme.colors.caramel.base};
  font-size: 1.125rem;
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
