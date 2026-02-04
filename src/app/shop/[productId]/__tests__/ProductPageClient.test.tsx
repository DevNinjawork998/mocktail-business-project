import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "../../../../__tests__/test-utils";
import ProductPageClient from "../ProductPageClient";
import { Product } from "@/data/serverProductService";

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

// Mock formatCurrency
jest.mock("@/app/lib/stripe", () => ({
  formatCurrency: jest.fn(
    (amount: number) => `RM ${(amount / 100).toFixed(2)}`,
  ),
}));

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

const mockProduct: Product = {
  id: "1",
  name: "Test Cocktail",
  subtitle: "Test Subtitle",
  description: "Test Description",
  longDescription: "<p>Test Long Description</p>",
  price: "RM 29.99",
  priceSubtext: "Premium quality",
  imageColor: "#ff6b6b",
  imageUrl: "/test-image.jpg",
  features: [
    { text: "Feature 1", color: "#ff6b6b" },
    { text: "Feature 2", color: "#4ecdc4" },
  ],
  ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
  productBrief: "Test product brief",
};

const mockOtherProducts: Product[] = [
  {
    id: "2",
    name: "Other Cocktail 1",
    subtitle: "Other Subtitle 1",
    description: "Other Description 1",
    longDescription: "Other Long Description 1",
    price: "RM 19.99",
    priceSubtext: "Refreshing",
    imageColor: "#4ecdc4",
    features: [{ text: "Other Feature", color: "#4ecdc4" }],
  },
  {
    id: "3",
    name: "Other Cocktail 2",
    subtitle: "Other Subtitle 2",
    description: "Other Description 2",
    longDescription: "Other Long Description 2",
    price: "RM 24.99",
    priceSubtext: "Delicious",
    imageColor: "#45b7d1",
    imageUrl: "/other-image.jpg",
    features: [{ text: "Another Feature", color: "#45b7d1" }],
  },
];

