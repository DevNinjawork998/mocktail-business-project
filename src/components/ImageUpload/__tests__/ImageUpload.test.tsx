import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "../../../__tests__/test-utils";
import ImageUpload from "../ImageUpload";
import "@jest/globals";

// Mock the useUploadThing hook
const mockStartUpload = jest.fn();
let mockIsUploading = false;

interface UploadThingOptions {
  onClientUploadComplete?: (res: Array<{ url: string }>) => void;
  onUploadError?: (error: Error) => void;
}

let currentOptions: UploadThingOptions | undefined = undefined;

jest.mock("@/lib/uploadthing", () => {
  return {
    useUploadThing: jest.fn(
      (_endpoint: string, options?: UploadThingOptions) => {
        currentOptions = options;
        // Reset mock implementation - returns a promise that resolves
        // The component handles calling the callbacks
        mockStartUpload.mockImplementation(async (_files: File[]) => {
          mockIsUploading = true;
          mockIsUploading = false;

          const result = [{ url: "https://example.com/image.jpg" }];
          // Call the callback synchronously - the component's handleFileSelect
          // will be wrapped in act by the test
          if (options?.onClientUploadComplete) {
            options.onClientUploadComplete(result);
          }
          return result;
        });

        return {
          startUpload: mockStartUpload,
          isUploading: mockIsUploading,
        };
      },
    ),
  };
});

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
    mockStartUpload.mockClear();
    mockIsUploading = false;
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
        />,
      );
      expect(screen.getByText("Product Image")).toBeInTheDocument();
    });

    it("uses default label when not provided", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);
      expect(screen.getByText("Image")).toBeInTheDocument();
    });

    it("shows upload dropzone when no image value", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);
      // The dropzone should show "Choose a file or drag and drop" text
      expect(
        screen.getByText("Choose a file or drag and drop"),
      ).toBeInTheDocument();
    });

    it("shows image preview when value provided", () => {
      render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />,
      );
      expect(screen.getByTestId("uploaded-image")).toBeInTheDocument();
      expect(screen.getByTestId("uploaded-image")).toHaveAttribute(
        "src",
        "https://example.com/test.jpg",
      );
    });

    it("renders remove button when image exists", () => {
      render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />,
      );
      expect(screen.getByText("Remove Image")).toBeInTheDocument();
    });

    it("does not show dropzone when image value is provided", () => {
      render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />,
      );
      expect(
        screen.queryByText("Choose a file or drag and drop"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Upload Functionality", () => {
    it("calls onChange with URL when upload completes", async () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
        await waitFor(() => {
          expect(mockStartUpload).toHaveBeenCalled();
        });
      });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          "https://example.com/image.jpg",
        );
      });
    });

    it("handles upload errors gracefully", async () => {
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      // Override startUpload to simulate error
      mockStartUpload.mockImplementationOnce(async () => {
        // Simulate that UploadThing calls onUploadError when upload fails
        if (currentOptions?.onUploadError) {
          currentOptions.onUploadError(new Error("Upload failed"));
        }
        return [];
      });

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

      await act(async () => {
        fireEvent.change(fileInput, { target: { files: [file] } });
      });

      // Wait for the error callback to be called
      await waitFor(
        () => {
          expect(alertSpy).toHaveBeenCalledWith("Upload failed: Upload failed");
        },
        { timeout: 1000 },
      );
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
        />,
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
        />,
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
        />,
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
        />,
      );
      expect(screen.getByText("Custom Label")).toBeInTheDocument();
    });

    it("accepts productImage endpoint", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);
      expect(
        screen.getByText("Choose a file or drag and drop"),
      ).toBeInTheDocument();
    });

    it("accepts ingredientImage endpoint", () => {
      render(
        <ImageUpload onChange={mockOnChange} endpoint="ingredientImage" />,
      );
      expect(
        screen.getByText("Choose a file or drag and drop"),
      ).toBeInTheDocument();
    });
  });

  describe("Drag and Drop", () => {
    it("handles drop event and triggers upload", async () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const dropzone = screen
        .getByText("Choose a file or drag and drop")
        .closest("div");
      expect(dropzone).toBeInTheDocument();

      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const dataTransfer: DataTransfer = {
        files: [file] as FileList,
        items: [] as DataTransferItemList,
        types: ["Files"] as ReadonlyArray<string>,
      } as DataTransfer;

      await act(async () => {
        fireEvent.drop(dropzone!, {
          dataTransfer,
        });
      });

      await waitFor(() => {
        expect(mockStartUpload).toHaveBeenCalled();
      });
    });

    it("handles dragOver event without error", () => {
      render(<ImageUpload onChange={mockOnChange} endpoint="productImage" />);

      const dropzone = screen
        .getByText("Choose a file or drag and drop")
        .closest("div");
      expect(dropzone).toBeInTheDocument();

      // Should not throw
      expect(() => {
        fireEvent.dragOver(dropzone!);
      }).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string value as no image", () => {
      render(
        <ImageUpload
          value=""
          onChange={mockOnChange}
          endpoint="productImage"
        />,
      );
      expect(
        screen.getByText("Choose a file or drag and drop"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("uploaded-image")).not.toBeInTheDocument();
    });

    it("handles undefined value as no image", () => {
      render(
        <ImageUpload
          value={undefined}
          onChange={mockOnChange}
          endpoint="productImage"
        />,
      );
      expect(
        screen.getByText("Choose a file or drag and drop"),
      ).toBeInTheDocument();
    });

    it("switches from preview to dropzone when image is removed", () => {
      const { rerender } = render(
        <ImageUpload
          value="https://example.com/test.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />,
      );

      expect(screen.getByTestId("uploaded-image")).toBeInTheDocument();

      rerender(
        <ImageUpload
          value=""
          onChange={mockOnChange}
          endpoint="productImage"
        />,
      );

      expect(screen.queryByTestId("uploaded-image")).not.toBeInTheDocument();
      expect(
        screen.getByText("Choose a file or drag and drop"),
      ).toBeInTheDocument();
    });

    it("switches from dropzone to preview when image is uploaded", () => {
      const { rerender } = render(
        <ImageUpload
          value=""
          onChange={mockOnChange}
          endpoint="productImage"
        />,
      );

      expect(
        screen.getByText("Choose a file or drag and drop"),
      ).toBeInTheDocument();

      rerender(
        <ImageUpload
          value="https://example.com/new-image.jpg"
          onChange={mockOnChange}
          endpoint="productImage"
        />,
      );

      expect(
        screen.queryByText("Choose a file or drag and drop"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("uploaded-image")).toBeInTheDocument();
    });
  });
});
