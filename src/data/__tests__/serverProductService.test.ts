import {
  getAllProducts,
  getProductById,
  getOtherProducts,
  Product,
} from "../serverProductService";
import { prisma } from "@/lib/prisma";

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("serverProductService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPrismaProducts = [
    {
      id: "1",
      name: "Test Cocktail 1",
      subtitle: "Test Subtitle 1",
      description: "Test Description 1",
      longDescription: "Test Long Description 1",
      price: "RM 29.99",
      priceSubtext: "Premium quality",
      imageColor: "#ff6b6b",
      imageUrl: "/test-image-1.jpg",
      features: [{ text: "Feature 1", color: "#ff6b6b" }],
      ingredients: ["Ingredient 1", "Ingredient 2"],
      productBrief: "Test product brief",
      nutritionFacts: [
        { label: "Calories", value: "100" },
        { label: "Sugar", value: "5g" },
      ],
      images: [],
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Test Cocktail 2",
      subtitle: "Test Subtitle 2",
      description: "Test Description 2",
      longDescription: "Test Long Description 2",
      price: "RM 19.99",
      priceSubtext: "Refreshing blend",
      imageColor: "#4ecdc4",
      features: [{ text: "Feature 2", color: "#4ecdc4" }],
      ingredients: ["Ingredient 3"],
      productBrief: "Another product brief",
      nutritionFacts: [],
      images: [],
      createdAt: new Date(),
    },
  ];

  const expectedProducts: Product[] = [
    {
      id: "1",
      name: "Test Cocktail 1",
      subtitle: "Test Subtitle 1",
      description: "Test Description 1",
      longDescription: "Test Long Description 1",
      price: "RM 29.99",
      priceSubtext: "Premium quality",
      imageColor: "#ff6b6b",
      imageUrl: "/test-image-1.jpg",
      features: [{ text: "Feature 1", color: "#ff6b6b" }],
      ingredients: ["Ingredient 1", "Ingredient 2"],
      productBrief: "Test product brief",
      nutritionFacts: [
        { label: "Calories", value: "100" },
        { label: "Sugar", value: "5g" },
      ],
    },
    {
      id: "2",
      name: "Test Cocktail 2",
      subtitle: "Test Subtitle 2",
      description: "Test Description 2",
      longDescription: "Test Long Description 2",
      price: "RM 19.99",
      priceSubtext: "Refreshing blend",
      imageColor: "#4ecdc4",
      features: [{ text: "Feature 2", color: "#4ecdc4" }],
      ingredients: ["Ingredient 3"],
      productBrief: "Another product brief",
      nutritionFacts: [],
    },
  ];

  describe("getAllProducts", () => {
    it("fetches all products successfully", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce(
        mockPrismaProducts,
      );

      const products = await getAllProducts();

      // Check that products match expected structure (excluding Prisma-specific fields)
      expect(products).toHaveLength(expectedProducts.length);
      products.forEach((product, index) => {
        expect(product).toMatchObject(expectedProducts[index]);
      });
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    it("handles products without optional fields", async () => {
      const productWithoutOptional = {
        ...mockPrismaProducts[0],
        imageUrl: null,
        ingredients: null,
        productBrief: null,
        nutritionFacts: null,
      };

      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([
        productWithoutOptional,
      ]);

      const products = await getAllProducts();

      // The code uses || undefined which converts null to undefined for imageUrl
      expect(products[0].imageUrl).toBeUndefined();
      // For ingredients, productBrief, nutritionFacts - they're cast directly
      // When null from Prisma, they remain null, but the cast might convert to undefined
      // Check that they're either null or undefined (falsy)
      expect(products[0].ingredients == null).toBe(true);
      expect(products[0].productBrief == null).toBe(true);
      expect(products[0].nutritionFacts == null).toBe(true);
    });

    it("handles database errors", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (prisma.product.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error"),
      );

      await expect(getAllProducts()).rejects.toThrow("Database error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getProductById", () => {
    it("fetches product by id successfully", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce({
        ...mockPrismaProducts[0],
        images: [
          { url: "/image1.jpg", order: 0 },
          { url: "/image2.jpg", order: 1 },
        ],
      });

      const product = await getProductById("1");

      expect(product).toMatchObject({
        ...expectedProducts[0],
        images: [
          { url: "/image1.jpg", order: 0 },
          { url: "/image2.jpg", order: 1 },
        ],
      });
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        include: {
          images: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
    });

    it("fetches product by slug when ID contains hyphens", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([
        {
          ...mockPrismaProducts[0],
          name: "Test Cocktail 1",
          id: "test-cocktail-1",
          images: [],
          updatedAt: new Date(),
        },
      ]);

      const product = await getProductById("test-cocktail-1");

      expect(product).toBeTruthy();
      expect(product?.name).toBe("Test Cocktail 1");
    });

    it("returns null when product is not found by ID or slug", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce(
        mockPrismaProducts,
      );

      const product = await getProductById("non-existent-slug");

      expect(product).toBeNull();
    });

    it("returns null when product is not found", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const product = await getProductById("999");

      expect(product).toBeNull();
    });

    it("maps product images correctly", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce({
        ...mockPrismaProducts[0],
        images: [
          { url: "/main.jpg", order: 0 },
          { url: "/support1.jpg", order: 1 },
          { url: "/support2.jpg", order: 2 },
        ],
        updatedAt: new Date(),
      });

      const product = await getProductById("1");

      expect(product?.images).toEqual([
        { url: "/main.jpg", order: 0 },
        { url: "/support1.jpg", order: 1 },
        { url: "/support2.jpg", order: 2 },
      ]);
    });

    it("returns undefined for images when empty array", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce({
        ...mockPrismaProducts[0],
        images: [],
        updatedAt: new Date(),
      });

      const product = await getProductById("1");

      expect(product?.images).toBeUndefined();
    });

    it("handles slug lookup when product name matches slug", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce([
        {
          ...mockPrismaProducts[0],
          name: "Dark & Stormy",
          id: "dark-stormy",
          images: [],
          updatedAt: new Date(),
        },
      ]);

      const product = await getProductById("dark-stormy");

      expect(product).toBeTruthy();
      expect(product?.name).toBe("Dark & Stormy");
    });

    it("handles products without optional fields", async () => {
      const productWithoutOptional = {
        ...mockPrismaProducts[0],
        imageUrl: null,
        ingredients: null,
        productBrief: null,
        nutritionFacts: null,
      };

      (prisma.product.findUnique as jest.Mock).mockResolvedValueOnce(
        productWithoutOptional,
      );

      const product = await getProductById("1");

      // The code uses || undefined which converts null to undefined for imageUrl
      expect(product?.imageUrl).toBeUndefined();
      // For ingredients, productBrief, nutritionFacts - they're cast directly
      // When null from Prisma, they remain null, but the cast might convert to undefined
      // Check that they're either null or undefined (falsy)
      expect(product?.ingredients == null).toBe(true);
      expect(product?.productBrief == null).toBe(true);
      expect(product?.nutritionFacts == null).toBe(true);
    });

    it("handles database errors", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (prisma.product.findUnique as jest.Mock).mockRejectedValueOnce(
        new Error("Database error"),
      );

      await expect(getProductById("1")).rejects.toThrow("Database error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getOtherProducts", () => {
    it("returns all products except the excluded one", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce(
        mockPrismaProducts,
      );

      const otherProducts = await getOtherProducts("1");

      expect(otherProducts).toHaveLength(1);
      expect(otherProducts[0]).toMatchObject(expectedProducts[1]);
      expect(otherProducts[0].id).not.toBe("1");
    });

    it("returns all products when excludeId doesn't match", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValueOnce(
        mockPrismaProducts,
      );

      const otherProducts = await getOtherProducts("999");

      expect(otherProducts).toHaveLength(expectedProducts.length);
      otherProducts.forEach((product, index) => {
        expect(product).toMatchObject(expectedProducts[index]);
      });
    });

    it("handles errors from getAllProducts", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (prisma.product.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error"),
      );

      await expect(getOtherProducts("1")).rejects.toThrow("Database error");
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
