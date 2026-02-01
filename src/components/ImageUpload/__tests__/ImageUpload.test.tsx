import React from "react";
import { render, screen, fireEvent, act } from "../../../__tests__/test-utils";
import ImageUpload from "../ImageUpload";
import "@jest/globals";

// Mock the UploadDropzone component
jest.mock("@/lib/uploadthing", () => ({
  UploadDropzone: ({
    endpoint,
    onUploadBegin,
    onClientUploadComplete,
    onUploadError,
  }: {
    endpoint: string;
    onUploadBegin: () => void;
    onClientUploadComplete: (res: { url: string }[]) => void;
    onUploadError: (error: Error) => void;
  }) => (
    <div data-testid="upload-dropzone" data-endpoint={endpoint}>
      <button
        data-testid="mock-upload-button"
        onClick={() => {
          onUploadBegin();
          // Simulate successful upload
          setTimeout(() => {
            onClientUploadComplete([{ url: "https://example.com/image.jpg" }]);
          }, 100);
        }}
      >
        Upload
      </button>
      <button
        data-testid="mock-error-button"
        onClick={() => {
          onUploadBegin();
          setTimeout(() => {
            onUploadError(new Error("Upload failed"));
          }, 100);
        }}
      >
        Trigger Error
      </button>
    </div>
  ),
}));

// Mock next/image
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
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="uploaded-image" />
  ),
}));

