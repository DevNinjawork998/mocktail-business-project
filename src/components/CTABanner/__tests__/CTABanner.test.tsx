import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import CTABanner from "../CTABanner";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

describe("CTABanner", () => {
  it("renders the heading correctly", () => {
    render(<CTABanner />);

    expect(
      screen.getByText("Ready to upgrade your drinks?"),
    ).toBeInTheDocument();
  });

  it("renders the subtext correctly", () => {
    render(<CTABanner />);

    expect(
      screen.getByText(
        "Join thousands who've made the switch to mocktails that actually make you feel good.",
      ),
    ).toBeInTheDocument();
  });

  it("renders primary button with correct text and link", () => {
    render(<CTABanner />);

    const primaryButton = screen.getByText("Start Shopping");
    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton.closest("a")).toHaveAttribute("href", "/shop");
  });

  it("renders secondary button with correct text and link", () => {
    render(<CTABanner />);

    const secondaryButton = screen.getByText("Subscribe & Save 20%");
    expect(secondaryButton).toBeInTheDocument();
    expect(secondaryButton.closest("a")).toHaveAttribute(
      "href",
      "/shop#subscribe",
    );
  });

  it("renders both buttons", () => {
    render(<CTABanner />);

    expect(screen.getByText("Start Shopping")).toBeInTheDocument();
    expect(screen.getByText("Subscribe & Save 20%")).toBeInTheDocument();
  });
});
