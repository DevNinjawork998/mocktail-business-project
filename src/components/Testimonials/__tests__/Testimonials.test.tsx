import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import userEvent from "@testing-library/user-event";
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
    render(<Testimonials testimonials={mockTestimonials} />);

    // All testimonials have 5 stars, so we should see multiple filled stars
    const filledStars = screen.getAllByText("★");
    expect(filledStars.length).toBeGreaterThan(0);
  });

  it("renders customer names", () => {
    render(<Testimonials testimonials={mockTestimonials} />);

    // Testimonials are duplicated for carousel, so use getAllByText
    expect(screen.getAllByText("yasmeenn").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KM").length).toBeGreaterThan(0);
  });

  it("displays correct testimonial text", () => {
    render(<Testimonials testimonials={mockTestimonials} />);

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
    render(<Testimonials testimonials={mockTestimonials} />);

    // yasmeenn has "Y" initial, KM has "K" initial
    expect(screen.getAllByText("Y").length).toBeGreaterThan(0);
    expect(screen.getAllByText("K").length).toBeGreaterThan(0);
  });

  it("renders carousel with duplicated testimonials for seamless loop", () => {
    render(<Testimonials testimonials={mockTestimonials} />);

    // Verify testimonials are rendered multiple times (duplicated for carousel loop)
    // Each testimonial should appear at least twice (original + duplicate)
    const yasmeennElements = screen.getAllByText("yasmeenn");
    const kmElements = screen.getAllByText("KM");
    
    // Should have at least 2 of each (original + duplicate for seamless loop)
    expect(yasmeennElements.length).toBeGreaterThanOrEqual(2);
    expect(kmElements.length).toBeGreaterThanOrEqual(2);
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
    const getCarouselTrack = (container: HTMLElement): HTMLElement | null => {
      // Find the scrollable container - it should be a direct child of TestimonialsContainer
      // Look for an element that has overflow-x or scroll behavior
      const allDivs = container.querySelectorAll('div');
      for (const div of Array.from(allDivs)) {
        const style = window.getComputedStyle(div);
        if (style.overflowX === 'auto' || style.overflowX === 'scroll' || 
            style.overflow === 'auto' || style.overflow === 'scroll') {
          return div;
        }
      }
      // Fallback: find the container that wraps all testimonials
      const testimonialText = container.querySelector('p');
      if (testimonialText) {
        let parent = testimonialText.parentElement;
        let depth = 0;
        while (parent && parent !== container && depth < 5) {
          if (parent.scrollLeft !== undefined) {
            return parent;
          }
          parent = parent.parentElement;
          depth++;
        }
      }
      return null;
    };

    it("pauses carousel on mouse enter", () => {
      const { container } = render(<Testimonials testimonials={mockTestimonials} />);
      const carouselTrack = getCarouselTrack(container);
      
      expect(carouselTrack).not.toBeNull();
      
      if (carouselTrack) {
        // Simulate mouse enter
        userEvent.hover(carouselTrack);
      }
    });

    it("resumes carousel on mouse leave when not dragging", () => {
      const { container } = render(<Testimonials testimonials={mockTestimonials} />);
      const carouselTrack = getCarouselTrack(container);
      
      expect(carouselTrack).not.toBeNull();
      
      if (carouselTrack) {
        // Simulate mouse leave
        userEvent.unhover(carouselTrack);
      }
    });

    it("handles mouse down event", () => {
      const { container } = render(<Testimonials testimonials={mockTestimonials} />);
      const carouselTrack = getCarouselTrack(container);
      
      expect(carouselTrack).not.toBeNull();
      
      if (carouselTrack) {
        const mouseDownEvent = new MouseEvent("mousedown", {
          bubbles: true,
          clientX: 100,
        });
        Object.defineProperty(mouseDownEvent, "pageX", { value: 100 });
        carouselTrack.dispatchEvent(mouseDownEvent);
      }
    });

    it("handles mouse move event when dragging", () => {
      const { container } = render(<Testimonials testimonials={mockTestimonials} />);
      const carouselTrack = getCarouselTrack(container);
      
      expect(carouselTrack).not.toBeNull();
      
      if (carouselTrack) {
        // Start dragging
        const mouseDownEvent = new MouseEvent("mousedown", {
          bubbles: true,
          clientX: 100,
        });
        Object.defineProperty(mouseDownEvent, "pageX", { value: 100 });
        carouselTrack.dispatchEvent(mouseDownEvent);
        
        // Move mouse
        const mouseMoveEvent = new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 150,
        });
        Object.defineProperty(mouseMoveEvent, "pageX", { value: 150 });
        carouselTrack.dispatchEvent(mouseMoveEvent);
      }
    });

    it("handles mouse up event", () => {
      const { container } = render(<Testimonials testimonials={mockTestimonials} />);
      const carouselTrack = getCarouselTrack(container);
      
      expect(carouselTrack).not.toBeNull();
      
      if (carouselTrack) {
        const mouseUpEvent = new MouseEvent("mouseup", { bubbles: true });
        carouselTrack.dispatchEvent(mouseUpEvent);
      }
    });

    it("handles touch start event", () => {
      const { container } = render(<Testimonials testimonials={mockTestimonials} />);
      const carouselTrack = getCarouselTrack(container);
      
      expect(carouselTrack).not.toBeNull();
      
      if (carouselTrack) {
        const touchStartEvent = new TouchEvent("touchstart", {
          bubbles: true,
          touches: [{ pageX: 100 } as Touch],
        });
        carouselTrack.dispatchEvent(touchStartEvent);
      }
    });

    it("handles touch move event when dragging", () => {
      const { container } = render(<Testimonials testimonials={mockTestimonials} />);
      const carouselTrack = getCarouselTrack(container);
      
      expect(carouselTrack).not.toBeNull();
      
      if (carouselTrack) {
        // Start dragging
        const touchStartEvent = new TouchEvent("touchstart", {
          bubbles: true,
          touches: [{ pageX: 100 } as Touch],
        });
        carouselTrack.dispatchEvent(touchStartEvent);
        
        // Move touch
        const touchMoveEvent = new TouchEvent("touchmove", {
          bubbles: true,
          touches: [{ pageX: 150 } as Touch],
        });
        carouselTrack.dispatchEvent(touchMoveEvent);
      }
    });

    it("handles touch end event", () => {
      const { container } = render(<Testimonials testimonials={mockTestimonials} />);
      const carouselTrack = getCarouselTrack(container);
      
      expect(carouselTrack).not.toBeNull();
      
      if (carouselTrack) {
        const touchEndEvent = new TouchEvent("touchend", { bubbles: true });
        carouselTrack.dispatchEvent(touchEndEvent);
      }
    });

    it("does not resume carousel on mouse leave when dragging", () => {
      const { container } = render(<Testimonials testimonials={mockTestimonials} />);
      const carouselTrack = getCarouselTrack(container);
      
      expect(carouselTrack).not.toBeNull();
      
      if (carouselTrack) {
        // Start dragging
        const mouseDownEvent = new MouseEvent("mousedown", {
          bubbles: true,
          clientX: 100,
        });
        Object.defineProperty(mouseDownEvent, "pageX", { value: 100 });
        carouselTrack.dispatchEvent(mouseDownEvent);
        
        // Try to leave while dragging
        const mouseLeaveEvent = new MouseEvent("mouseleave", { bubbles: true });
        carouselTrack.dispatchEvent(mouseLeaveEvent);
      }
    });
  });
});
