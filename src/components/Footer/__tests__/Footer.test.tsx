import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import Footer from "../Footer";
import "@jest/globals";

describe("Footer", () => {
  it("renders all social links with correct href and aria-label", () => {
    render(<Footer />);
    // Get social links specifically by their aria-labels
    const instagramLink = screen.getByLabelText("Follow us on Instagram");
    const tiktokLink = screen.getByLabelText("Follow us on TikTok");
    const whatsappLink = screen.getByLabelText("Contact us on WhatsApp");

    expect(instagramLink).toHaveAttribute("href");
    expect(instagramLink).toHaveAttribute("aria-label", "Follow us on Instagram");
    expect(instagramLink).toHaveAttribute("target", "_blank");
    expect(instagramLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(tiktokLink).toHaveAttribute("href");
    expect(tiktokLink).toHaveAttribute("aria-label", "Follow us on TikTok");
    expect(tiktokLink).toHaveAttribute("target", "_blank");
    expect(tiktokLink).toHaveAttribute("rel", "noopener noreferrer");

    expect(whatsappLink).toHaveAttribute("href");
    expect(whatsappLink).toHaveAttribute("aria-label", "Contact us on WhatsApp");
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders copyright text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/© 2025 Mocktails On the Go. All rights reserved./i),
    ).toBeInTheDocument();
  });

  it("renders main tagline", () => {
    render(<Footer />);
    expect(
      screen.getByText(/catch the vibe, not the hangover/i),
    ).toBeInTheDocument();
  });

  it("renders social section title", () => {
    render(<Footer />);
    expect(screen.getByText(/connect with us/i)).toBeInTheDocument();
  });

  it("renders navigation columns", () => {
    render(<Footer />);
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("More")).toBeInTheDocument();
  });

  it("renders shop navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("All Products")).toBeInTheDocument();
  });

  it("renders company navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("Our Founder")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders legal links", () => {
    render(<Footer />);
    // Privacy Policy appears in both "More" section and legal links, so use getAllByText
    const privacyLinks = screen.getAllByText("Privacy Policy");
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(screen.getAllByText("Terms of Service").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shipping").length).toBeGreaterThan(0);
  });
});
