import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import HeroSlideshow from "../HeroSlideshow";

const FALLBACK_SRC =
  process.env.NEXT_PUBLIC_LANDING_PHOTO_URL ||
  "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGLDgNsR5ihjkVF8eaqWlO3pXP4g9ZHb0cCNLnI";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    priority,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    style?: React.CSSProperties;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-priority={priority} />;
  },
}));

describe("HeroSlideshow", () => {
  it("renders the hero image with correct src and alt", () => {
    render(
      <HeroSlideshow heroUrls={[FALLBACK_SRC]} firstImageUrl={FALLBACK_SRC} />,
    );

    const image = screen.getByAltText("Mocktails On the Go - Fresh Mocktail");
    expect(image).toHaveAttribute("src", FALLBACK_SRC);
  });

  it("renders the image with priority prop", () => {
    render(
      <HeroSlideshow heroUrls={[FALLBACK_SRC]} firstImageUrl={FALLBACK_SRC} />,
    );

    const image = screen.getByAltText("Mocktails On the Go - Fresh Mocktail");
    expect(image).toHaveAttribute("data-priority", "true");
  });

  it("renders the adaptogen badge", () => {
    render(
      <HeroSlideshow heroUrls={[FALLBACK_SRC]} firstImageUrl={FALLBACK_SRC} />,
    );

    expect(screen.getByText("🌿 Adaptogen Powered")).toBeInTheDocument();
  });

  it("renders the fruit badge", () => {
    render(
      <HeroSlideshow heroUrls={[FALLBACK_SRC]} firstImageUrl={FALLBACK_SRC} />,
    );

    expect(
      screen.getByText("🍊 Wholesome Ingredients Only"),
    ).toBeInTheDocument();
  });

  it("renders both badges", () => {
    render(
      <HeroSlideshow heroUrls={[FALLBACK_SRC]} firstImageUrl={FALLBACK_SRC} />,
    );

    expect(screen.getByText("🌿 Adaptogen Powered")).toBeInTheDocument();
    expect(
      screen.getByText("🍊 Wholesome Ingredients Only"),
    ).toBeInTheDocument();
  });

  it("uses database slide URLs when provided", () => {
    const urls = [
      "https://example.com/hero-a.jpg",
      "https://example.com/hero-b.jpg",
    ];

    render(<HeroSlideshow heroUrls={urls} firstImageUrl={urls[0]} />);

    const images = screen.getAllByAltText(
      "Mocktails On the Go - Fresh Mocktail",
    );
    expect(images.length).toBe(2);
    expect(images[0]).toHaveAttribute("src", "https://example.com/hero-a.jpg");
    expect(images[1]).toHaveAttribute("src", "https://example.com/hero-b.jpg");
  });
});
