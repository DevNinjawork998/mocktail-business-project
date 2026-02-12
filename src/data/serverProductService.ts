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
    // #region agent log
    // Server-side logging - write directly to file
    const fs = await import('fs');
    const logPath = '/Users/jacktenghaoooi/Personal_project/cocktail-business-project/.cursor/debug.log';
    const logEntry = JSON.stringify({location:'serverProductService.ts:69',message:'Fetching product from DB',data:{productId:id},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})+'\n';
    fs.promises.appendFile(logPath, logEntry).catch(()=>{});
    // #endregion
    // First, try to find by ID directly (works for both CUIDs and slug IDs)
    // Type assertion needed due to Prisma Proxy wrapper interfering with type inference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let product = (await (prisma.product.findUnique as any)({
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
    })) as
      | {
          id: string;
          name: string;
          subtitle: string;
          description: string;
          longDescription: string;
          price: string;
          priceSubtext: string;
          imageColor: string;
          imageUrl: string | null;
          features: unknown;
          ingredients: unknown;
          productBrief: string | null;
          nutritionFacts: unknown;
          images: Array<{ url: string; order: number }>;
          createdAt: Date;
          updatedAt: Date;
        }
      | null;

    // If not found and ID looks like a slug (contains hyphens), try finding by name
    if (!product && id.includes("-")) {
      // #region agent log
      const fsSlug = await import('fs');
      const logPathSlug = '/Users/jacktenghaoooi/Personal_project/cocktail-business-project/.cursor/debug.log';
      const logEntrySlug = JSON.stringify({location:'serverProductService.ts:109',message:'Product not found by ID, trying slug lookup',data:{productId:id},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})+'\n';
      fsSlug.promises.appendFile(logPathSlug, logEntrySlug).catch(()=>{});
      // #endregion
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allProducts = (await (prisma.product.findMany as any)({
        include: {
          images: {
            orderBy: {
              order: "asc",
            },
          },
        },
      })) as Array<{
        id: string;
        name: string;
        subtitle: string;
        description: string;
        longDescription: string;
        price: string;
        priceSubtext: string;
        imageColor: string;
        imageUrl: string | null;
        features: unknown;
        ingredients: unknown;
        productBrief: string | null;
        nutritionFacts: unknown;
        images: Array<{ url: string; order: number }>;
        createdAt: Date;
        updatedAt: Date;
      }>;
      product =
        allProducts.find((p) => {
          const slug = nameToSlug(p.name);
          return slug === id || p.id === id;
        }) || null;
      // #region agent log
      const fsSlug2 = await import('fs');
      const logPathSlug2 = '/Users/jacktenghaoooi/Personal_project/cocktail-business-project/.cursor/debug.log';
      const logEntrySlug2 = JSON.stringify({location:'serverProductService.ts:142',message:'Slug lookup result',data:{productFound:!!product,productId:id,searchedProductsCount:allProducts.length,imageUrl:product?.imageUrl,imagesCount:product?.images?.length||0},timestamp:Date.now(),runId:'run1',hypothesisId:'A'})+'\n';
      fsSlug2.promises.appendFile(logPathSlug2, logEntrySlug2).catch(()=>{});
      // #endregion
    }

    // #region agent log
    const fs2 = await import('fs');
    const logPath2 = '/Users/jacktenghaoooi/Personal_project/cocktail-business-project/.cursor/debug.log';
    const logEntry2 = JSON.stringify({location:'serverProductService.ts:137',message:'Product query result',data:{productFound:!!product,productId:id,imageUrl:product?.imageUrl,imagesCount:product?.images?.length||0,images:product?.images?.map((i: {url: string; order: number})=>({order:i.order,url:i.url}))||[]},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})+'\n';
    fs2.promises.appendFile(logPath2, logEntry2).catch(()=>{});
    // #endregion

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

    // #region agent log
    const fs3 = await import('fs');
    const logPath3 = '/Users/jacktenghaoooi/Personal_project/cocktail-business-project/.cursor/debug.log';
    const logEntry3 = JSON.stringify({location:'serverProductService.ts:164',message:'Mapped product ready to return',data:{productId:id,imageUrl:mappedProduct.imageUrl,imagesCount:mappedProduct.images?.length||0,images:mappedProduct.images?.map((i: {url: string; order: number})=>({order:i.order,url:i.url}))||[]},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})+'\n';
    fs3.promises.appendFile(logPath3, logEntry3).catch(()=>{});
    // #endregion

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
