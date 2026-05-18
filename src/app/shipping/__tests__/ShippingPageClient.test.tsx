import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import ShippingPageClient from "../ShippingPageClient";

jest.mock("../../../components/Navigation/Navigation", () =>
  function MockNavigation() {
    return <div data-testid="navigation" />;
  },
);
jest.mock("../../../components/Footer/Footer", () =>
  function MockFooter() {
    return <div data-testid="footer" />;
  },
);

describe("ShippingPageClient", () => {
  it("renders the shipping heading", () => {
    render(<ShippingPageClient />);
    expect(screen.getByText("Shipping Information")).toBeInTheDocument();
  });

  it("renders navigation and footer", () => {
    render(<ShippingPageClient />);
    expect(screen.getByTestId("navigation")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders shipping details text", () => {
    render(<ShippingPageClient />);
    expect(
      screen.getByText(/We currently ship throughout Malaysia/),
    ).toBeInTheDocument();
  });
});
