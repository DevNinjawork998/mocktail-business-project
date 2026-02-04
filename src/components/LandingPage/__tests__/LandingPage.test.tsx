import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import LandingPage from "../LandingPage";
import "@jest/globals";

// Suppress console.error for act() warnings from Next.js LoadableComponent
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn((...args: unknown[]) => {
    const message = typeof args[0] === "string" ? args[0] : "";
    if (
      message.includes("not wrapped in act") ||
      message.includes("LoadableComponent")
    ) {
      return;
    }
    originalError.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
});

// Mock dynamic imports
jest.mock("../../RunningBanner/RunningBanner", () => {
  return function MockRunningBanner() {
    return <div data-testid="running-banner">Running Banner</div>;
  };
});

jest.mock("../../HeroSlideshow/HeroSlideshow", () => {
  return function MockHeroSlideshow() {
    return <div data-testid="hero-slideshow">Hero Slideshow</div>;
  };
});

describe("LandingPage", () => {
  it("renders badge text", () => {
    render(<LandingPage />);
    expect(
      screen.getByText(/Fresh. Functional. Delicious./i),
    ).toBeInTheDocument();
  });

  it("renders main title", () => {
    render(<LandingPage />);
    expect(screen.getByText(/Mocktails that fuel/i)).toBeInTheDocument();
    expect(screen.getByText(/your day/i)).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(<LandingPage />);
    expect(
      screen.getByText(/Mocktails Made for Movement/i),
    ).toBeInTheDocument();
  });

  it("renders CTA buttons", () => {
    render(<LandingPage />);
    expect(screen.getByRole("link", { name: /Shop Now/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Explore Ingredients/i }),
    ).toBeInTheDocument();
  });

  it("CTA buttons link to correct pages", () => {
    render(<LandingPage />);
    const shopNowLink = screen.getByRole("link", { name: /Shop Now/i });
    const exploreFlavorsLink = screen.getByRole("link", {
      name: /Explore Ingredients/i,
    });

    expect(shopNowLink).toHaveAttribute("href", "/shop");
    expect(exploreFlavorsLink).toHaveAttribute("href", "/ingredients");
  });

  it("renders hero slideshow component", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("hero-slideshow")).toBeInTheDocument();
  });

  it("renders running banner component", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("running-banner")).toBeInTheDocument();
  });
});
