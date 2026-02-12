"use client";

import { useState, useRef, type MouseEvent, type TouchEvent } from "react";
import Image from "next/image";
import * as S from "./ProductImageSlider.styles";

interface ProductImageSliderProps {
  images: string[];
  productName: string;
  onImageClick?: (index: number) => void;
}

export default function ProductImageSlider({
  images,
  productName,
  onImageClick,
}: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) {
    return null;
  }

  // If only one image, don't show slider controls
  const hasMultipleImages = images.length > 1;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!hasMultipleImages || !sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !hasMultipleImages || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!hasMultipleImages || !sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !hasMultipleImages || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Update currentIndex based on scroll position
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const imageWidth = sliderRef.current.clientWidth;
      const newIndex = Math.round(scrollPosition / imageWidth);
      setCurrentIndex(Math.max(0, Math.min(newIndex, images.length - 1)));
    }
  };

  const goToSlide = (index: number) => {
    if (!hasMultipleImages || !sliderRef.current) return;
    setCurrentIndex(index);
    sliderRef.current.scrollTo({
      left: index * sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!sliderRef.current || !hasMultipleImages) return;
    const scrollPosition = sliderRef.current.scrollLeft;
    const imageWidth = sliderRef.current.clientWidth;
    const newIndex = Math.round(scrollPosition / imageWidth);
    setCurrentIndex(Math.max(0, Math.min(newIndex, images.length - 1)));
  };

  const handleImageClick = (index: number) => {
    if (onImageClick) {
      onImageClick(index);
    }
  };

  return (
    <S.Container>
      <S.SliderWrapper
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        $isDragging={isDragging}
        $hasMultipleImages={hasMultipleImages}
      >
        {images.map((url, index) => (
          <S.ImageSlide key={`${url}-${index}`}>
            <S.ImageContainer onClick={() => handleImageClick(index)}>
              <Image
                src={url}
                alt={`${productName} - Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 450px"
                style={{
                  objectFit: "contain",
                }}
                priority={index === 0}
                onError={() => {
                  console.error(
                    `Failed to load image ${index + 1} for ${productName}:`,
                    url,
                  );
                }}
              />
            </S.ImageContainer>
          </S.ImageSlide>
        ))}
      </S.SliderWrapper>

      {/* Always show indicators if there are images, even with just one */}
      {images.length > 0 && (
        <S.Indicators>
          {images.map((_, index) => (
            <S.Indicator
              key={index}
              $isActive={index === currentIndex}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </S.Indicators>
      )}

      {/* Show counter only if multiple images */}
      {hasMultipleImages && (
        <S.Counter>
          {currentIndex + 1} / {images.length}
        </S.Counter>
      )}
    </S.Container>
  );
}
