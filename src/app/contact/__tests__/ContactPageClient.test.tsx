import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import ContactPageClient from "../ContactPageClient";

jest.mock(
  "../../../components/Navigation/Navigation",
  () =>
    function MockNavigation() {
      return <div data-testid="navigation" />;
    },
);
jest.mock(
  "../../../components/Footer/Footer",
  () =>
    function MockFooter() {
      return <div data-testid="footer" />;
    },
);

describe("ContactPageClient", () => {
  it("renders the contact page heading", () => {
    render(<ContactPageClient />);
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("renders navigation and footer", () => {
    render(<ContactPageClient />);
    expect(screen.getByTestId("navigation")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders the Instagram link", () => {
    render(<ContactPageClient />);
    expect(
      screen.getByText("Instagram @mmocktailsonthego_motg"),
    ).toBeInTheDocument();
  });
});
