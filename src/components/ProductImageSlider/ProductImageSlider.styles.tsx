import styled from "styled-components";
import { media } from "@/theme/styled-theme";

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 260px;
  aspect-ratio: 2 / 3;

  ${media.md} {
    max-width: 400px;
  }

  ${media.lg} {
    max-width: 450px;
  }
`;

export const SliderWrapper = styled.div<{
  $isDragging: boolean;
  $hasMultipleImages: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: ${({ $hasMultipleImages }) =>
    $hasMultipleImages ? "x mandatory" : "none"};
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  cursor: ${({ $isDragging, $hasMultipleImages }) =>
    $hasMultipleImages ? ($isDragging ? "grabbing" : "grab") : "pointer"};

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Prevent text selection while dragging */
  user-select: ${({ $isDragging }) => ($isDragging ? "none" : "auto")};
  -webkit-user-select: ${({ $isDragging }) => ($isDragging ? "none" : "auto")};
`;

export const ImageSlide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const Indicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
`;

export const Indicator = styled.button<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.chocolateKisses.dark : "rgba(69, 21, 21, 0.3)"};
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background-color: ${({ theme }) => theme.colors.chocolateKisses.dark};
    transform: scale(1.2);
  }
`;

export const Counter = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.75rem;
  font-weight: 500;
  z-index: 10;
`;
