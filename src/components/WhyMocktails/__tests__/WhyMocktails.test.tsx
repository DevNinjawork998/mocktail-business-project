import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import WhyMocktails from "../WhyMocktails";

describe("WhyMocktails", () => {
  it("renders the section title", () => {
    render(<WhyMocktails />);

    expect(screen.getByText("Why Mocktails On the Go?")).toBeInTheDocument();
  });

  it("renders the section subtitle", () => {
    render(<WhyMocktails />);

    expect(
      screen.getByText(
        "We're reimagining what a beverage can be. Delicious, functional, and good for you.",
      ),
    ).toBeInTheDocument();
  });

  it("renders all benefit cards", () => {
    render(<WhyMocktails />);

    expect(screen.getByText("Fresh Ingredients")).toBeInTheDocument();
    expect(screen.getByText("Adaptogen Power")).toBeInTheDocument();
    expect(screen.getByText("Low Sugar")).toBeInTheDocument();
    expect(screen.getByText("Functional Benefits")).toBeInTheDocument();
  });

  it("renders benefit icons", () => {
    render(<WhyMocktails />);

    expect(screen.getByText("🍓")).toBeInTheDocument();
    expect(screen.getByText("🌿")).toBeInTheDocument();
    expect(screen.getByText("🍯")).toBeInTheDocument();
    expect(screen.getByText("✨")).toBeInTheDocument();
  });

  it("renders benefit descriptions", () => {
    render(<WhyMocktails />);

    expect(
      screen.getByText(
        "Made with only the freshest fruits, pressed daily for maximum flavor and nutrition.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enhanced with natural adaptogens to help your body handle stress and boost energy.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "We strive to keep the sugar and calorie content as low as possible. This will soon be certified by professionals.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Each flavor is crafted to support your wellness goals, from focus to relaxation.",
      ),
    ).toBeInTheDocument();
  });

  it("renders all benefits with correct structure", () => {
    render(<WhyMocktails />);

    // Check that each benefit has its icon, title, and description
    const freshIngredients = screen.getByText("Fresh Ingredients");
    expect(freshIngredients).toBeInTheDocument();

    const adaptogenPower = screen.getByText("Adaptogen Power");
    expect(adaptogenPower).toBeInTheDocument();

    const lowSugar = screen.getByText("Low Sugar");
    expect(lowSugar).toBeInTheDocument();

    const functionalBenefits = screen.getByText("Functional Benefits");
    expect(functionalBenefits).toBeInTheDocument();
  });
});
