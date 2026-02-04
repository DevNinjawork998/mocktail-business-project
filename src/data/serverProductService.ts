import { prisma } from "@/lib/prisma";

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  longDescription: string;
  price: string;
  priceSubtext: string;
  imageColor: string;
  imageUrl?: string; // Optional image URL
  features: Array<{ text: string; color: string }>;
  ingredients?: string[]; // Array of ingredient strings
  productBrief?: string; // Introduction/description of the drink
  nutritionFacts?: Array<{ label: string; value: string }>; // Array of nutrition facts
}

type PrismaProduct = Awaited<
  ReturnType<typeof prisma.product.findMany>
>[number];

export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return products.map((product: PrismaProduct) => {
      return {
        ...product,
        features: product.features as Array<{ text: string; color: string }>,
        ingredients: (product as unknown as Product).ingredients as
          | string[]
          | undefined,
        nutritionFacts: (product as unknown as Product).nutritionFacts as
          | Array<{ label: string; value: string }>
          | undefined,
        imageUrl: product.imageUrl || undefined,
        productBrief: (product as unknown as Product).productBrief || undefined,
      };
    }) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) return null;

    const mappedProduct = {
      ...product,
      features: product.features as Array<{ text: string; color: string }>,
      ingredients: (product as unknown as Product).ingredients as
        | string[]
        | undefined,
      nutritionFacts: (product as unknown as Product).nutritionFacts as
        | Array<{ label: string; value: string }>
        | undefined,
      imageUrl: product.imageUrl || undefined,
      productBrief: (product as unknown as Product).productBrief || undefined,
    };

    return mappedProduct;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function getOtherProducts(excludeId: string): Promise<Product[]> {
  try {
    const allProducts = await getAllProducts();
    return allProducts.filter((product) => product.id !== excludeId);
  } catch (error) {
    console.error("Error fetching other products:", error);
    throw error;
  }
}
