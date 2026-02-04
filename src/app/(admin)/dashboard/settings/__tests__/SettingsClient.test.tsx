import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/test-utils";
import SettingsClient from "../SettingsClient";
import * as settingsActions from "@/app/actions/settings";

// Mock the settings actions
jest.mock("@/app/actions/settings", () => ({
  updateLandingPhotoUrl: jest.fn(),
  removeLandingPhoto: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

// Mock ImageUpload component
jest.mock("@/components/ImageUpload", () => {
  return function MockImageUpload({
    value,
    onChange,
    onUploadStart,
    onUploadComplete,
    endpoint,
    label,
  }: {
    value?: string;
    onChange: (url: string) => void;
    onUploadStart?: () => void;
    onUploadComplete?: () => void;
    endpoint: string;
    label: string;
  }) {
    return (
      <div data-testid="image-upload">
        <label>{label}</label>
        {value && <div data-testid="image-preview">{value}</div>}
        <button
          onClick={() => onChange("https://example.com/new-image.jpg")}
          data-testid="upload-button"
        >
          Upload
        </button>
        <button
          onClick={() => {
            onUploadStart?.();
            setTimeout(() => onUploadComplete?.(), 100);
          }}
          data-testid="trigger-upload"
        >
          Trigger Upload
        </button>
      </div>
    );
  };
});

describe("SettingsClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the settings form with initial landing photo URL", () => {
    render(
      <SettingsClient initialLandingPhotoUrl="https://example.com/image.jpg" />,
    );

    expect(
      screen.getByRole("heading", { name: "Landing Photo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Upload or change the hero image displayed on the homepage",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
  });

  it("renders without initial landing photo URL", () => {
    render(<SettingsClient initialLandingPhotoUrl={null} />);

    expect(
      screen.getByRole("heading", { name: "Landing Photo" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
  });

  it("updates landing photo URL when image is uploaded", async () => {
    const user = userEvent.setup();
    render(<SettingsClient initialLandingPhotoUrl={null} />);

    const uploadButton = screen.getByTestId("upload-button");
    await user.click(uploadButton);

    expect(screen.getByTestId("image-preview")).toBeInTheDocument();
    expect(screen.getByTestId("image-preview")).toHaveTextContent(
      "https://example.com/new-image.jpg",
    );
  });

  it("saves landing photo URL successfully", async () => {
    const user = userEvent.setup();
    const mockUpdate = jest.spyOn(settingsActions, "updateLandingPhotoUrl");
    mockUpdate.mockResolvedValue({ success: true });

    render(<SettingsClient initialLandingPhotoUrl={null} />);

    // Upload an image first
    const uploadButton = screen.getByTestId("upload-button");
    await user.click(uploadButton);

    // Save the changes
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        "https://example.com/new-image.jpg",
      );
      expect(
        screen.getByText("Landing photo updated successfully!"),
      ).toBeInTheDocument();
    });
  });

  it("shows error when save fails", async () => {
    const user = userEvent.setup();
    const mockUpdate = jest.spyOn(settingsActions, "updateLandingPhotoUrl");
    mockUpdate.mockResolvedValue({ success: false, error: "Failed to save" });

    render(<SettingsClient initialLandingPhotoUrl={null} />);

    // Upload an image first
    const uploadButton = screen.getByTestId("upload-button");
    await user.click(uploadButton);

    // Save the changes
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to save")).toBeInTheDocument();
    });
  });

  it("disables save button when no image is uploaded", () => {
    render(<SettingsClient initialLandingPhotoUrl={null} />);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    // Button should be disabled when no image is uploaded
    expect(saveButton).toBeDisabled();
  });

  it("enables save button when image is uploaded", async () => {
    const user = userEvent.setup();
    render(<SettingsClient initialLandingPhotoUrl={null} />);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toBeDisabled();

    // Upload an image
    const uploadButton = screen.getByTestId("upload-button");
    await user.click(uploadButton);

    // Button should now be enabled
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  it("removes landing photo successfully", async () => {
    const user = userEvent.setup();
    const mockRemove = jest.spyOn(settingsActions, "removeLandingPhoto");
    mockRemove.mockResolvedValue({ success: true });

    render(
      <SettingsClient initialLandingPhotoUrl="https://example.com/image.jpg" />,
    );

    const removeButton = screen.getByRole("button", { name: /remove photo/i });
    await user.click(removeButton);

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalled();
      expect(
        screen.getByText("Landing photo removed successfully!"),
      ).toBeInTheDocument();
    });
  });

  it("shows error when remove fails", async () => {
    const user = userEvent.setup();
    const mockRemove = jest.spyOn(settingsActions, "removeLandingPhoto");
    mockRemove.mockResolvedValue({ success: false, error: "Failed to remove" });

    render(
      <SettingsClient initialLandingPhotoUrl="https://example.com/image.jpg" />,
    );

    const removeButton = screen.getByRole("button", { name: /remove photo/i });
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to remove")).toBeInTheDocument();
    });
  });

  it("disables save button when image is uploading", async () => {
    const user = userEvent.setup();
    render(<SettingsClient initialLandingPhotoUrl={null} />);

    // Upload an image
    const uploadButton = screen.getByTestId("upload-button");
    await user.click(uploadButton);

    // Trigger upload start
    const triggerUpload = screen.getByTestId("trigger-upload");
    await user.click(triggerUpload);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toBeDisabled();

    // Wait for upload to complete
    await waitFor(
      () => {
        expect(saveButton).not.toBeDisabled();
      },
      { timeout: 200 },
    );
  });

  it("disables save button when saving", async () => {
    const user = userEvent.setup();
    const mockUpdate = jest.spyOn(settingsActions, "updateLandingPhotoUrl");
    mockUpdate.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ success: true }), 100);
        }),
    );

    render(<SettingsClient initialLandingPhotoUrl={null} />);

    // Upload an image
    const uploadButton = screen.getByTestId("upload-button");
    await user.click(uploadButton);

    // Save the changes
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveTextContent("Saving...");

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  it("clears error and success messages when image changes", async () => {
    const user = userEvent.setup();
    const mockUpdate = jest.spyOn(settingsActions, "updateLandingPhotoUrl");
    mockUpdate.mockResolvedValue({ success: false, error: "Error message" });

    render(<SettingsClient initialLandingPhotoUrl={null} />);

    // Upload an image and trigger error
    const uploadButton = screen.getByTestId("upload-button");
    await user.click(uploadButton);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    // Upload a new image - should clear error
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.queryByText("Error message")).not.toBeInTheDocument();
    });
  });
});
