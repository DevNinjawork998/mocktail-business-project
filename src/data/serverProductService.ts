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
    // First, try to find by ID directly (works for both CUIDs and slug IDs)
    let product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // If not found and ID looks like a slug (contains hyphens), try finding by name
    if (!product && id.includes("-")) {
      const allProducts = await prisma.product.findMany({
        include: {
          images: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });
      product =
        allProducts.find((p) => {
          const slug = nameToSlug(p.name);
          return slug === id || p.id === id;
        }) || null;
    }

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
      images:
        product.images && product.images.length > 0
          ? product.images.map((img) => ({
              url: img.url,
              order: img.order,
            }))
          : undefined,
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
