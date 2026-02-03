import React from "react";
import { render, screen, fireEvent, waitFor } from "../../../__tests__/test-utils";
import ProductForm from "../ProductForm";
import "@jest/globals";

// Mock next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    back: mockBack,
  }),
}));

// Mock product actions
const mockCreateProduct = jest.fn();
const mockUpdateProduct = jest.fn();

jest.mock("@/app/actions/products", () => ({
  createProduct: (...args: unknown[]) => mockCreateProduct(...args),
  updateProduct: (...args: unknown[]) => mockUpdateProduct(...args),
}));

// Mock ImageUpload component
jest.mock("@/components/ImageUpload", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    label,
  }: {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
  }) => (
    <div data-testid="image-upload">
      <span>{label}</span>
      <input
        data-testid="image-url-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

// Mock product data
const mockProduct = {
  id: "test-product-id",
  name: "Test Product",
  subtitle: "Test Subtitle",
  description: "Test Description",
  longDescription: "<h3>Test Title</h3><p>Test paragraph content.</p>",
  price: "$35.99",
  priceSubtext: "12 cans delivered",
  imageColor: "#451515",
  imageUrl: "https://example.com/image.jpg",
  features: [{ text: "Feature 1", color: "#FF0000" }],
  ingredients: ["Ingredient 1", "Ingredient 2"],
  productBrief: "Test brief",
};

// Helper to get form inputs by name attribute
const getInputByName = (name: string) => {
  return document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
};

const getTextAreaByName = (name: string) => {
  return document.querySelector(`textarea[name="${name}"]`) as HTMLTextAreaElement;
};

describe("ProductForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockBack.mockClear();
    mockCreateProduct.mockClear();
    mockUpdateProduct.mockClear();
  });

  describe("Form Rendering", () => {
    it("renders all form sections", () => {
      render(<ProductForm />);

      expect(screen.getByText("Basic Information")).toBeInTheDocument();
      expect(screen.getByText("Long Description")).toBeInTheDocument();
      expect(screen.getByText("Pricing")).toBeInTheDocument();
      expect(screen.getByText("Image")).toBeInTheDocument();
      expect(screen.getByText("Features")).toBeInTheDocument();
      expect(screen.getByText("Additional Information")).toBeInTheDocument();
    });

    it("renders required field labels", () => {
      render(<ProductForm />);

      expect(screen.getByText("Name *")).toBeInTheDocument();
      expect(screen.getByText("Subtitle *")).toBeInTheDocument();
      expect(screen.getByText("Description *")).toBeInTheDocument();
      expect(screen.getByText("Price *")).toBeInTheDocument();
      expect(screen.getByText("Price Subtext *")).toBeInTheDocument();
      expect(screen.getByText("Image Color *")).toBeInTheDocument();
      expect(screen.getByText("Paragraphs *")).toBeInTheDocument();
    });

    it("shows empty form for new product", () => {
      render(<ProductForm />);

      const nameInput = getInputByName("name");
      expect(nameInput).toBeTruthy();
      expect(nameInput.value).toBe("");

      expect(screen.getByText("Create Product")).toBeInTheDocument();
    });

    it("pre-fills fields when editing existing product", () => {
      render(<ProductForm product={mockProduct} />);

      expect(screen.getByDisplayValue("Test Product")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Subtitle")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
      expect(screen.getByDisplayValue("$35.99")).toBeInTheDocument();
      expect(screen.getByText("Update Product")).toBeInTheDocument();
    });

    it("renders section titles correctly", () => {
      render(<ProductForm />);

      expect(screen.getByText("Basic Information")).toBeInTheDocument();
      expect(screen.getByText("Long Description")).toBeInTheDocument();
      expect(screen.getByText("Pricing")).toBeInTheDocument();
      expect(screen.getByText("Image")).toBeInTheDocument();
      expect(screen.getByText("Features")).toBeInTheDocument();
    });
  });

  describe("Long Description Fields", () => {
    it("parses existing HTML into section title when editing", () => {
      render(<ProductForm product={mockProduct} />);

      // Section title should be parsed from HTML
      expect(screen.getByDisplayValue("Test Title")).toBeInTheDocument();
    });

    it("shows help text for section title", () => {
      render(<ProductForm />);

      expect(
        screen.getByText(/Optional: A heading that will appear above the description paragraphs/i)
      ).toBeInTheDocument();
    });

    it("has add paragraph button", () => {
      render(<ProductForm />);

      expect(screen.getByText("+ Add Paragraph")).toBeInTheDocument();
    });

    it("shows section title input with placeholder", () => {
      render(<ProductForm />);

      const sectionTitleInput = getInputByName("longDescriptionSectionTitle");
      expect(sectionTitleInput).toBeTruthy();
      expect(sectionTitleInput.placeholder).toBe("e.g., Stamina & Libido Boost");
    });
  });

  describe("Form Submission - Update", () => {
    it("calls updateProduct for existing product", async () => {
      mockUpdateProduct.mockResolvedValue({ success: true });

      render(<ProductForm product={mockProduct} />);

      // Modify a field
      const nameInput = getInputByName("name");
      fireEvent.change(nameInput, { target: { value: "Updated Product" } });

      // Submit
      const submitButton = screen.getByText("Update Product");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateProduct).toHaveBeenCalledWith(
          "test-product-id",
          expect.any(Object)
        );
      });
    });

    it("redirects on successful update", async () => {
      mockUpdateProduct.mockResolvedValue({ success: true });

      render(<ProductForm product={mockProduct} />);

      const submitButton = screen.getByText("Update Product");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard/products");
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("handles update errors", async () => {
      mockUpdateProduct.mockResolvedValue({ success: false, error: "Failed to update" });

      render(<ProductForm product={mockProduct} />);

      const submitButton = screen.getByText("Update Product");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Failed to update")).toBeInTheDocument();
      });
    });

    it("shows saving state during submission", async () => {
      mockUpdateProduct.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000))
      );

      render(<ProductForm product={mockProduct} />);

      const submitButton = screen.getByText("Update Product");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Saving...")).toBeInTheDocument();
      });
    });
  });

  describe("Field Array Management", () => {
    it("adds new feature field", () => {
      render(<ProductForm />);

      const addFeatureButton = screen.getByText("+ Add Feature");
      const initialFeatures = screen.getAllByPlaceholderText("Feature text");

      fireEvent.click(addFeatureButton);

      const updatedFeatures = screen.getAllByPlaceholderText("Feature text");
      expect(updatedFeatures.length).toBe(initialFeatures.length + 1);
    });

    it("removes feature field", () => {
      render(<ProductForm />);

      // Get initial count of feature fields
      const initialFeatureFields = screen.getAllByPlaceholderText("Feature text");
      const initialCount = initialFeatureFields.length;

      // Add a feature
      const addFeatureButton = screen.getByText("+ Add Feature");
      fireEvent.click(addFeatureButton);

      // Should have one more feature field now
      const afterAddFields = screen.getAllByPlaceholderText("Feature text");
      expect(afterAddFields.length).toBe(initialCount + 1);

      // Remove the last added feature
      const removeButtons = screen.getAllByText("×");
      const lastRemoveButton = removeButtons[removeButtons.length - 1];
      
      fireEvent.click(lastRemoveButton);
      
      // Should be back to initial count
      const afterRemoveFields = screen.getAllByPlaceholderText("Feature text");
      expect(afterRemoveFields.length).toBe(initialCount);
    });
  });

  describe("Cancel Button", () => {
    it("calls router.back when cancel is clicked", () => {
      render(<ProductForm />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe("Image Upload Integration", () => {
    it("renders ImageUpload component", () => {
      render(<ProductForm />);

      expect(screen.getByTestId("image-upload")).toBeInTheDocument();
      expect(screen.getByText("Product Image")).toBeInTheDocument();
    });

    it("displays existing image URL when editing", () => {
      render(<ProductForm product={mockProduct} />);

      const imageInput = screen.getByTestId("image-url-input");
      expect(imageInput).toHaveValue("https://example.com/image.jpg");
    });
  });

  describe("Edge Cases", () => {
    it("handles product with empty longDescription", () => {
      const productWithEmptyDescription = {
        ...mockProduct,
        longDescription: "",
      };

      render(<ProductForm product={productWithEmptyDescription} />);

      // Should still render without crashing
      expect(screen.getByText("Long Description")).toBeInTheDocument();
    });

    it("handles product with null optional fields", () => {
      const productWithNulls = {
        ...mockProduct,
        ingredients: null,
        productBrief: null,
        imageUrl: null,
      };

      render(<ProductForm product={productWithNulls} />);

      // Should render without crashing
      expect(screen.getByText("Basic Information")).toBeInTheDocument();
    });

    it("handles product with complex HTML in longDescription", () => {
      const productWithComplexHtml = {
        ...mockProduct,
        longDescription: `
          <h3>Section Title</h3>
          <p>First paragraph with <strong>bold</strong> text.</p>
          <p>Second paragraph with more content.</p>
        `,
      };

      render(<ProductForm product={productWithComplexHtml} />);

      expect(screen.getByDisplayValue("Section Title")).toBeInTheDocument();
    });

    it("renders with product that has existing features", () => {
      render(<ProductForm product={mockProduct} />);

      expect(screen.getByDisplayValue("Feature 1")).toBeInTheDocument();
    });
  });

  describe("Basic Input Fields", () => {
    it("allows editing name field", () => {
      render(<ProductForm />);

      const nameInput = getInputByName("name");
      fireEvent.change(nameInput, { target: { value: "New Name" } });

      expect(nameInput.value).toBe("New Name");
    });

    it("allows editing subtitle field", () => {
      render(<ProductForm />);

      const subtitleInput = getInputByName("subtitle");
      fireEvent.change(subtitleInput, { target: { value: "New Subtitle" } });

      expect(subtitleInput.value).toBe("New Subtitle");
    });

    it("allows editing description field", () => {
      render(<ProductForm />);

      const descriptionTextarea = getTextAreaByName("description");
      fireEvent.change(descriptionTextarea, { target: { value: "New Description" } });

      expect(descriptionTextarea.value).toBe("New Description");
    });

    it("allows editing price field", () => {
      render(<ProductForm />);

      const priceInput = getInputByName("price");
      fireEvent.change(priceInput, { target: { value: "$49.99" } });

      expect(priceInput.value).toBe("$49.99");
    });
  });
});
