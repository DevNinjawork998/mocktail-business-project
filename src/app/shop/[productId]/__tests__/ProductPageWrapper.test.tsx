import React from "react";
import { render, screen, waitFor } from "@/__tests__/test-utils";
import ProductPageWrapper from "../ProductPageWrapper";
import "@jest/globals";

// Mock the child components
jest.mock("../ProductPageClient", () => ({
  __esModule: true,
  default: ({ product }: { product: { name: string } }) => (
    <div data-testid="product-page-client">Product: {product.name}</div>
  ),
}));

jest.mock("../ProductPageLoading", () => ({
  __esModule: true,
  default: () => <div data-testid="product-page-loading">Loading...</div>,
}));

const mockProduct = {
  id: "test-id",
  name: "Test Product",
  subtitle: "Test Subtitle",
  description: "Test Description",
  longDescription: "<p>Test</p>",
  price: "$10",
  priceSubtext: "per bottle",
  imageColor: "#000000",
  imageUrl: null,
  features: [],
  ingredients: null,
  productBrief: null,
  nutritionFacts: null,
};

const mockOtherProducts = [mockProduct];

describe("ProductPageWrapper", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders loading component initially", () => {
    render(
      <ProductPageWrapper product={mockProduct} otherProducts={mockOtherProducts} />
    );

    expect(screen.getByTestId("product-page-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("product-page-client")).not.toBeInTheDocument();
  });

  it("renders product page client after loading delay", async () => {
    render(
      <ProductPageWrapper product={mockProduct} otherProducts={mockOtherProducts} />
    );

    // Fast-forward time
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByTestId("product-page-client")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("product-page-loading")).not.toBeInTheDocument();
  });

  it("cleans up timer on unmount", () => {
    const { unmount } = render(
      <ProductPageWrapper product={mockProduct} otherProducts={mockOtherProducts} />
    );

    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("passes product and otherProducts to ProductPageClient", async () => {
    render(
      <ProductPageWrapper product={mockProduct} otherProducts={mockOtherProducts} />
    );

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.getByText("Product: Test Product")).toBeInTheDocument();
    });
  });
});
