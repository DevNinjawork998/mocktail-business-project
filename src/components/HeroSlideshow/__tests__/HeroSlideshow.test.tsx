import React from "react";
import { render, screen, waitFor } from "../../../__tests__/test-utils";
import HeroSlideshow from "../HeroSlideshow";

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

// Mock the settings action
jest.mock("@/app/actions/settings", () => ({
  getLandingPhotoUrl: jest.fn().mockResolvedValue({
    success: true,
    data: null, // Return null to use fallback URL
  }),
}));

describe("HeroSlideshow", () => {
  it("renders the hero image with correct src and alt", async () => {
    render(<HeroSlideshow />);

    await waitFor(() => {
      const image = screen.getByAltText("Mocktails On the Go - Fresh Mocktail");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute(
        "src",
        process.env.NEXT_PUBLIC_LANDING_PHOTO_URL ||
          "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGLDgNsR5ihjkVF8eaqWlO3pXP4g9ZHb0cCNLnI",
      );
    });
  });

  it("renders the image with priority prop", async () => {
    render(<HeroSlideshow />);

    await waitFor(() => {
      const image = screen.getByAltText("Mocktails On the Go - Fresh Mocktail");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("data-priority", "true");
    });
  });

  it("renders the adaptogen badge", () => {
    render(<HeroSlideshow />);

    expect(screen.getByText("🌿 Adaptogen Powered")).toBeInTheDocument();
  });

  it("renders the fruit badge", () => {
    render(<HeroSlideshow />);

    expect(screen.getByText("🍊 Wholesome Ingredients Only")).toBeInTheDocument();
  });

  it("renders both badges", () => {
    render(<HeroSlideshow />);

    expect(screen.getByText("🌿 Adaptogen Powered")).toBeInTheDocument();
    expect(screen.getByText("🍊 Wholesome Ingredients Only")).toBeInTheDocument();
  });
});
