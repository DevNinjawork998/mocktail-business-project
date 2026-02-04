"use client";

import React, { useState, useRef, MouseEvent, TouchEvent } from "react";
import {
  TestimonialsSection,
  Container,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  TestimonialsContainer,
  CarouselTrack,
  TestimonialCard,
  TestimonialContent,
  TestimonialText,
  TestimonialFooter,
  CustomerAvatar,
  CustomerInfo,
  CustomerName,
  RatingStars,
  Star,
  BackgroundDecoration,
  DecorativeCircle,
} from "./Testimonials.styles";

// Testimonials data
const testimonials = [
  {
    id: 1,
    text: "Halal mocktails & so healthy. Tried Tequila Sundown & Maca Martini sedap sangat!! 😍",
    customerName: "yasmeenn",
    customerInitial: "Y",
    avatarColor: "#FF6B6B",
    rating: 5,
  },
  {
    id: 2,
    text: "My favourite flavour of the 3 is Tequila Sundown 😊. As for Dark & Stormy, I like how it gives my throat a nice warm hug with the ginger kick",
    customerName: "KM",
    customerInitial: "K",
    avatarColor: "#4ECDC4",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index}>{index < rating ? "★" : "☆"}</Star>
    ));
  };

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <TestimonialsSection>
      <BackgroundDecoration>
        <DecorativeCircle
          $size="20rem"
          $position="top: -10rem; left: -10rem;"
        />
        <DecorativeCircle
          $size="15rem"
          $position="bottom: -8rem; right: -8rem;"
        />
      </BackgroundDecoration>

      <Container>
        <SectionHeader>
          <SectionTitle>Customer Testimonials 🥂</SectionTitle>
          <SectionSubtitle>
            Real words from happy customers who&apos;ve tasted the magic ✨
          </SectionSubtitle>
        </SectionHeader>

        <TestimonialsContainer>
          <CarouselTrack
            ref={carouselRef}
            $isPaused={isPaused}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              if (!isDragging) {
                setIsPaused(false);
              }
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`}>
                <TestimonialContent>
                  <RatingStars>{renderStars(testimonial.rating)}</RatingStars>
                  <TestimonialText>{testimonial.text}</TestimonialText>
                </TestimonialContent>

                <TestimonialFooter>
                  <CustomerAvatar $color={testimonial.avatarColor}>
                    {testimonial.customerInitial}
                  </CustomerAvatar>
                  <CustomerInfo>
                    <CustomerName>{testimonial.customerName}</CustomerName>
                  </CustomerInfo>
                </TestimonialFooter>
              </TestimonialCard>
            ))}
          </CarouselTrack>
        </TestimonialsContainer>
      </Container>
    </TestimonialsSection>
  );
};

export default Testimonials;
