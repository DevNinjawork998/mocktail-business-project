import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/__tests__/test-utils";
import SettingsClient from "../SettingsClient";
import * as settingsActions from "@/app/actions/settings";

jest.mock("@/app/actions/settings", () => ({
  setLandingHeroSlideUrls: jest.fn(),
  setFounderStory: jest.fn(),
  getFounderStory: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    style?: React.CSSProperties;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />;
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

jest.mock("@/components/ImageUpload", () => {
  return function MockImageUpload({
    onChange,
    onUploadStart,
    onUploadComplete,
    label,
  }: {
    onChange: (url: string) => void;
    onUploadStart?: () => void;
    onUploadComplete?: () => void;
    endpoint: string;
    label: string;
  }) {
    return (
      <div data-testid="image-upload">
        <label>{label}</label>
        <button
          type="button"
          onClick={() => onChange("https://example.com/new-image.jpg")}
          data-testid="upload-button"
        >
          Upload
        </button>
        <button
          type="button"
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

  it("renders landing hero section with empty list", () => {
    render(<SettingsClient initialLandingSlideUrls={[]} />);

    expect(
      screen.getByRole("heading", { name: "Landing hero images" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("image-upload")).toBeInTheDocument();
    expect(screen.getByText("Add photo")).toBeInTheDocument();
  });

  it("renders thumbnails for initial slides", () => {
    render(
      <SettingsClient
        initialLandingSlideUrls={["https://example.com/a.jpg"]}
      />,
    );

    expect(screen.getByRole("img", { name: "Hero slide 1" })).toHaveAttribute(
      "src",
      "https://example.com/a.jpg",
    );
    expect(
      screen.getByRole("button", { name: "Remove hero image 1" }),
    ).toBeInTheDocument();
  });

  it("appends slide when image is uploaded and enables save", async () => {
    const user = userEvent.setup();
    render(<SettingsClient initialLandingSlideUrls={[]} />);

    const saveButton = screen.getByRole("button", {
      name: /save hero images/i,
    });
    expect(saveButton).toBeDisabled();

    await user.click(screen.getByTestId("upload-button"));

    expect(
      screen.getByRole("img", { name: "Hero slide 1" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  it("saves slide list successfully", async () => {
    const user = userEvent.setup();
    const mockSet = jest.spyOn(settingsActions, "setLandingHeroSlideUrls");
    mockSet.mockResolvedValue({ success: true });

    render(<SettingsClient initialLandingSlideUrls={[]} />);

    await user.click(screen.getByTestId("upload-button"));

    await user.click(screen.getByRole("button", { name: /save hero images/i }));

    await waitFor(() => {
      expect(mockSet).toHaveBeenCalledWith([
        "https://example.com/new-image.jpg",
      ]);
      expect(
        screen.getByText("Landing hero images saved successfully!"),
      ).toBeInTheDocument();
    });
  });

  it("shows error when save fails", async () => {
    const user = userEvent.setup();
    const mockSet = jest.spyOn(settingsActions, "setLandingHeroSlideUrls");
    mockSet.mockResolvedValue({ success: false, error: "Failed to save" });

    render(<SettingsClient initialLandingSlideUrls={[]} />);

    await user.click(screen.getByTestId("upload-button"));
    await user.click(screen.getByRole("button", { name: /save hero images/i }));

    await waitFor(() => {
      expect(screen.getByText("Failed to save")).toBeInTheDocument();
    });
  });

  it("removes one slide via server action", async () => {
    const user = userEvent.setup();
    const mockSet = jest.spyOn(settingsActions, "setLandingHeroSlideUrls");
    mockSet.mockResolvedValue({ success: true });

    render(
      <SettingsClient
        initialLandingSlideUrls={["https://example.com/a.jpg"]}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Remove hero image 1" }),
    );

    await waitFor(() => {
      expect(mockSet).toHaveBeenCalledWith([]);
      expect(
        screen.getByText("All landing hero images removed."),
      ).toBeInTheDocument();
    });
  });

  it("remove all clears slides", async () => {
    const user = userEvent.setup();
    const mockSet = jest.spyOn(settingsActions, "setLandingHeroSlideUrls");
    mockSet.mockResolvedValue({ success: true });

    render(
      <SettingsClient
        initialLandingSlideUrls={["https://example.com/a.jpg"]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /remove all/i }));

    await waitFor(() => {
      expect(mockSet).toHaveBeenCalledWith([]);
    });
  });

  it("disables save while uploading", async () => {
    const user = userEvent.setup();
    render(<SettingsClient initialLandingSlideUrls={[]} />);

    await user.click(screen.getByTestId("upload-button"));

    const saveButton = screen.getByRole("button", {
      name: /save hero images/i,
    });
    await user.click(screen.getByTestId("trigger-upload"));
    expect(saveButton).toBeDisabled();

    await waitFor(
      () => {
        expect(saveButton).not.toBeDisabled();
      },
      { timeout: 200 },
    );
  });

  it("clears error when uploading again", async () => {
    const user = userEvent.setup();
    const mockSet = jest.spyOn(settingsActions, "setLandingHeroSlideUrls");
    mockSet.mockResolvedValue({ success: false, error: "Error message" });

    render(<SettingsClient initialLandingSlideUrls={[]} />);

    await user.click(screen.getByTestId("upload-button"));
    await user.click(screen.getByRole("button", { name: /save hero images/i }));

    await waitFor(() => {
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("upload-button"));

    await waitFor(() => {
      expect(screen.queryByText("Error message")).not.toBeInTheDocument();
    });
  });
});
