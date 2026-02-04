import React from "react";
import { render, screen, fireEvent, waitFor } from "@/__tests__/test-utils";
import IngredientForm from "../IngredientForm";
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

// Mock ingredient actions
const mockCreateIngredient = jest.fn();
const mockUpdateIngredient = jest.fn();

jest.mock("@/app/actions/ingredients", () => ({
  createIngredient: (...args: unknown[]) => mockCreateIngredient(...args),
  updateIngredient: (...args: unknown[]) => mockUpdateIngredient(...args),
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

// Mock ingredient data
const mockIngredient = {
  id: "test-ingredient-id",
  name: "Test Ingredient",
  icon: "🌿",
  imageUrl: "https://example.com/image.jpg",
  subtitle: "Test Subtitle",
  description: "Test Description",
  type: "Adaptogen",
  order: 1,
};

// Helper to get form inputs by name attribute
const getInputByName = (name: string) => {
  return document.querySelector(
    `input[name="${name}"], select[name="${name}"]`,
  ) as HTMLInputElement | HTMLSelectElement;
};

const getTextAreaByName = (name: string) => {
  return document.querySelector(
    `textarea[name="${name}"]`,
  ) as HTMLTextAreaElement;
};

describe("IngredientForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockBack.mockClear();
    mockCreateIngredient.mockClear();
    mockUpdateIngredient.mockClear();
  });

  describe("Form Rendering", () => {
    it("renders all form sections", () => {
      render(<IngredientForm />);

      expect(screen.getByText("Basic Information")).toBeInTheDocument();
      expect(screen.getByText("Image")).toBeInTheDocument();
    });

    it("renders required field labels", () => {
      render(<IngredientForm />);

      expect(screen.getByText("Name *")).toBeInTheDocument();
      expect(screen.getByText("Icon (Emoji) *")).toBeInTheDocument();
      expect(screen.getByText("Subtitle *")).toBeInTheDocument();
      expect(screen.getByText("Type *")).toBeInTheDocument();
      expect(screen.getByText("Description *")).toBeInTheDocument();
      expect(screen.getByText("Display Order")).toBeInTheDocument();
    });

    it("shows empty form for new ingredient", () => {
      render(<IngredientForm />);

      const nameInput = getInputByName("name");
      expect(nameInput).toBeTruthy();
      expect(nameInput.value).toBe("");

      expect(screen.getByText("Create Ingredient")).toBeInTheDocument();
    });

    it("pre-fills fields when editing existing ingredient", () => {
      render(<IngredientForm ingredient={mockIngredient} />);

      expect(screen.getByDisplayValue("Test Ingredient")).toBeInTheDocument();
      expect(screen.getByDisplayValue("🌿")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Subtitle")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
      expect(screen.getByText("Update Ingredient")).toBeInTheDocument();
    });

    it("renders type select with correct options", () => {
      render(<IngredientForm />);

      const typeSelect = getInputByName("type") as HTMLSelectElement;
      expect(typeSelect).toBeTruthy();
      expect(typeSelect.options[0].value).toBe("Adaptogen");
      expect(typeSelect.options[1].value).toBe("Fruit");
    });
  });

  describe("Form Submission", () => {
    it("calls createIngredient for new ingredient", async () => {
      mockCreateIngredient.mockResolvedValue({
        success: true,
        data: { id: "new-id" },
      });

      render(<IngredientForm />);

      // Fill required fields
      const nameInput = getInputByName("name");
      const iconInput = getInputByName("icon");
      const subtitleInput = getInputByName("subtitle");
      const descriptionTextarea = getTextAreaByName("description");
      const typeSelect = getInputByName("type") as HTMLSelectElement;
      const orderInput = getInputByName("order");

      fireEvent.change(nameInput, { target: { value: "New Ingredient" } });
      fireEvent.change(iconInput, { target: { value: "🍋" } });
      fireEvent.change(subtitleInput, { target: { value: "New Subtitle" } });
      fireEvent.change(descriptionTextarea, {
        target: { value: "New Description" },
      });
      fireEvent.change(typeSelect, { target: { value: "Fruit" } });
      fireEvent.change(orderInput, { target: { value: "5" } });

      // Submit
      const submitButton = screen.getByText("Create Ingredient");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateIngredient).toHaveBeenCalled();
      });
    });

    it("calls updateIngredient for existing ingredient", async () => {
      mockUpdateIngredient.mockResolvedValue({ success: true });

      render(<IngredientForm ingredient={mockIngredient} />);

      // Modify a field
      const nameInput = getInputByName("name");
      fireEvent.change(nameInput, { target: { value: "Updated Ingredient" } });

      // Submit
      const submitButton = screen.getByText("Update Ingredient");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateIngredient).toHaveBeenCalledWith(
          "test-ingredient-id",
          expect.any(Object),
        );
      });
    });

    it("redirects on success", async () => {
      mockCreateIngredient.mockResolvedValue({
        success: true,
        data: { id: "new-id" },
      });

      render(<IngredientForm />);

      // Fill required fields
      const nameInput = getInputByName("name");
      const iconInput = getInputByName("icon");
      const subtitleInput = getInputByName("subtitle");
      const descriptionTextarea = getTextAreaByName("description");
      const typeSelect = getInputByName("type") as HTMLSelectElement;

      fireEvent.change(nameInput, { target: { value: "New Ingredient" } });
      fireEvent.change(iconInput, { target: { value: "🍋" } });
      fireEvent.change(subtitleInput, { target: { value: "New Subtitle" } });
      fireEvent.change(descriptionTextarea, {
        target: { value: "New Description" },
      });
      fireEvent.change(typeSelect, { target: { value: "Fruit" } });

      const submitButton = screen.getByText("Create Ingredient");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard/ingredients");
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("handles submission errors", async () => {
      mockCreateIngredient.mockResolvedValue({
        success: false,
        error: "Failed to create",
      });

      render(<IngredientForm />);

      // Fill required fields
      const nameInput = getInputByName("name");
      const iconInput = getInputByName("icon");
      const subtitleInput = getInputByName("subtitle");
      const descriptionTextarea = getTextAreaByName("description");
      const typeSelect = getInputByName("type") as HTMLSelectElement;

      fireEvent.change(nameInput, { target: { value: "New Ingredient" } });
      fireEvent.change(iconInput, { target: { value: "🍋" } });
      fireEvent.change(subtitleInput, { target: { value: "New Subtitle" } });
      fireEvent.change(descriptionTextarea, {
        target: { value: "New Description" },
      });
      fireEvent.change(typeSelect, { target: { value: "Fruit" } });

      const submitButton = screen.getByText("Create Ingredient");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Failed to create")).toBeInTheDocument();
      });
    });

    it("disables submit button while submitting", async () => {
      mockCreateIngredient.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 1000),
          ),
      );

      render(<IngredientForm />);

      // Fill required fields
      const nameInput = getInputByName("name");
      const iconInput = getInputByName("icon");
      const subtitleInput = getInputByName("subtitle");
      const descriptionTextarea = getTextAreaByName("description");
      const typeSelect = getInputByName("type") as HTMLSelectElement;

      fireEvent.change(nameInput, { target: { value: "New Ingredient" } });
      fireEvent.change(iconInput, { target: { value: "🍋" } });
      fireEvent.change(subtitleInput, { target: { value: "New Subtitle" } });
      fireEvent.change(descriptionTextarea, {
        target: { value: "New Description" },
      });
      fireEvent.change(typeSelect, { target: { value: "Fruit" } });

      const submitButton = screen.getByText("Create Ingredient");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Saving...")).toBeInTheDocument();
      });
    });
  });

  describe("Cancel Button", () => {
    it("calls router.back when cancel is clicked", () => {
      render(<IngredientForm />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe("Image Upload Integration", () => {
    it("renders ImageUpload component", () => {
      render(<IngredientForm />);

      expect(screen.getByTestId("image-upload")).toBeInTheDocument();
      expect(screen.getByText("Ingredient Image")).toBeInTheDocument();
    });

    it("displays existing image URL when editing", () => {
      render(<IngredientForm ingredient={mockIngredient} />);

      const imageInput = screen.getByTestId("image-url-input");
      expect(imageInput).toHaveValue("https://example.com/image.jpg");
    });
  });

  describe("Form Validation", () => {
    it("shows error when name is empty", async () => {
      render(<IngredientForm />);

      const submitButton = screen.getByText("Create Ingredient");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Name is required")).toBeInTheDocument();
      });
    });

    it("shows error when icon is empty", async () => {
      render(<IngredientForm />);

      const nameInput = getInputByName("name");
      fireEvent.change(nameInput, { target: { value: "Test" } });

      const submitButton = screen.getByText("Create Ingredient");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Icon is required")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles ingredient with null imageUrl", () => {
      const ingredientWithNullImage = {
        ...mockIngredient,
        imageUrl: null,
      };

      render(<IngredientForm ingredient={ingredientWithNullImage} />);

      expect(screen.getByText("Update Ingredient")).toBeInTheDocument();
    });

    it("defaults type to Adaptogen when not provided", () => {
      render(<IngredientForm />);

      const typeSelect = getInputByName("type") as HTMLSelectElement;
      expect(typeSelect.value).toBe("Adaptogen");
    });

    it("defaults order to 0 when not provided", () => {
      render(<IngredientForm />);

      const orderInput = getInputByName("order");
      expect(orderInput.value).toBe("0");
    });
  });
});
