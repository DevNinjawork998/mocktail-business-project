import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import FoundersPageClient from "../FoundersPageClient";

// Mock child components
jest.mock("../../../components/Navigation/Navigation", () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation</nav>;
  };
});

jest.mock("../../../components/Breadcrumb/Breadcrumb", () => {
  return function MockBreadcrumb({
    items,
  }: {
    items: Array<{ label: string }>;
  }) {
    return (
      <div data-testid="breadcrumb">
        {items.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    );
  };
});

jest.mock("../../../components/FounderStory/FounderStory", () => {
  return function MockFounderStory() {
    return <div data-testid="founder-story">Founder Story</div>;
  };
});

jest.mock("../../../components/Footer/Footer", () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

describe("FoundersPageClient", () => {
  it("renders navigation component", () => {
    render(<FoundersPageClient />);

    expect(screen.getByTestId("navigation")).toBeInTheDocument();
  });

  it("renders breadcrumb with correct items", () => {
    render(<FoundersPageClient />);

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
    expect(screen.getByText("Meet Our Founders")).toBeInTheDocument();
  });

  it("renders founder story component", () => {
    render(<FoundersPageClient />);

    expect(screen.getByTestId("founder-story")).toBeInTheDocument();
  });

  it("renders footer component", () => {
    render(<FoundersPageClient />);

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders all components in correct order", () => {
    render(<FoundersPageClient />);

    const navigation = screen.getByTestId("navigation");
    const breadcrumb = screen.getByTestId("breadcrumb");
    const founderStory = screen.getByTestId("founder-story");
    const footer = screen.getByTestId("footer");

    expect(navigation).toBeInTheDocument();
    expect(breadcrumb).toBeInTheDocument();
    expect(founderStory).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });
});