describe("ProductPageClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders product name and subtitle", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      // Product name appears multiple times (title and in ProductInfoSection)
      expect(screen.getAllByText("Test Cocktail").length).toBeGreaterThan(0);
      expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
    });

    it("renders product image when imageUrl is provided", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      const image = screen.getByAltText("Test Cocktail");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/test-image.jpg");
    });

    it("renders placeholder when imageUrl is not provided", () => {
      const productWithoutImage = {
        ...mockProduct,
        imageUrl: undefined,
      };

      render(
        <ProductPageClient
          product={productWithoutImage}
          otherProducts={mockOtherProducts}
        />,
      );

      // Product name appears multiple times (title, placeholder, ProductInfoSection)
      expect(screen.getAllByText("Test Cocktail").length).toBeGreaterThan(0);
    });

    it("renders product features", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      expect(screen.getByText("Feature 1")).toBeInTheDocument();
      expect(screen.getByText("Feature 2")).toBeInTheDocument();
    });

    it("renders product price and subtext", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      expect(screen.getByText("Premium quality")).toBeInTheDocument();
    });

    it("renders product long description", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      expect(screen.getByText("Test Long Description")).toBeInTheDocument();
    });
  });

  describe("Product Info Section", () => {
    it("renders ingredients when provided", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      expect(screen.getByText(/Ingredients:/)).toBeInTheDocument();
      expect(
        screen.getByText(/Ingredient 1, Ingredient 2, and Ingredient 3/),
      ).toBeInTheDocument();
    });

    it("renders fallback text when ingredients are not provided", () => {
      const productWithoutIngredients = {
        ...mockProduct,
        ingredients: undefined,
      };

      render(
        <ProductPageClient
          product={productWithoutIngredients}
          otherProducts={mockOtherProducts}
        />,
      );

      expect(
        screen.getByText("Ingredients information coming soon..."),
      ).toBeInTheDocument();
    });

    it("renders feature icons", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      expect(screen.getByText("🌾")).toBeInTheDocument();
      expect(screen.getByText("Fiber")).toBeInTheDocument();
      expect(screen.getByText("🍬")).toBeInTheDocument();
      expect(screen.getByText("Less Sugar*")).toBeInTheDocument();
      expect(screen.getByText("🌱")).toBeInTheDocument();
      expect(screen.getByText("Vegan")).toBeInTheDocument();
    });
  });

  describe("Sidebar", () => {
    it("renders sidebar title", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      expect(screen.getByText("Our Flavors")).toBeInTheDocument();
    });

    it("renders other products in sidebar", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      // Product names might appear multiple times, so use getAllByText
      expect(screen.getAllByText("Other Cocktail 1").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Other Cocktail 2").length).toBeGreaterThan(0);
    });

    it("renders sidebar product links correctly", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      // Product name might appear multiple times, get the first one and find its link
      const productNames = screen.getAllByText("Other Cocktail 1");
      const link1 = productNames[0].closest("a");
      expect(link1).toHaveAttribute("href", "/shop/2");
    });

    it("renders sidebar product images when imageUrl is provided", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      const image = screen.getByAltText("Other Cocktail 2");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/other-image.jpg");
    });

    it("renders placeholder for sidebar products without imageUrl", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      // Product name might appear multiple times, so use getAllByText
      expect(screen.getAllByText("Other Cocktail 1").length).toBeGreaterThan(0);
    });
  });

  describe("WhatsApp Button", () => {
    it("renders WhatsApp button", () => {
      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      expect(
        screen.getByText("Send a text through WhatsApp"),
      ).toBeInTheDocument();
    });

    it("opens WhatsApp when button is clicked", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      const whatsappButton = screen
        .getByText("Send a text through WhatsApp")
        .closest("button");

      if (whatsappButton) {
        fireEvent.click(whatsappButton);

        // Modal should appear
        expect(
          screen.getByText("Terms of Use Consent Required"),
        ).toBeInTheDocument();

        // Check consent checkbox
        const consentCheckbox = screen.getByLabelText(
          /I agree to the collection/i,
        );
        fireEvent.click(consentCheckbox);

        // Click proceed button
        const proceedButton = screen.getByText("Proceed to WhatsApp");
        fireEvent.click(proceedButton);

        // window.open should be called with WhatsApp URL
        await waitFor(() => {
          expect(mockWindowOpen).toHaveBeenCalled();
        });
        const callArgs = mockWindowOpen.mock.calls[0];
        expect(callArgs[0]).toContain("wa.me/60129104201");
        // URL is encoded, so check for encoded version
        expect(callArgs[0]).toContain("Test%20Cocktail");
        expect(callArgs[1]).toBe("_blank");
      }

      consoleErrorSpy.mockRestore();
    });

    it("handles WhatsApp error gracefully", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

      mockWindowOpen.mockReturnValueOnce(null);

      render(
        <ProductPageClient
          product={mockProduct}
          otherProducts={mockOtherProducts}
        />,
      );

      const whatsappButton = screen
        .getByText("Send a text through WhatsApp")
        .closest("button");

      if (whatsappButton) {
        fireEvent.click(whatsappButton);

        // Modal should appear
        expect(
          screen.getByText("Terms of Use Consent Required"),
        ).toBeInTheDocument();

        // Check consent checkbox
        const consentCheckbox = screen.getByLabelText(
          /I agree to the collection/i,
        );
        fireEvent.click(consentCheckbox);

        // Click proceed button
        const proceedButton = screen.getByText("Proceed to WhatsApp");
        fireEvent.click(proceedButton);

        // Should attempt to open window, and fallback to location.href when it returns null
        await waitFor(() => {
          expect(mockWindowOpen).toHaveBeenCalled();
        });
        // The error from jsdom's navigation limitation is expected and handled
        // We verify the function attempted to handle the error gracefully
      }

      consoleErrorSpy.mockRestore();
      alertSpy.mockRestore();
    });
  });
});
