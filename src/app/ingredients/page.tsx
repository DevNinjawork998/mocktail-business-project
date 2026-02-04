"use client";

import {
  useState,
  useEffect,
  useRef,
  type MouseEvent,
  type TouchEvent,
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

interface Ingredient {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string | null;
  subtitle: string;
  description: string;
  type: string;
  order: number;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch("/api/ingredients");
        if (!response.ok) {
          throw new Error("Failed to fetch ingredients");
        }
        const data = await response.json();
        setIngredients(data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  // Baobab is the featured ingredient
  const otherIngredients = ingredients.filter((ing) => ing.name !== "Baobab");

  const breadcrumbItems = [{ label: "Ingredients" }];

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
    const walk = (x - startX) * 2; // Scroll speed multiplier
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

  if (loading) {
    return (
      <PageContainer>
        <Navigation />
        <Breadcrumb items={breadcrumbItems} />
        <HeroSection>
          <HeroTitle>The Ingredients</HeroTitle>
          <HeroSubtitle>Loading ingredients...</HeroSubtitle>
        </HeroSection>
        <Footer />
      </PageContainer>
    );
  }

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
        {/* Featured Ingredient */}
        {/* Running Carousel of Ingredient Cards */}
        <CarouselContainer>
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
            {/* Duplicate ingredients for seamless loop */}
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
