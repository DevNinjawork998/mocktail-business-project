import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import Testimonials from "../Testimonials";

describe("Testimonials", () => {
  it("renders the section title correctly", () => {
    render(<Testimonials />);

    expect(screen.getByText("Customer Testimonials 🥂")).toBeInTheDocument();
  });

  it("renders the section subtitle correctly", () => {
    render(<Testimonials />);

    expect(
      screen.getByText(
        "Real words from happy customers who've tasted the magic ✨",
      ),
    ).toBeInTheDocument();
  });

  it("displays testimonials in carousel", () => {
    render(<Testimonials />);

    // Should display both testimonials (duplicated for seamless loop)
    expect(
      screen.getAllByText(/Halal mocktails & so healthy/).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/My favourite flavour of the 3 is Tequila Sundown/)
        .length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("yasmeenn").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KM").length).toBeGreaterThan(0);
  });

  it("renders star ratings correctly", () => {
    render(<Testimonials />);

    // All testimonials have 5 stars, so we should see multiple filled stars
    const filledStars = screen.getAllByText("★");
    expect(filledStars.length).toBeGreaterThan(0);
  });

  it("renders customer names", () => {
    render(<Testimonials />);

    // Testimonials are duplicated for carousel, so use getAllByText
    expect(screen.getAllByText("yasmeenn").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KM").length).toBeGreaterThan(0);
  });

  it("displays correct testimonial text", () => {
    render(<Testimonials />);

    // Testimonials are duplicated for carousel, so use getAllByText
    expect(
      screen.getAllByText(
        /Halal mocktails & so healthy. Tried Tequila Sundown & Maca Martini sedap sangat!!/,
      ).length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(/My favourite flavour of the 3 is Tequila Sundown/)
        .length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText(
        /As for Dark & Stormy, I like how it gives my throat a nice warm hug with the ginger kick/,
      ).length,
    ).toBeGreaterThan(0);
  });

  it("renders customer avatars with initials", () => {
    render(<Testimonials />);

    // yasmeenn has "Y" initial, KM has "K" initial
    expect(screen.getAllByText("Y").length).toBeGreaterThan(0);
    expect(screen.getAllByText("K").length).toBeGreaterThan(0);
  });

  it("renders carousel with duplicated testimonials for seamless loop", () => {
    const { container } = render(<Testimonials />);

    // Verify testimonials are rendered multiple times (duplicated for carousel loop)
    // Each testimonial should appear at least twice (original + duplicate)
    const yasmeennElements = screen.getAllByText("yasmeenn");
    const kmElements = screen.getAllByText("KM");
    
    // Should have at least 2 of each (original + duplicate for seamless loop)
    expect(yasmeennElements.length).toBeGreaterThanOrEqual(2);
    expect(kmElements.length).toBeGreaterThanOrEqual(2);
  });
});
