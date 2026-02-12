import React from "react";
import { render, screen, waitFor } from "../../../__tests__/test-utils";
import ProductShowcase from "../ProductShowcase";
import { getAllProducts } from "@/data/productService";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

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
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

// Mock productService
jest.mock("@/data/productService", () => ({
  getAllProducts: jest.fn(),
}));

const mockProducts = [
  {
    id: "1",
    name: "Test Cocktail 1",
    subtitle: "Test Subtitle 1",
    description: "Test Description 1",
    longDescription: "Test Long Description 1",
    price: "RM 29.99",
    priceSubtext: "Premium quality",
    imageColor: "#ff6b6b",
    imageUrl: "/test-image-1.jpg",
    features: [{ text: "Feature 1", color: "#ff6b6b" }],
  },
  {
    id: "2",
    name: "Test Cocktail 2",
    subtitle: "Test Subtitle 2",
    description: "Test Description 2",
    longDescription: "Test Long Description 2",
    price: "RM 19.99",
    priceSubtext: "Refreshing blend",
    imageColor: "#4ecdc4",
    imageUrl: undefined,
    features: [{ text: "Feature 2", color: "#4ecdc4" }],
  },
  {
    id: "3",
    name: "Test Cocktail 3",
    subtitle: "Test Subtitle 3",
    description: "Test Description 3",
    longDescription: "Test Long Description 3",
    price: "RM 24.99",
    priceSubtext: "Delicious taste",
    imageColor: "#45b7d1",
    imageUrl: "/test-image-3.jpg",
    features: [{ text: "Feature 3", color: "#45b7d1" }],
  },
  {
    id: "4",
    name: "Test Cocktail 4",
    subtitle: "Test Subtitle 4",
    description: "Test Description 4",
    longDescription: "Test Long Description 4",
    price: "RM 34.99",
    priceSubtext: "Premium blend",
    imageColor: "#96ceb4",
    imageUrl: "/test-image-4.jpg",
    features: [{ text: "Feature 4", color: "#96ceb4" }],
  },
  {
    id: "5",
    name: "Test Cocktail 5",
    subtitle: "Test Subtitle 5",
    description: "Test Description 5",
    longDescription: "Test Long Description 5",
    price: "RM 39.99",
    priceSubtext: "Extra premium",
    imageColor: "#feca57",
    imageUrl: "/test-image-5.jpg",
    features: [{ text: "Feature 5", color: "#feca57" }],
  },
];

