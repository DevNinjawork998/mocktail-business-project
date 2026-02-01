import { getAllProducts, getProductById, getOtherProducts } from "../productService";
import "@jest/globals";

// Mock fetch globally
global.fetch = jest.fn();

const mockProduct = {
  id: "test-id",
  name: "Test Product",
  subtitle: "Test Subtitle",
  description: "Test Description",
  longDescription: "<p>Test</p>",
  price: "$10",
  priceSubtext: "per bottle",
  imageColor: "#000000",
  imageUrl: "https://example.com/image.jpg",
  features: [{ text: "Feature 1", color: "#FF0000" }],
};

describe("productService", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe("getAllProducts", () => {
    it("fetches all products successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockProduct],
      });

      const products = await getAllProducts();

      expect(products).toEqual([mockProduct]);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products"),
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("handles HTTP errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getAllProducts()).rejects.toThrow("HTTP error! status: 500");
    });

    it("handles network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(getAllProducts()).rejects.toThrow("Network error");
    });
  });

  describe("getProductById", () => {
    it("fetches product by id successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const product = await getProductById("test-id");

      expect(product).toEqual(mockProduct);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products/test-id"),
        expect.objectContaining({
          method: "GET",
        })
      );
    });

    it("returns null for 404 errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const product = await getProductById("non-existent-id");

      expect(product).toBeNull();
    });

    it("throws error for other HTTP errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(getProductById("test-id")).rejects.toThrow("HTTP error! status: 500");
    });
  });

  describe("getOtherProducts", () => {
    it("returns products excluding the specified id", async () => {
      const allProducts = [mockProduct, { ...mockProduct, id: "other-id" }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => allProducts,
      });

      const otherProducts = await getOtherProducts("test-id");

      expect(otherProducts).toHaveLength(1);
      expect(otherProducts[0].id).toBe("other-id");
    });

    it("handles errors from getAllProducts", async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(getOtherProducts("test-id")).rejects.toThrow("Network error");
    });
  });
});
