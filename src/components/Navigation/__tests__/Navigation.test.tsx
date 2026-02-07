import React from "react";
import { render, screen, fireEvent } from "../../../__tests__/test-utils";
import Navigation from "../Navigation";
import { CartProvider } from "../../../contexts/CartContext";
import "@testing-library/jest-dom";
import "@jest/globals";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    priority: _priority,
    style,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    style?: React.CSSProperties;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} style={style} />;
  },
}));

describe("Navigation", () => {
  beforeEach(() => {
    // Clear any previous renders
    jest.clearAllMocks();
  });

  const renderNavigation = () => {
    return render(
      <CartProvider>
        <Navigation />
      </CartProvider>,
    );
  };

  it("renders navigation component with logo", () => {
    renderNavigation();

    // Check if logo image is rendered
    const logoImage = screen.getByAltText("Mocktails On the Go");
    expect(logoImage).toBeInTheDocument();
    
    // Check if logo text is rendered
    expect(screen.getByText("Mocktails")).toBeInTheDocument();
    expect(screen.getByText("On the Go")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    renderNavigation();

    // Check if all navigation links are present (use getAllByText to handle multiple instances)
    const shopLinks = screen.getAllByText("Shop");
    const ingredientsLinks = screen.getAllByText("Ingredients");
    const communityLinks = screen.getAllByText("Community");
    const founderLinks = screen.getAllByText("Our Founder");

    expect(shopLinks.length).toBeGreaterThan(0);
    expect(ingredientsLinks.length).toBeGreaterThan(0);
    expect(communityLinks.length).toBeGreaterThan(0);
    expect(founderLinks.length).toBeGreaterThan(0);
  });

  it("renders mobile menu button", () => {
    renderNavigation();

    const mobileMenuButton = screen.getByLabelText("Toggle mobile menu");
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it("mobile menu button is clickable", () => {
    renderNavigation();

    const mobileMenuButton = screen.getByLabelText("Toggle mobile menu");
    expect(mobileMenuButton).toBeInTheDocument();

    // Test that clicking doesn't throw an error
    expect(() => fireEvent.click(mobileMenuButton)).not.toThrow();
  });

  it("has correct navigation links with proper hrefs", () => {
    renderNavigation();

    // Use getAllByText and get the first instance for each link
    const shopLinks = screen.getAllByText("Shop");
    const ingredientsLinks = screen.getAllByText("Ingredients");
    const communityLinks = screen.getAllByText("Community");
    const founderLinks = screen.getAllByText("Our Founder");

    const shopLink = shopLinks[0].closest("a");
    const ingredientsLink = ingredientsLinks[0].closest("a");
    const communityLink = communityLinks[0].closest("a");
    const founderLink = founderLinks[0].closest("a");

    expect(shopLink).toHaveAttribute("href", "/shop");
    expect(ingredientsLink).toHaveAttribute("href", "/ingredients");
    expect(communityLink).toHaveAttribute("href", "/your-buddies");
    expect(founderLink).toHaveAttribute("href", "/founders");
  });

  it("logo links to home page", () => {
    renderNavigation();

    const logoText = screen.getByText("Mocktails");
    const logoLink = logoText.closest("a");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("has proper accessibility attributes", () => {
    renderNavigation();

    const mobileMenuButton = screen.getByLabelText("Toggle mobile menu");
    expect(mobileMenuButton).toHaveAttribute(
      "aria-label",
      "Toggle mobile menu",
    );
  });
});