describe("ProductShowcase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading State", () => {
    it("displays loading message while fetching products", () => {
      (getAllProducts as jest.Mock).mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves to keep loading state
          }),
      );

      render(<ProductShowcase />);

      expect(screen.getByText("Loading products...")).toBeInTheDocument();
      expect(screen.getByText("Our Signature Collection")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Each flavor is thoughtfully crafted with premium ingredients and functional adaptogens.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Rendering", () => {
    it("renders section header correctly", async () => {
      (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      render(<ProductShowcase />);

      await waitFor(() => {
        expect(
          screen.getByText("Our Signature Collection"),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            "Each flavor is thoughtfully crafted with premium ingredients and functional adaptogens.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("displays first 4 products only", async () => {
      (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      render(<ProductShowcase />);

      await waitFor(() => {
        // Product names appear multiple times (in placeholder and product name), so use getAllByText
        expect(screen.getAllByText("Test Cocktail 1").length).toBeGreaterThan(
          0,
        );
        expect(screen.getAllByText("Test Cocktail 2").length).toBeGreaterThan(
          0,
        );
        expect(screen.getAllByText("Test Cocktail 3").length).toBeGreaterThan(
          0,
        );
        expect(screen.getAllByText("Test Cocktail 4").length).toBeGreaterThan(
          0,
        );
        expect(screen.queryByText("Test Cocktail 5")).not.toBeInTheDocument();
      });
    });

    it("renders product cards with correct information", async () => {
      (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      render(<ProductShowcase />);

      await waitFor(() => {
        // Product names appear multiple times, so use getAllByText
        expect(screen.getAllByText("Test Cocktail 1").length).toBeGreaterThan(
          0,
        );
        expect(screen.getByText("Test Subtitle 1")).toBeInTheDocument();
        // Add to Cart buttons appear multiple times (one per product)
        expect(screen.getAllByText("Add to Cart").length).toBeGreaterThan(0);
      });
    });

    it("renders product image when imageUrl is provided", async () => {
      (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      render(<ProductShowcase />);

      await waitFor(() => {
        const image1 = screen.getByAltText("Test Cocktail 1");
        expect(image1).toBeInTheDocument();
        expect(image1).toHaveAttribute("src", "/test-image-1.jpg");
      });
    });

    it("renders placeholder when imageUrl is not provided", async () => {
      (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      render(<ProductShowcase />);

      await waitFor(() => {
        // Product name appears multiple times (in placeholder and product name), so use getAllByText
        expect(screen.getAllByText("Test Cocktail 2").length).toBeGreaterThan(
          0,
        );
      });
    });

    it("renders product links correctly", async () => {
      (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      render(<ProductShowcase />);

      await waitFor(() => {
        // Product name appears multiple times, get the first one and find its link
        const productNames = screen.getAllByText("Test Cocktail 1");
        const link1 = productNames[0].closest("a");
        expect(link1).toHaveAttribute("href", "/shop/1");
      });
    });
  });

  describe("Error Handling", () => {
    it("handles error when fetching products fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (getAllProducts as jest.Mock).mockRejectedValue(
        new Error("Failed to fetch"),
      );

      render(<ProductShowcase />);

      await waitFor(() => {
        expect(getAllProducts).toHaveBeenCalled();
      });

      // Component should still render (empty state)
      await waitFor(() => {
        expect(
          screen.getByText("Our Signature Collection"),
        ).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Product Card Interactions", () => {
    it("prevents default navigation on add to cart button click", async () => {
      (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      render(<ProductShowcase />);

      await waitFor(() => {
        const addToCartButtons = screen.getAllByText("Add to Cart");
        expect(addToCartButtons.length).toBeGreaterThan(0);
      });

      const addToCartButton = screen.getAllByText("Add to Cart")[0];
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = jest.spyOn(clickEvent, "preventDefault");

      addToCartButton.dispatchEvent(clickEvent);

      // The onClick handler should prevent default
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Section Title Linking", () => {
    it("uses section title as subtitle when h3 tag exists", async () => {
      const productsWithSectionTitle = [
        {
          ...mockProducts[0],
          longDescription:
            "<h3>Premium Quality</h3><p>This is a premium product.</p>",
          subtitle: "Experience Premium Quality",
        },
      ];

      (getAllProducts as jest.Mock).mockResolvedValue(productsWithSectionTitle);

      render(<ProductShowcase />);

      await waitFor(() => {
        // Check that "Premium Quality" (from section title) is rendered as clickable span (role="link")
        const subtitleLink = screen.getByRole("link", {
          name: "Premium Quality",
        });
        expect(subtitleLink).toBeInTheDocument();
        expect(subtitleLink.tagName).toBe("SPAN");
        // Original subtitle should not be displayed
        expect(
          screen.queryByText("Experience Premium Quality"),
        ).not.toBeInTheDocument();
      });
    });

    it("uses section title even when it doesn't match original subtitle", async () => {
      const productsWithMismatch = [
        {
          ...mockProducts[0],
          longDescription: "<h3>Different Title</h3><p>Content</p>",
          subtitle: "This subtitle doesn't match",
        },
      ];

      (getAllProducts as jest.Mock).mockResolvedValue(productsWithMismatch);

      render(<ProductShowcase />);

      await waitFor(() => {
        // Should use section title "Different Title" as subtitle
        const subtitleLink = screen.getByRole("link", {
          name: "Different Title",
        });
        expect(subtitleLink).toBeInTheDocument();
        expect(subtitleLink.tagName).toBe("SPAN");
        // Original subtitle should not be displayed
        expect(
          screen.queryByText("This subtitle doesn't match"),
        ).not.toBeInTheDocument();
      });
    });

    it("handles longDescription without h3 tag", async () => {
      const productsWithoutH3 = [
        {
          ...mockProducts[0],
          longDescription: "<p>No section title here</p>",
          subtitle: "Regular Subtitle",
        },
      ];

      (getAllProducts as jest.Mock).mockResolvedValue(productsWithoutH3);

      render(<ProductShowcase />);

      await waitFor(() => {
        const subtitle = screen.getByText("Regular Subtitle");
        expect(subtitle).toBeInTheDocument();
      });

      // Should render subtitle as plain text, not as a link (no section title when no h3)
      expect(screen.getByText("Regular Subtitle")).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Regular Subtitle" }),
      ).not.toBeInTheDocument();
    });

    it("uses section title exactly as extracted from h3 tag", async () => {
      const productsWithSectionTitle = [
        {
          ...mockProducts[0],
          longDescription: "<h3>Premium Quality</h3><p>Content</p>",
          subtitle: "Experience premium quality today",
        },
      ];

      (getAllProducts as jest.Mock).mockResolvedValue(productsWithSectionTitle);

      render(<ProductShowcase />);

      await waitFor(() => {
        // Should use section title "Premium Quality" (from h3) as subtitle
        const subtitleLink = screen.getByRole("link", {
          name: "Premium Quality",
        });
        expect(subtitleLink).toBeInTheDocument();
        expect(subtitleLink.tagName).toBe("SPAN");
      });
    });

    it("handles section title with special regex characters", async () => {
      const productsWithSpecialChars = [
        {
          ...mockProducts[0],
          longDescription: "<h3>Product (Premium)</h3><p>Content</p>",
          subtitle: "Try our Product (Premium) today",
        },
      ];

      (getAllProducts as jest.Mock).mockResolvedValue(productsWithSpecialChars);

      render(<ProductShowcase />);

      await waitFor(() => {
        // Should use section title "Product (Premium)" (from h3) as subtitle
        const subtitleLink = screen.getByRole("link", {
          name: "Product (Premium)",
        });
        expect(subtitleLink).toBeInTheDocument();
        expect(subtitleLink.tagName).toBe("SPAN");
      });
    });

    it("handles empty longDescription", async () => {
      const productsWithEmptyDesc = [
        {
          ...mockProducts[0],
          longDescription: "",
          subtitle: "Regular Subtitle",
        },
      ];

      (getAllProducts as jest.Mock).mockResolvedValue(productsWithEmptyDesc);

      render(<ProductShowcase />);

      await waitFor(() => {
        const subtitle = screen.getByText("Regular Subtitle");
        expect(subtitle).toBeInTheDocument();
      });
    });

    it("handles longDescription with HTML entities in section title", async () => {
      const productsWithEntities = [
        {
          ...mockProducts[0],
          longDescription: "<h3>Premium&nbsp;Quality</h3><p>Content</p>",
          subtitle: "Experience Premium Quality",
        },
      ];

      (getAllProducts as jest.Mock).mockResolvedValue(productsWithEntities);

      render(<ProductShowcase />);

      await waitFor(() => {
        // HTML entities should be decoded (&nbsp; becomes space)
        const subtitleLink = screen.getByRole("link", {
          name: "Premium Quality",
        });
        expect(subtitleLink).toBeInTheDocument();
        expect(subtitleLink.tagName).toBe("SPAN");
      });
    });
  });
});
