import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import ProductPageLoading from "../ProductPageLoading";
import "@jest/globals";

// Mock the styled components
jest.mock("../page.styles", () => ({
  LoadingContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-container">{children}</div>
  ),
  LoadingContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-content">{children}</div>
  ),
  LoadingMainContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-main-content">{children}</div>
  ),
  LoadingImageSection: () => <div data-testid="loading-image-section" />,
  LoadingDetailsSection: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-details-section">{children}</div>
  ),
  LoadingTitle: () => <div data-testid="loading-title" />,
  LoadingSubtitle: () => <div data-testid="loading-subtitle" />,
  LoadingFeatures: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-features">{children}</div>
  ),
  LoadingFeatureBadge: () => <div data-testid="loading-feature-badge" />,
  LoadingDescription: () => <div data-testid="loading-description" />,
  LoadingPrice: () => <div data-testid="loading-price" />,
  LoadingPriceSubtext: () => <div data-testid="loading-price-subtext" />,
  LoadingButtonGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-button-group">{children}</div>
  ),
  LoadingQuantitySelector: () => (
    <div data-testid="loading-quantity-selector" />
  ),
  LoadingAddToCartButton: () => (
    <div data-testid="loading-add-to-cart-button" />
  ),
  LoadingSidebar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-sidebar">{children}</div>
  ),
  LoadingSidebarTitle: () => <div data-testid="loading-sidebar-title" />,
  LoadingSidebarGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-sidebar-grid">{children}</div>
  ),
  LoadingSidebarCard: () => <div data-testid="loading-sidebar-card" />,
}));

describe("ProductPageLoading", () => {
  it("renders all loading skeleton elements", () => {
    render(<ProductPageLoading />);

    expect(screen.getByTestId("loading-container")).toBeInTheDocument();
    expect(screen.getByTestId("loading-content")).toBeInTheDocument();
    expect(screen.getByTestId("loading-main-content")).toBeInTheDocument();
    expect(screen.getByTestId("loading-image-section")).toBeInTheDocument();
    expect(screen.getByTestId("loading-details-section")).toBeInTheDocument();
    expect(screen.getByTestId("loading-title")).toBeInTheDocument();
    expect(screen.getByTestId("loading-subtitle")).toBeInTheDocument();
    expect(screen.getByTestId("loading-features")).toBeInTheDocument();
    expect(screen.getByTestId("loading-description")).toBeInTheDocument();
    expect(screen.getByTestId("loading-price")).toBeInTheDocument();
    expect(screen.getByTestId("loading-price-subtext")).toBeInTheDocument();
    expect(screen.getByTestId("loading-button-group")).toBeInTheDocument();
    expect(screen.getByTestId("loading-quantity-selector")).toBeInTheDocument();
    expect(
      screen.getByTestId("loading-add-to-cart-button"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("loading-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("loading-sidebar-title")).toBeInTheDocument();
    expect(screen.getByTestId("loading-sidebar-grid")).toBeInTheDocument();
  });

  it("renders three feature badges", () => {
    render(<ProductPageLoading />);

    const badges = screen.getAllByTestId("loading-feature-badge");
    expect(badges).toHaveLength(3);
  });

  it("renders four sidebar cards", () => {
    render(<ProductPageLoading />);

    const cards = screen.getAllByTestId("loading-sidebar-card");
    expect(cards).toHaveLength(4);
  });
});
