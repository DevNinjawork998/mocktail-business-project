import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Product image mappings - add your UploadThing URLs here
const productImageUpdates: Record<string, string> = {
  "tequila-sundown":
    "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGLwb9um7RDETcuXnIk7JCmOv0Bsr38UjpZ4KSl",
  "dark-stormy":
    "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGLxaDEcbIwFrVt8c4Mls7L1TieS2KgUjDE390",
};

export async function POST() {
  try {
    const results = [];

    for (const [productId, imageUrl] of Object.entries(productImageUpdates)) {
      const product = await prisma.product.update({
        where: { id: productId },
        data: { imageUrl },
        select: { id: true, name: true, imageUrl: true },
      });
      results.push(product);
      console.log(`Updated ${product.name} with image: ${imageUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${results.length} product images`,
      products: results,
    });
  } catch (error) {
    console.error("Error updating product images:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET endpoint to check current product images
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      products,
      pendingUpdates: Object.keys(productImageUpdates),
    });
  } catch (error) {
    console.error("Error fetching product images:", error);
    return NextResponse.json(
      { error: "Failed to fetch product images" },
      { status: 500 },
    );
  }
}
