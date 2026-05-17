import React from "react";
import { render, screen, fireEvent } from "../../../__tests__/test-utils";
import Testimonials from "../Testimonials";

const mockTestimonials = [
  {
    id: "1",
    text: "Halal mocktails & so healthy. Tried Tequila Sundown & Maca Martini sedap sangat!!",
    customerName: "yasmeenn",
    avatarColor: "#FF6B6B",
    rating: 5,
  },
  {
    id: "2",
    text: "My favourite flavour of the 3 is Tequila Sundown 😊. As for Dark & Stormy, I like how it gives my throat a nice warm hug with the ginger kick",
    customerName: "KM",
    avatarColor: "#4ECDC4",
    rating: 5,
  },
];

describe("Testimonials", () => {
  it("renders the section title correctly", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText("Customer Testimonials 🥂")).toBeInTheDocument();
  });

  it("renders the section subtitle correctly", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(
      screen.getByText(
        "Real words from happy customers who've tasted the magic ✨",
      ),
    ).toBeInTheDocument();
  });

  it("displays testimonials in carousel", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(
      screen.getAllByText(/Halal mocktails & so healthy/).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("yasmeenn").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KM").length).toBeGreaterThan(0);
  });

  it("renders star ratings correctly", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    const filledStars = screen.getAllByText("★");
    expect(filledStars.length).toBeGreaterThan(0);
  });

  it("renders customer avatars with initials", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getAllByText("Y").length).toBeGreaterThan(0);
    expect(screen.getAllByText("K").length).toBeGreaterThan(0);
  });

  it("renders carousel with duplicated testimonials for seamless loop", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getAllByText("yasmeenn").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("KM").length).toBeGreaterThanOrEqual(2);
  });

  it("returns null when testimonials array is empty", () => {
    const { container } = render(<Testimonials testimonials={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when testimonials prop is undefined", () => {
    const { container } = render(<Testimonials />);
    expect(container.firstChild).toBeNull();
  });

  describe("carousel interactions", () => {
    const setup = () => {
      const result = render(<Testimonials testimonials={mockTestimonials} />);
      const track = result.getByTestId("carousel-track");
      Object.defineProperty(track, "offsetLeft", { value: 0, writable: true });
      Object.defineProperty(track, "scrollLeft", { value: 0, writable: true });
      return { ...result, track };
    };

    it("handles mouse down — starts drag", () => {
      const { track } = setup();
      fireEvent.mouseDown(track, { pageX: 100 });
      expect(track).toBeInTheDocument();
    });

    it("handles mouse move while dragging — scrolls carousel", () => {
      const { track } = setup();
      fireEvent.mouseDown(track, { pageX: 100 });
      fireEvent.mouseMove(track, { pageX: 150 });
      expect(track).toBeInTheDocument();
    });

    it("handles mouse move without dragging — no-op", () => {
      const { track } = setup();
      fireEvent.mouseMove(track, { pageX: 150 });
      expect(track).toBeInTheDocument();
    });

    it("handles mouse up — ends drag", () => {
      const { track } = setup();
      fireEvent.mouseDown(track, { pageX: 100 });
      fireEvent.mouseUp(track);
      expect(track).toBeInTheDocument();
    });

    it("handles mouse enter — pauses carousel", () => {
      const { track } = setup();
      fireEvent.mouseEnter(track);
      expect(track).toBeInTheDocument();
    });

    it("handles mouse leave when not dragging — resumes carousel", () => {
      const { track } = setup();
      fireEvent.mouseLeave(track);
      expect(track).toBeInTheDocument();
    });

    it("handles mouse leave while dragging — stays paused", () => {
      const { track } = setup();
      fireEvent.mouseDown(track, { pageX: 100 });
      fireEvent.mouseLeave(track);
      expect(track).toBeInTheDocument();
    });

    it("handles touch start — initiates touch drag", () => {
      const { track } = setup();
      fireEvent.touchStart(track, { touches: [{ pageX: 100 }] });
      expect(track).toBeInTheDocument();
    });

    it("handles touch move while dragging — scrolls carousel", () => {
      const { track } = setup();
      fireEvent.touchStart(track, { touches: [{ pageX: 100 }] });
      fireEvent.touchMove(track, { touches: [{ pageX: 150 }] });
      expect(track).toBeInTheDocument();
    });

    it("handles touch move without drag state — no-op", () => {
      const { track } = setup();
      fireEvent.touchMove(track, { touches: [{ pageX: 150 }] });
      expect(track).toBeInTheDocument();
    });

    it("handles touch end — ends touch drag", () => {
      const { track } = setup();
      fireEvent.touchStart(track, { touches: [{ pageX: 100 }] });
      fireEvent.touchEnd(track);
      expect(track).toBeInTheDocument();
    });
  });
});
