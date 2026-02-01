import "@jest/globals";

// Mock the uploadthing/react module to avoid TextEncoder issues in Jest
jest.mock("@uploadthing/react", () => ({
  generateUploadButton: jest.fn(() => jest.fn(() => null)),
  generateUploadDropzone: jest.fn(() => jest.fn(() => null)),
}));

describe("uploadthing exports", () => {
  it("exports UploadButton and UploadDropzone", () => {
    // Dynamic import to ensure mocks are applied
    const uploadthing = require("../uploadthing");
    
    expect(uploadthing.UploadButton).toBeDefined();
    expect(uploadthing.UploadDropzone).toBeDefined();
    expect(typeof uploadthing.UploadButton).toBe("function");
    expect(typeof uploadthing.UploadDropzone).toBe("function");
  });
});
