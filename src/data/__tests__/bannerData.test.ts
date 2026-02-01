import { bannerData } from "../bannerData";
import "@jest/globals";

describe("bannerData", () => {
  it("exports an array of banner items", () => {
    expect(Array.isArray(bannerData)).toBe(true);
    expect(bannerData.length).toBeGreaterThan(0);
  });

  it("contains items with correct structure", () => {
    bannerData.forEach((item) => {
      expect(item).toHaveProperty("type");
      expect(["message", "image"]).toContain(item.type);

      if (item.type === "message") {
        expect(item).toHaveProperty("content");
        expect(typeof item.content).toBe("string");
      }

      if (item.type === "image") {
        expect(item).toHaveProperty("src");
        expect(item).toHaveProperty("alt");
        expect(typeof item.src).toBe("string");
        expect(typeof item.alt).toBe("string");
      }
    });
  });

  it("contains both message and image types", () => {
    const types = bannerData.map((item) => item.type);
    expect(types).toContain("message");
    expect(types).toContain("image");
  });
});
