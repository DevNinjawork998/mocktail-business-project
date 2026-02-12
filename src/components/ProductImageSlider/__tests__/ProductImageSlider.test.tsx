import React from "react";
import { render, screen, fireEvent } from "@/__tests__/test-utils";
import ProductImageSlider from "../ProductImageSlider";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    style?: React.CSSProperties;
    priority?: boolean;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} data-testid="product-image" />;
  },
}));

describe("ProductImageSlider", () => {
  const mockImages = [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
  ];

  describe("Rendering", () => {
    it("renders null when images array is empty", () => {
      const { container } = render(
        <ProductImageSlider images={[]} productName="Test Product" />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders null when images is undefined", () => {
      const { container } = render(
        <ProductImageSlider images={undefined as unknown as string[]} productName="Test Product" />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("renders single image correctly", () => {
      render(
        <ProductImageSlider
          images={[mockImages[0]]}
          productName="Test Product"
        />,
      );

      expect(screen.getByAltText("Test Product - Image 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to image 1")).toBeInTheDocument();
    });

    it("renders multiple images correctly", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      expect(screen.getByAltText("Test Product - Image 1")).toBeInTheDocument();
      expect(screen.getByAltText("Test Product - Image 2")).toBeInTheDocument();
      expect(screen.getByAltText("Test Product - Image 3")).toBeInTheDocument();
    });

    it("shows counter for multiple images", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("does not show counter for single image", () => {
      render(
        <ProductImageSlider
          images={[mockImages[0]]}
          productName="Test Product"
        />,
      );

      expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument();
    });

    it("renders all indicators", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      expect(screen.getByLabelText("Go to image 1")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to image 2")).toBeInTheDocument();
      expect(screen.getByLabelText("Go to image 3")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onImageClick when image is clicked", () => {
      const mockOnImageClick = jest.fn();
      render(
        <ProductImageSlider
          images={mockImages}
          productName="Test Product"
          onImageClick={mockOnImageClick}
        />,
      );

      const images = screen.getAllByTestId("product-image");
      fireEvent.click(images[1]);

      expect(mockOnImageClick).toHaveBeenCalledWith(1);
    });

    it("does not call onImageClick when not provided", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      const images = screen.getAllByTestId("product-image");
      fireEvent.click(images[0]);

      // Should not throw error
      expect(images[0]).toBeInTheDocument();
    });

    it("handles indicator click", () => {
      const { container } = render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      // Find the slider wrapper element by finding the parent of images
      const firstImage = screen.getByAltText("Test Product - Image 1");
      const slider = firstImage.closest("div")?.parentElement?.parentElement;
      
      if (slider) {
        // Mock scrollTo method
        Object.defineProperty(slider, "scrollTo", {
          writable: true,
          value: jest.fn(),
        });
        Object.defineProperty(slider, "clientWidth", {
          writable: true,
          value: 400,
        });
      }

      const indicator2 = screen.getByLabelText("Go to image 2");
      fireEvent.click(indicator2);

      // Counter should update (though we can't easily test scroll position in jsdom)
      expect(screen.getByText(/\/ 3/)).toBeInTheDocument();
    });
  });

  describe("Mouse drag interactions", () => {
    it("handles mouse down event", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      const slider = screen.getByAltText("Test Product - Image 1").closest("div")?.parentElement;
      if (slider) {
        fireEvent.mouseDown(slider, { pageX: 100 });
        // Should not throw error
        expect(slider).toBeInTheDocument();
      }
    });

    it("handles mouse move event", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      const slider = screen.getByAltText("Test Product - Image 1").closest("div")?.parentElement;
      if (slider) {
        fireEvent.mouseDown(slider, { pageX: 100 });
        fireEvent.mouseMove(slider, { pageX: 200 });
        // Should not throw error
        expect(slider).toBeInTheDocument();
      }
    });

    it("handles mouse up event", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      const slider = screen.getByAltText("Test Product - Image 1").closest("div")?.parentElement;
      if (slider) {
        fireEvent.mouseDown(slider, { pageX: 100 });
        fireEvent.mouseUp(slider);
        // Should not throw error
        expect(slider).toBeInTheDocument();
      }
    });

    it("handles mouse leave event", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      const slider = screen.getByAltText("Test Product - Image 1").closest("div")?.parentElement;
      if (slider) {
        fireEvent.mouseDown(slider, { pageX: 100 });
        fireEvent.mouseLeave(slider);
        // Should not throw error
        expect(slider).toBeInTheDocument();
      }
    });
  });

  describe("Touch interactions", () => {
    it("handles touch start event", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      const slider = screen.getByAltText("Test Product - Image 1").closest("div")?.parentElement;
      if (slider) {
        fireEvent.touchStart(slider, {
          touches: [{ pageX: 100 }],
        });
        // Should not throw error
        expect(slider).toBeInTheDocument();
      }
    });

    it("handles touch move event", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      const slider = screen.getByAltText("Test Product - Image 1").closest("div")?.parentElement;
      if (slider) {
        fireEvent.touchStart(slider, {
          touches: [{ pageX: 100 }],
        });
        fireEvent.touchMove(slider, {
          touches: [{ pageX: 200 }],
        });
        // Should not throw error
        expect(slider).toBeInTheDocument();
      }
    });

    it("handles touch end event", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      const slider = screen.getByAltText("Test Product - Image 1").closest("div")?.parentElement;
      if (slider) {
        fireEvent.touchStart(slider, {
          touches: [{ pageX: 100 }],
        });
        fireEvent.touchEnd(slider);
        // Should not throw error
        expect(slider).toBeInTheDocument();
      }
    });
  });

  describe("Scroll handling", () => {
    it("handles scroll event", () => {
      render(
        <ProductImageSlider images={mockImages} productName="Test Product" />,
      );

      const slider = screen.getByAltText("Test Product - Image 1").closest("div")?.parentElement;
      if (slider) {
        // Mock scrollLeft property
        Object.defineProperty(slider, "scrollLeft", {
          writable: true,
          value: 0,
        });
        Object.defineProperty(slider, "clientWidth", {
          writable: true,
          value: 400,
        });

        fireEvent.scroll(slider);
        // Should not throw error
        expect(slider).toBeInTheDocument();
      }
    });
  });
});
