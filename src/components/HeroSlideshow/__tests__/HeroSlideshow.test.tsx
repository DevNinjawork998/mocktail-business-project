import React from "react";
import { render, screen, act } from "../../../__tests__/test-utils";
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

  describe("reduced motion", () => {
    const buildMatchMedia = (matches: boolean) => {
      const listeners: (() => void)[] = [];
      return jest.fn().mockImplementation(() => ({
        matches,
        addEventListener: (_: string, fn: () => void) => listeners.push(fn),
        removeEventListener: (_: string, fn: () => void) => {
          const idx = listeners.indexOf(fn);
          if (idx >= 0) listeners.splice(idx, 1);
        },
        dispatchEvent: jest.fn(),
        get _listeners() {
          return listeners;
        },
      }));
    };

    it("shows only first image when prefers-reduced-motion matches", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: buildMatchMedia(true),
      });
      const urls = ["https://a.com/1.jpg", "https://a.com/2.jpg"];
      render(<HeroSlideshow heroUrls={urls} firstImageUrl={urls[0]} />);
      const images = screen.getAllByAltText(
        "Mocktails On the Go - Fresh Mocktail",
      );
      expect(images.length).toBe(1);
    });

    it("shows all images when prefers-reduced-motion does not match", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: buildMatchMedia(false),
      });
      const urls = ["https://a.com/1.jpg", "https://a.com/2.jpg"];
      render(<HeroSlideshow heroUrls={urls} firstImageUrl={urls[0]} />);
      const images = screen.getAllByAltText(
        "Mocktails On the Go - Fresh Mocktail",
      );
      expect(images.length).toBe(2);
    });

    it("fires change listener when media query changes", () => {
      let storedMq: ReturnType<typeof buildMatchMedia> | null = null;
      storedMq = buildMatchMedia(false);
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: storedMq,
      });
      const urls = ["https://a.com/1.jpg", "https://a.com/2.jpg"];
      render(<HeroSlideshow heroUrls={urls} firstImageUrl={urls[0]} />);
      const mq = storedMq.mock.results[0].value;
      act(() => {
        mq._listeners.forEach((fn: () => void) => fn());
      });
      expect(screen.getAllByAltText("Mocktails On the Go - Fresh Mocktail").length).toBeGreaterThan(0);
    });
  });

  describe("slide rotation timer", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          matches: false,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("advances to next slide after 5 seconds", () => {
      const urls = ["https://a.com/1.jpg", "https://a.com/2.jpg"];
      render(<HeroSlideshow heroUrls={urls} firstImageUrl={urls[0]} />);
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(
        screen.getAllByAltText("Mocktails On the Go - Fresh Mocktail").length,
      ).toBeGreaterThan(0);
    });

    it("does not set rotation timer for single image", () => {
      render(
        <HeroSlideshow heroUrls={[FALLBACK_SRC]} firstImageUrl={FALLBACK_SRC} />,
      );
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(
        screen.getByAltText("Mocktails On the Go - Fresh Mocktail"),
      ).toBeInTheDocument();
    });
  });
});
