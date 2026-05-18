import React from "react";
import { render, screen } from "@/__tests__/test-utils";
import ProductPageWrapper from "../ProductPageWrapper";
import "@jest/globals";

jest.mock("../ProductPageClient", () => ({
  __esModule: true,
  default: ({ product }: { product: { name: string } }) => (
    <div data-testid="product-page-client">Product: {product.name}</div>
  ),
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
};

const mockOtherProducts = [mockProduct];

describe("ProductPageWrapper", () => {
  it("renders product page client immediately", () => {
    render(
      <ProductPageWrapper
        product={mockProduct}
        otherProducts={mockOtherProducts}
      />,
    );

    expect(screen.getByTestId("product-page-client")).toBeInTheDocument();
  });

  it("passes product and otherProducts to ProductPageClient", () => {
    render(
      <ProductPageWrapper
        product={mockProduct}
        otherProducts={mockOtherProducts}
      />,
    );

    expect(screen.getByText("Product: Test Product")).toBeInTheDocument();
  });
});
