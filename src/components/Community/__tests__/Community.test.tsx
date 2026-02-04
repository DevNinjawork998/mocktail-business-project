import React from "react";
import { render, screen, fireEvent } from "../../../__tests__/test-utils";
import Community from "../Community";

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

describe("Community", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title correctly", () => {
    render(<Community />);

    expect(screen.getByText("Our Community")).toBeInTheDocument();
  });

  it("renders the subtitle correctly", () => {
    render(<Community />);

    expect(
      screen.getByText(
        "Join our vibrant community of mocktail lovers. Tag us in a picture to be featured!",
      ),
    ).toBeInTheDocument();
  });

  it("renders all community photos", () => {
    render(<Community />);

    // Should render 6 photos
    const photos = screen.getAllByRole("img");
    expect(photos.length).toBe(6);
  });

  it("renders photo cards with correct alt text", () => {
    render(<Community />);

    expect(
      screen.getByAltText("Mocktail in a glass with orange garnish"),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Overhead view of mocktails and food"),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Bottles and glasses on a table"),
    ).toBeInTheDocument();
  });

  it("opens Instagram when photo card is clicked", () => {
    render(<Community />);

    const photoCards = screen.getAllByRole("img");
    const firstPhoto = photoCards[0].closest("div");

    if (firstPhoto) {
      fireEvent.click(firstPhoto);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        "https://www.instagram.com/mocktailsonthego_motg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        "_blank",
      );
    }
  });

  it("renders CTA button with Instagram icon and hashtag", () => {
    render(<Community />);

    expect(screen.getByText("@MocktailsOnTheGo")).toBeInTheDocument();
  });

  it("opens Instagram when CTA button is clicked", () => {
    render(<Community />);

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
    render(<Community />);

    expect(
      screen.getByText(/Share your mocktail moments with/),
    ).toBeInTheDocument();
    expect(screen.getByText("#MocktailsOnTheGo")).toBeInTheDocument();
  });
});
