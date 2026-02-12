import React from "react";
import { render, screen, fireEvent } from "../../../__tests__/test-utils";
import Community from "../Community";

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

const mockInstagramPosts = [
  {
    id: "1",
    postUrl: "https://www.instagram.com/p/test1/",
    imageUrl:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&h=600&fit=crop",
  },
  {
    id: "2",
    postUrl: "https://www.instagram.com/p/test2/",
    imageUrl:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=600&fit=crop",
  },
  {
    id: "3",
    postUrl: "https://www.instagram.com/p/test3/",
    imageUrl:
      "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?w=600&h=600&fit=crop",
  },
  {
    id: "4",
    postUrl: "https://www.instagram.com/p/test4/",
    imageUrl:
      "https://images.unsplash.com/photo-1622597467836-f3c7ca9d7b17?w=600&h=600&fit=crop",
  },
  {
    id: "5",
    postUrl: "https://www.instagram.com/p/test5/",
    imageUrl:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&h=600&fit=crop",
  },
  {
    id: "6",
    postUrl: "https://www.instagram.com/p/test6/",
    imageUrl:
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=600&h=600&fit=crop",
  },
];

describe("Community", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title correctly", () => {
    render(<Community instagramPosts={mockInstagramPosts} />);

    expect(screen.getByText("Our Community")).toBeInTheDocument();
  });

  it("renders the subtitle correctly", () => {
    render(<Community instagramPosts={mockInstagramPosts} />);

    expect(
      screen.getByText(
        "Join our vibrant community of mocktail lovers. Tag us in a picture to be featured!",
      ),
    ).toBeInTheDocument();
  });

  it("renders all community photos", () => {
    render(<Community instagramPosts={mockInstagramPosts} />);

    // Should render 6 photos
    const photos = screen.getAllByRole("img");
    expect(photos.length).toBe(6);
  });

  it("renders photo cards with correct alt text", () => {
    render(<Community instagramPosts={mockInstagramPosts} />);

    // All photos should have "Instagram post" as alt text
    const photos = screen.getAllByAltText("Instagram post");
    expect(photos.length).toBe(6);
  });

  it("opens Instagram when photo card is clicked", () => {
    render(<Community instagramPosts={mockInstagramPosts} />);

    const photoCards = screen.getAllByRole("img");
    const firstPhoto = photoCards[0].closest("div");

    if (firstPhoto) {
      fireEvent.click(firstPhoto);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        "https://www.instagram.com/p/test1/",
        "_blank",
      );
    }
  });

  it("renders CTA button with Instagram icon and hashtag", () => {
    render(<Community instagramPosts={mockInstagramPosts} />);

    expect(screen.getByText("@MocktailsOnTheGo")).toBeInTheDocument();
  });

  it("opens Instagram when CTA button is clicked", () => {
    render(<Community instagramPosts={mockInstagramPosts} />);

    const ctaButton = screen.getByText("@MocktailsOnTheGo").closest("button");

    if (ctaButton) {
      fireEvent.click(ctaButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        "https://www.instagram.com/mocktailsonthego_motg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        "_blank",
      );
    }
  });

  it("renders call to action text with hashtag", () => {
    render(<Community instagramPosts={mockInstagramPosts} />);

    expect(
      screen.getByText(/Share your mocktail moments with/),
    ).toBeInTheDocument();
    expect(screen.getByText("#MocktailsOnTheGo")).toBeInTheDocument();
  });
});
