import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import RunningBanner from "../RunningBanner";

// Mock bannerData
jest.mock("@/data/bannerData", () => ({
  bannerData: [
    {
      type: "message",
      content: "Free shipping on all orders over $50!",
    },
    {
      type: "image",
      src: "https://example.com/image1.jpg",
      alt: "Test Image 1",
    },
    {
      type: "message",
      content: "New flavor just dropped: Strawberry Basil!",
    },
  ],
}));

describe("RunningBanner", () => {
  it("renders all banner messages", () => {
    render(<RunningBanner />);

    // Banner data is duplicated, so messages appear multiple times
    expect(
      screen.getAllByText("Free shipping on all orders over $50!").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("New flavor just dropped: Strawberry Basil!").length,
    ).toBeGreaterThan(0);
  });

  it("does not render images (images are temporarily removed)", () => {
    render(<RunningBanner />);

    // Images should not be rendered
    const images = screen.queryAllByAltText("Test Image 1");
    expect(images.length).toBe(0);
  });

  it("duplicates banner data for seamless loop", () => {
    render(<RunningBanner />);

    // Since messages are duplicated, we should see messages twice
    const messages = screen.getAllByText(
      "Free shipping on all orders over $50!",
    );
    expect(messages.length).toBe(2);
  });

  it("only renders message types (images filtered out)", () => {
    render(<RunningBanner />);

    // Only messages should be rendered
    expect(
      screen.getAllByText("Free shipping on all orders over $50!").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText("New flavor just dropped: Strawberry Basil!").length,
    ).toBeGreaterThan(0);

    // Images should not be rendered
    expect(screen.queryAllByAltText("Test Image 1").length).toBe(0);
  });
});
