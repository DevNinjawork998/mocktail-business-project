import React from "react";
import { render, screen, waitFor } from "../../../__tests__/test-utils";
import HeroSlideshow from "../HeroSlideshow";
import * as settingsActions from "@/app/actions/settings";

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

jest.mock("@/app/actions/settings", () => ({
  getLandingHeroSlideUrls: jest.fn(),
}));

/** Wait until async fetch + loading gate finish so effects run inside RTL act(). */
async function waitForHeroReady(): Promise<void> {
  await waitFor(() => {
    expect(
      screen.getByAltText("Mocktails On the Go - Fresh Mocktail"),
    ).toBeInTheDocument();
  });
}

describe("HeroSlideshow", () => {
  beforeEach(() => {
    (
      settingsActions.getLandingHeroSlideUrls as jest.MockedFunction<
        typeof settingsActions.getLandingHeroSlideUrls
      >
    ).mockResolvedValue({
      success: true,
      data: [] as string[],
    });
  });

  it("renders the hero image with correct src and alt", async () => {
    render(<HeroSlideshow />);

    await waitForHeroReady();

    const image = screen.getByAltText("Mocktails On the Go - Fresh Mocktail");
    expect(image).toHaveAttribute("src", FALLBACK_SRC);
  });

  it("renders the image with priority prop", async () => {
    render(<HeroSlideshow />);

    await waitForHeroReady();

    const image = screen.getByAltText("Mocktails On the Go - Fresh Mocktail");
    expect(image).toHaveAttribute("data-priority", "true");
  });

  it("renders the adaptogen badge", async () => {
    render(<HeroSlideshow />);

    await waitForHeroReady();

    expect(screen.getByText("🌿 Adaptogen Powered")).toBeInTheDocument();
  });

  it("renders the fruit badge", async () => {
    render(<HeroSlideshow />);

    await waitForHeroReady();

    expect(
      screen.getByText("🍊 Wholesome Ingredients Only"),
    ).toBeInTheDocument();
  });

  it("renders both badges", async () => {
    render(<HeroSlideshow />);

    await waitForHeroReady();

    expect(screen.getByText("🌿 Adaptogen Powered")).toBeInTheDocument();
    expect(
      screen.getByText("🍊 Wholesome Ingredients Only"),
    ).toBeInTheDocument();
  });

  it("uses database slide URLs when provided", async () => {
    (
      settingsActions.getLandingHeroSlideUrls as jest.MockedFunction<
        typeof settingsActions.getLandingHeroSlideUrls
      >
    ).mockResolvedValueOnce({
      success: true,
      data: [
        "https://example.com/hero-a.jpg",
        "https://example.com/hero-b.jpg",
      ],
    });

    render(<HeroSlideshow />);

    await waitFor(() => {
      const images = screen.getAllByAltText(
        "Mocktails On the Go - Fresh Mocktail",
      );
      expect(images.length).toBe(2);
    });

    const images = screen.getAllByAltText(
      "Mocktails On the Go - Fresh Mocktail",
    );
    expect(images[0]).toHaveAttribute("src", "https://example.com/hero-a.jpg");
    expect(images[1]).toHaveAttribute("src", "https://example.com/hero-b.jpg");
  });
});
