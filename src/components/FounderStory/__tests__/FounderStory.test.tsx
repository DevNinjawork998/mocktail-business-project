import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import FounderStory from "../FounderStory";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    style?: React.CSSProperties;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} />;
  },
}));

describe("FounderStory", () => {
  it("renders the label correctly", () => {
    render(<FounderStory />);

    expect(screen.getByText("MEET OUR FOUNDER")).toBeInTheDocument();
  });

  it("renders the title correctly", () => {
    render(<FounderStory />);

    expect(screen.getByText("The Story Behind the Sip")).toBeInTheDocument();
  });

  it("renders the founder image with correct alt text", () => {
    render(<FounderStory />);

    const image = screen.getByAltText("Founder of Mocktails On the Go");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/founder/founder.png");
  });

  it("renders the founder story text", () => {
    render(<FounderStory />);

    expect(
      screen.getByText(
        /Growing up, stress was a constant companion in my life/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /That's when I knew I wanted to change the drinking scene in Malaysia/,
      ),
    ).toBeInTheDocument();
  });

  it("renders the CTA button with correct text", () => {
    render(<FounderStory />);

    const ctaButton = screen.getByText("Follow Our Journey");
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.closest("a")).toHaveAttribute("target", "_blank");
  });

  it("renders the quote correctly", () => {
    render(<FounderStory />);

    expect(
      screen.getByText('"Sip without guilt with our mocktails"'),
    ).toBeInTheDocument();
  });

  it("renders the quote author correctly", () => {
    render(<FounderStory />);

    expect(screen.getByText("- Krishanthini, founder")).toBeInTheDocument();
  });

  it("CTA button has correct Instagram link", () => {
    render(<FounderStory />);

    const ctaButton = screen.getByText("Follow Our Journey");
    const link = ctaButton.closest("a");
    expect(link).toHaveAttribute(
      "href",
      "https://www.instagram.com/mocktailsonthego_motg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D",
    );
  });
});
