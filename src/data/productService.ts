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
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    // Use environment variable for base URL in production, fallback to localhost for development
    const baseUrl =
      typeof window !== "undefined"
        ? ""
        : process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Use environment variable for base URL in production, fallback to localhost for development
    const baseUrl =
      typeof window !== "undefined"
        ? ""
        : process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const product = await response.json();
    return product;
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
