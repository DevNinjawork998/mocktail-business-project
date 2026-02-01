import "@jest/globals";
import { UploadButton, UploadDropzone } from "../uploadthing";

// Mock the uploadthing/react module to avoid TextEncoder issues in Jest
jest.mock("@uploadthing/react", () => ({
  generateUploadButton: jest.fn(() => jest.fn(() => null)),
  generateUploadDropzone: jest.fn(() => jest.fn(() => null)),
}));

describe("uploadthing exports", () => {
  it("exports UploadButton and UploadDropzone", () => {
    expect(UploadButton).toBeDefined();
    expect(UploadDropzone).toBeDefined();
    expect(typeof UploadButton).toBe("function");
    expect(typeof UploadDropzone).toBe("function");
  });
});
