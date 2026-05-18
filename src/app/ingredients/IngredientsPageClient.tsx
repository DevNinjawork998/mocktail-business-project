"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type MouseEvent,
} from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import {
  PageContainer,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
  IngredientsSection,
  CarouselContainer,
  CarouselTrack,
  CarouselCardWrapper,
  FlipCardContainer,
  FlipCard,
  CardFront,
  CardBack,
  IngredientCard,
  IngredientImage,
  IngredientIcon,
  IngredientName,
  IngredientSubtitle,
  IngredientDescription,
  BackTitle,
  BackSubtitle,
} from "./page.styles";

export interface Ingredient {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string | null;
  subtitle: string;
  description: string;
  type: string;
  order: number;
}

interface IngredientsPageClientProps {
  ingredients: Ingredient[];
}

const breadcrumbItems = [{ label: "Ingredients" }];
const SCROLL_SPEED_PX_PER_S = 50;

export default function IngredientsPageClient({
  ingredients,
}: IngredientsPageClientProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const carouselRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const isTouchingRef = useRef(false);

  const otherIngredients = ingredients.filter((ing) => ing.name !== "Baobab");

  const stopAutoScroll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimestampRef.current = null;
  }, []);

  const startAutoScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    const step = (timestamp: number) => {
      if (isDraggingRef.current || isTouchingRef.current) {
        rafRef.current = null;
        lastTimestampRef.current = null;
        return;
      }
      const container = carouselRef.current;
      if (!container) {
        rafRef.current = null;
        return;
      }
      if (lastTimestampRef.current !== null) {
        const delta = timestamp - lastTimestampRef.current;
        container.scrollLeft += (SCROLL_SPEED_PX_PER_S * delta) / 1000;
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }
      lastTimestampRef.current = timestamp;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, [startAutoScroll, stopAutoScroll]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const container = carouselRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    stopAutoScroll();
    dragStartXRef.current = e.pageX - container.getBoundingClientRect().left;
    dragScrollLeftRef.current = container.scrollLeft;
    container.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.getBoundingClientRect().left;
    const walk = (x - dragStartXRef.current) * 1.5;
    carouselRef.current.scrollLeft = dragScrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (carouselRef.current) carouselRef.current.style.cursor = "";
    startAutoScroll();
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (carouselRef.current) carouselRef.current.style.cursor = "";
    }
    startAutoScroll();
  };

  const handleTouchStart = () => {
    isTouchingRef.current = true;
    stopAutoScroll();
  };

  const handleTouchEnd = () => {
    isTouchingRef.current = false;
    setTimeout(startAutoScroll, 600);
  };

  return (
    <PageContainer>
      <Navigation />
      <Breadcrumb items={breadcrumbItems} />

      <HeroSection>
        <HeroTitle>The Ingredients</HeroTitle>
        <HeroSubtitle>
          Every ingredient in our mocktails is carefully selected for its unique
          benefits and exceptional taste.
        </HeroSubtitle>
      </HeroSection>

      <IngredientsSection>
        <CarouselContainer
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={stopAutoScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <CarouselTrack>
            {[...otherIngredients, ...otherIngredients].map(
              (ingredient, index) => {
                const isFlipped = flippedCards.has(`${ingredient.id}-${index}`);

                return (
                  <CarouselCardWrapper key={`${ingredient.id}-${index}`}>
                    <FlipCardContainer>
                      <FlipCard
                        $isFlipped={isFlipped}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFlippedCards((prev) => {
                            const newSet = new Set(prev);
                            const cardId = `${ingredient.id}-${index}`;
                            if (newSet.has(cardId)) {
                              newSet.delete(cardId);
                            } else {
                              newSet.add(cardId);
                            }
                            return newSet;
                          });
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setFlippedCards((prev) => {
                              const newSet = new Set(prev);
                              const cardId = `${ingredient.id}-${index}`;
                              if (newSet.has(cardId)) {
                                newSet.delete(cardId);
                              } else {
                                newSet.add(cardId);
                              }
                              return newSet;
                            });
                          }
                        }}
                      >
                        <CardFront>
                          <IngredientCard>
                            {ingredient.imageUrl &&
                            !imageErrors.has(ingredient.id) ? (
                              <IngredientImage>
                                <Image
                                  src={ingredient.imageUrl}
                                  alt={ingredient.name}
                                  fill
                                  sizes="(max-width: 768px) 150px, 200px"
                                  style={{
                                    objectFit: "cover",
                                    pointerEvents: "none",
                                  }}
                                  priority={index === 0}
                                  onError={() => {
                                    setImageErrors((prev) =>
                                      new Set(prev).add(ingredient.id),
                                    );
                                  }}
                                />
                              </IngredientImage>
                            ) : (
                              <IngredientIcon>{ingredient.icon}</IngredientIcon>
                            )}
                            <IngredientName>{ingredient.name}</IngredientName>
                            <IngredientSubtitle>
                              {ingredient.subtitle}
                            </IngredientSubtitle>
                          </IngredientCard>
                        </CardFront>
                        <CardBack>
                          <BackTitle>{ingredient.name}</BackTitle>
                          <BackSubtitle>{ingredient.subtitle}</BackSubtitle>
                          <IngredientDescription>
                            {ingredient.description}
                          </IngredientDescription>
                        </CardBack>
                      </FlipCard>
                    </FlipCardContainer>
                  </CarouselCardWrapper>
                );
              },
            )}
          </CarouselTrack>
        </CarouselContainer>
      </IngredientsSection>

      <Footer />
    </PageContainer>
  );
}
