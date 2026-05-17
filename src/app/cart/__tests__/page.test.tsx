import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import CartPage from "../page";
import { CartProvider } from "../../../contexts/CartContext";

// Mock the components to focus on page structure
jest.mock("../../../components/Navigation/Navigation", () => {
  return function MockNavigation() {
    return <div data-testid="navigation">Navigation</div>;
  };
});

jest.mock("../../../components/Breadcrumb/Breadcrumb", () => {
  return function MockBreadcrumb({ items }: { items: { label: string }[] }) {
    return (
      <div data-testid="breadcrumb">
        Breadcrumb: {items.map((item) => item.label).join(" > ")}
      </div>
    );
  };
});

jest.mock("../../../components/Footer/Footer", () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock("../CartPageClient", () => {
  return function MockCartPageClient() {
    return <div data-testid="cart-page-client">CartPageClient</div>;
  };
});

describe("CartPage", () => {
  const renderCartPage = async () => {
    const resolvedPage = await CartPage();
    return render(<CartProvider>{resolvedPage}</CartProvider>);
  };

  it("renders all main components", async () => {
    await renderCartPage();

    expect(screen.getByTestId("navigation")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByTestId("cart-page-client")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("displays correct breadcrumb navigation", async () => {
    await renderCartPage();

    const breadcrumb = screen.getByTestId("breadcrumb");
    expect(breadcrumb).toHaveTextContent("Shop > Cart");
  });

  it("renders in correct order", async () => {
    await renderCartPage();

    const navigation = screen.getByTestId("navigation");
    const breadcrumb = screen.getByTestId("breadcrumb");
    const cartClient = screen.getByTestId("cart-page-client");
    const footer = screen.getByTestId("footer");

    // Check that elements are rendered in the correct order
    expect(
      navigation.compareDocumentPosition(breadcrumb) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      breadcrumb.compareDocumentPosition(cartClient) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      cartClient.compareDocumentPosition(footer) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
