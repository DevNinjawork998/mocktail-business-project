"use client";

import React from "react";
import {
  WhyMocktailsSection,
  Container,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  BenefitsGrid,
  BenefitCard,
  BenefitIcon,
  BenefitTitle,
  BenefitDescription,
} from "./WhyMocktails.styles";

const benefits = [
  {
    icon: "🍓",
    title: "Fresh Ingredients",
    description:
      "Made with only the freshest fruits, pressed daily for maximum flavor and nutrition.",
  },
  {
    icon: "🌿",
    title: "Adaptogen Power",
    description:
      "Enhanced with natural adaptogens to help your body handle stress and boost energy.",
  },
  {
    icon: "🍯",
    title: "Low Sugar",
    description:
      "We strive to keep the sugar and calorie content as low as possible. This will soon be certified by professionals.",
  },
  {
    icon: "✨",
    title: "Functional Benefits",
    description:
      "Each flavor is crafted to support your wellness goals, from focus to relaxation.",
  },
];

const WhyMocktails: React.FC = () => {
  return (
    <WhyMocktailsSection>
      <Container>
        <SectionHeader>
          <SectionTitle>Why Mocktails On the Go?</SectionTitle>
          <SectionSubtitle>
            We&apos;re reimagining what a beverage can be. Delicious,
            functional, and good for you.
          </SectionSubtitle>
        </SectionHeader>

        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index}>
              <BenefitIcon>{benefit.icon}</BenefitIcon>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
            </BenefitCard>
          ))}
        </BenefitsGrid>
      </Container>
    </WhyMocktailsSection>
  );
};

export default WhyMocktails;