describe("ImageUpload", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("renders label correctly", () => {
      render(
        <ImageUpload
          onChange={mockOnChange}
          endpoint="productImage"
          label="Product Image"
        />
      );
      expect(screen.getByText("Product Image")).toBeInTheDocument();
    });

    it("uses default label when not provided", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);
      expect(screen.getByText("Image")).toBeInTheDocument();
    });

    it("shows upload dropzone when no image value", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);
      expect(screen.getByTestId("upload-dropzone")).toBeInTheDocument();
    });

    it("shows image preview when value provided", () => {
      render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />
      );
      expect(screen.getByTestId("uploaded-image")).toBeInTheDocument();
      expect(screen.getByTestId("uploaded-image")).toHaveAttribute(
        "src",
        "https://example.com/test.jpg"
      );
    });

    it("renders remove button when image exists", () => {
      render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />
      );
      expect(screen.getByText("Remove Image")).toBeInTheDocument();
    });

    it("does not show dropzone when image value is provided", () => {
      render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />
      );
      expect(screen.queryByTestId("upload-dropzone")).not.toBeInTheDocument();
    });
  });

  describe("Upload Functionality", () => {
    it("calls onChange with URL when upload completes", async () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const uploadButton = screen.getByTestId("mock-upload-button");
      
      await act(async () => {
        fireEvent.click(uploadButton);
        // Wait for the simulated upload to complete
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(mockOnChange).toHaveBeenCalledWith(
        "https://example.com/image.jpg"
      );
    });

    it("handles upload errors gracefully", async () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const errorButton = screen.getByTestId("mock-error-button");
      
      await act(async () => {
        fireEvent.click(errorButton);
        // Wait for the simulated error
        await new Promise((resolve) => setTimeout(resolve, 150));
      });

      expect(alertSpy).toHaveBeenCalledWith("Upload failed: Upload failed");
    });
  });

  describe("Image Preview", () => {
    it("displays image with correct src", () => {
      const imageUrl = "https://example.com/my-image.jpg";
      render(
        <ImageUpload
          value={imageUrl}
          onChange={mockOnChange}
          endpoint="productImage"
        />
      );

      const image = screen.getByTestId("uploaded-image");
      expect(image).toHaveAttribute("src", imageUrl);
    });

    it("calls onChange with empty string on remove", () => {
      render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />
      );

      const removeButton = screen.getByText("Remove Image");
      fireEvent.click(removeButton);

      expect(mockOnChange).toHaveBeenCalledWith("");
    });

    it("renders image with proper alt text", () => {
      render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />
      );

      const image = screen.getByTestId("uploaded-image");
      expect(image).toHaveAttribute("alt", "Uploaded image");
    });
  });

  describe("Props", () => {
    it("uses custom label when provided", () => {
      render(
        <ImageUpload
          onChange={mockOnChange}
          endpoint="productImage"
          label="Custom Label"
        />
      );
      expect(screen.getByText("Custom Label")).toBeInTheDocument();
    });

    it("passes correct endpoint to UploadDropzone", () => {
      render(
        <ImageUpload onChange={mockOnChange} endpoint="ingredientImage" />
      );

      const dropzone = screen.getByTestId("upload-dropzone");
      expect(dropzone).toHaveAttribute("data-endpoint", "ingredientImage");
    });

    it("passes productImage endpoint correctly", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const dropzone = screen.getByTestId("upload-dropzone");
      expect(dropzone).toHaveAttribute("data-endpoint", "productImage");
    });
  });

  describe("Drag and Drop", () => {
    it("handles dragEnter event", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const dropzone = screen.getByTestId("upload-dropzone").parentElement;
      if (dropzone) {
        fireEvent.dragEnter(dropzone);
        expect(dropzone).toHaveAttribute("data-dragging", "true");
      }
    });

    it("handles dragLeave event", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const dropzone = screen.getByTestId("upload-dropzone").parentElement;
      if (dropzone) {
        fireEvent.dragEnter(dropzone);
        expect(dropzone).toHaveAttribute("data-dragging", "true");

        fireEvent.dragLeave(dropzone);
        expect(dropzone).toHaveAttribute("data-dragging", "false");
      }
    });

    it("handles dragOver event without error", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const dropzone = screen.getByTestId("upload-dropzone").parentElement;
      if (dropzone) {
        // Should not throw
        expect(() => {
          fireEvent.dragOver(dropzone);
        }).not.toThrow();
      }
    });

    it("handles drop event and resets dragging state", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const dropzone = screen.getByTestId("upload-dropzone").parentElement;
      if (dropzone) {
        fireEvent.dragEnter(dropzone);
        expect(dropzone).toHaveAttribute("data-dragging", "true");

        fireEvent.drop(dropzone);
        expect(dropzone).toHaveAttribute("data-dragging", "false");
      }
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string value as no image", () => {
      render(
        <ImageUpload value="" onChange={mockOnChange} endpoint="productImage" />
      );
      expect(screen.getByTestId("upload-dropzone")).toBeInTheDocument();
      expect(screen.queryByTestId("uploaded-image")).not.toBeInTheDocument();
    });

    it("handles undefined value as no image", () => {
      render(
        <ImageUpload
          value={undefined}
          onChange={mockOnChange}
          endpoint="productImage"
        />
      );
      expect(screen.getByTestId("upload-dropzone")).toBeInTheDocument();
    });

    it("switches from preview to dropzone when image is removed", () => {
      const { rerender } = render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />
      );

      expect(screen.getByTestId("uploaded-image")).toBeInTheDocument();

      rerender(
        <ImageUpload value="" onChange={mockOnChange} endpoint="productImage" />
      );

      expect(screen.queryByTestId("uploaded-image")).not.toBeInTheDocument();
      expect(screen.getByTestId("upload-dropzone")).toBeInTheDocument();
    });

    it("switches from dropzone to preview when image is uploaded", () => {
      const { rerender } = render(
        <ImageUpload value="" onChange={mockOnChange} endpoint="productImage" />
      );

      expect(screen.getByTestId("upload-dropzone")).toBeInTheDocument();

      rerender(
        <ImageUpload
          value="https://example.com/new-image.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />
      );

      expect(screen.queryByTestId("upload-dropzone")).not.toBeInTheDocument();
      expect(screen.getByTestId("uploaded-image")).toBeInTheDocument();
    });
  });
});
