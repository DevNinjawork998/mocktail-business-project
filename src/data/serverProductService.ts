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
  imageUrl?: string; // Optional image URL (kept for backward compatibility)
  images?: Array<{ url: string; order: number }>; // Multiple images from ProductImage table
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

/**
 * Convert a product name to a slug format
 */
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&]/g, "") // Remove &
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const includeImages = {
      images: { orderBy: { order: "asc" as const } },
    };

    const byId = await prisma.product.findUnique({
      where: { id },
      include: includeImages,
    });

    const raw =
      byId ??
      (id.includes("-")
        ? ((await prisma.product.findMany({ include: includeImages })).find(
            (p) => nameToSlug(p.name) === id || p.id === id,
          ) ?? null)
        : null);

    if (!raw) return null;

    return {
      ...raw,
      features: raw.features as Array<{ text: string; color: string }>,
      ingredients: raw.ingredients as string[] | undefined,
      nutritionFacts: raw.nutritionFacts as
        | Array<{ label: string; value: string }>
        | undefined,
      imageUrl: raw.imageUrl || undefined,
      productBrief: raw.productBrief || undefined,
      images:
        raw.images.length > 0
          ? raw.images.map((img) => ({ url: img.url, order: img.order }))
          : undefined,
    };
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
