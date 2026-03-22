"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
  Fragment,
} from "react";
import Image from "next/image";
import { styledTheme } from "@/theme/styled-theme";
import { FlipHintIcon } from "./FlipHintIcon";
import {
  Section,
  Headline,
  Intro,
  IngredientsGrid,
  IngredientCard,
  IngredientImage,
  IngredientContent,
  IngredientName,
  IngredientSubtitle,
  FlipCardContainer,
  FlipCard,
  CardFront,
  CardBack,
  BackContent,
  BackTitle,
  BackSubtitle,
  BackDescription,
  FlipAffordance,
  MobileCarouselWrapper,
  ViewAllIngredientsRow,
  ViewAllIngredientsLink,
  VisuallyHidden,
} from "./HealthBenefits.styles";

const CAROUSEL_INTERVAL_MS = 3000;

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

const desktopIngredientsQuery = `(min-width: ${styledTheme.breakpoints.md})`;

function getMatchesDesktopIngredientsLayout(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  if (typeof window.matchMedia !== "function") {
    return true;
  }
  return window.matchMedia(desktopIngredientsQuery).matches;
}

const HealthBenefits = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);
  const [isDesktopLayout, setIsDesktopLayout] = useState(
    getMatchesDesktopIngredientsLayout,
  );
  const hasSeededMobileCarousel = useRef(false);

  const sortedIngredients = useMemo(
    () => [...ingredients].sort((a, b) => a.order - b.order),
    [ingredients],
  );

  useLayoutEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(desktopIngredientsQuery);
    const onChange = (): void => {
      setIsDesktopLayout(mql.matches);
    };
    onChange();
    mql.addEventListener("change", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

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

  useEffect(() => {
    if (sortedIngredients.length === 0 || hasSeededMobileCarousel.current) {
      return;
    }
    hasSeededMobileCarousel.current = true;
    const baobabIndex = sortedIngredients.findIndex(
      (ing) => ing.name === "Baobab",
    );
    setMobileCarouselIndex(baobabIndex >= 0 ? baobabIndex : 0);
  }, [sortedIngredients]);

  const toggleFlip = useCallback((ingredientId: string): void => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(ingredientId)) {
        next.delete(ingredientId);
      } else {
        next.add(ingredientId);
      }
      return next;
    });
  }, []);

  const mobileFeaturedIngredient = sortedIngredients[mobileCarouselIndex];
  const isMobileCurrentFlipped = mobileFeaturedIngredient
    ? flippedCards.has(mobileFeaturedIngredient.id)
    : false;

  useEffect(() => {
    if (isDesktopLayout) {
      return;
    }
    if (sortedIngredients.length <= 1) {
      return;
    }
    if (isMobileCurrentFlipped) {
      return;
    }

    const timer = window.setInterval(() => {
      setMobileCarouselIndex(
        (i) => (i + 1) % sortedIngredients.length,
      );
    }, CAROUSEL_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    isDesktopLayout,
    sortedIngredients.length,
    mobileCarouselIndex,
    isMobileCurrentFlipped,
  ]);

  if (loading) {
    return (
      <Section>
        <Headline>Real Ingredients. Real Results.</Headline>
        <Intro>
          We source the finest ingredients from local suppliers, with Halal,
          Mesti, HACCP, and GMP certifications.
        </Intro>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Loading ingredients...
        </div>
      </Section>
    );
  }

  const fallbackImageUrl =
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=300&fit=crop&q=80";

  const renderIngredientImageAndCopy = (
    ingredient: Ingredient,
  ): React.ReactElement => (
    <IngredientCard>
      <IngredientImage>
        <Image
          src={
            imageErrors.has(ingredient.id)
              ? fallbackImageUrl
              : ingredient.imageUrl || fallbackImageUrl
          }
          alt={ingredient.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          style={{ objectFit: "cover", pointerEvents: "none" }}
          onError={() => {
            setImageErrors((prev) => new Set(prev).add(ingredient.id));
          }}
        />
      </IngredientImage>
      <IngredientContent>
        <IngredientName>{ingredient.name}</IngredientName>
        <IngredientSubtitle>{ingredient.subtitle}</IngredientSubtitle>
      </IngredientContent>
    </IngredientCard>
  );

  const renderFlipCard = (ingredient: Ingredient): React.ReactElement => {
    const isFlipped = flippedCards.has(ingredient.id);
    const flipLabel = isFlipped
      ? `${ingredient.name}: show front of card`
      : `${ingredient.name}: flip card to read full details`;

    return (
      <FlipCardContainer>
        <FlipCard
          $isFlipped={isFlipped}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFlip(ingredient.id);
          }}
          role="button"
          tabIndex={0}
          aria-pressed={isFlipped}
          aria-label={flipLabel}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleFlip(ingredient.id);
            }
          }}
        >
          <CardFront>
            <FlipAffordance>
              <FlipHintIcon />
            </FlipAffordance>
            {renderIngredientImageAndCopy(ingredient)}
          </CardFront>
          <CardBack>
            <BackContent>
              <BackTitle>{ingredient.name}</BackTitle>
              <BackSubtitle>{ingredient.subtitle}</BackSubtitle>
              <BackDescription>{ingredient.description}</BackDescription>
            </BackContent>
          </CardBack>
        </FlipCard>
      </FlipCardContainer>
    );
  };

  return (
    <Section>
      <Headline>Real Ingredients. Real Results.</Headline>
      <Intro>
        We source the finest ingredients from local suppliers, with Halal,
        Mesti, HACCP, and GMP certifications.
      </Intro>
      {!isDesktopLayout && mobileFeaturedIngredient ? (
        <MobileCarouselWrapper>
          {sortedIngredients.length > 1 ? (
            <VisuallyHidden aria-live="polite" aria-atomic="true">
              {`Ingredient ${mobileCarouselIndex + 1} of ${sortedIngredients.length}: ${mobileFeaturedIngredient.name}`}
            </VisuallyHidden>
          ) : null}
          {renderFlipCard(mobileFeaturedIngredient)}
          <ViewAllIngredientsRow>
            <ViewAllIngredientsLink href="/ingredients">
              View all ingredients
            </ViewAllIngredientsLink>
          </ViewAllIngredientsRow>
        </MobileCarouselWrapper>
      ) : (
        <>
          <IngredientsGrid>
            {sortedIngredients.map((ingredient) => (
              <Fragment key={ingredient.id}>
                {renderFlipCard(ingredient)}
              </Fragment>
            ))}
          </IngredientsGrid>
          <ViewAllIngredientsRow>
            <ViewAllIngredientsLink href="/ingredients">
              View all ingredients
            </ViewAllIngredientsLink>
          </ViewAllIngredientsRow>
        </>
      )}
    </Section>
  );
};

export default HealthBenefits;
