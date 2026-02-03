import "@jest/globals";
import { UploadButton, UploadDropzone, useUploadThing } from "../uploadthing";

// Mock the uploadthing/react module to avoid TextEncoder issues in Jest
jest.mock("@uploadthing/react", () => ({
  generateUploadButton: jest.fn(() => jest.fn(() => null)),
  generateUploadDropzone: jest.fn(() => jest.fn(() => null)),
  generateReactHelpers: jest.fn(() => ({
    useUploadThing: jest.fn(() => ({
      startUpload: jest.fn(),
      isUploading: false,
    })),
    uploadFiles: jest.fn(),
  })),
}));

describe("uploadthing exports", () => {
  it("exports UploadButton and UploadDropzone", () => {
    expect(UploadButton).toBeDefined();
    expect(UploadDropzone).toBeDefined();
    expect(typeof UploadButton).toBe("function");
    expect(typeof UploadDropzone).toBe("function");
  });

  it("exports useUploadThing hook", () => {
    expect(useUploadThing).toBeDefined();
    expect(typeof useUploadThing).toBe("function");
  });
});
