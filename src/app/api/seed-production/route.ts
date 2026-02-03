import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const products = [
  {
    id: "tequila-sundown",
    name: "Tequila Sundown",
    subtitle: "Really party.",
    description: "Orange & Cranberry - For the life of the party",
    longDescription: `
      <h3>Gut health & Immunity support</h3>
      <ul>
        <li>Fresh orange and cranberry are high in oxidants which protects cell damages from free radical linking to heart diseases, cancer and diabetes.</li>
        <li>Baobab is high in iron and vitamin C which is good for immunity and gut support.</li>
        <li>Pairing iron rich food with vitamin C rich fruits enhances iron uptake and aiding in iron deficiency anaemia.</li>
      </ul>
    `,
    price: "$35.99",
    priceSubtext: "12 cans delivered one time",
    imageColor: "#8B4513",
    imageUrl: "/images/products/tequila-sundown.jpg",
    features: [
      { text: "Good Vit C", color: "#FF6B6B" },
      { text: "Good Iron", color: "#4ECDC4" },
    ],
    ingredients: [
      "Orange juice",
      "cranberry",
      "peach",
      "carbonated water",
    ],
  },
  {
    id: "dark-stormy",
    name: "Dark & Stormy",
    subtitle: "Really smooth.",
    description: "Ginger & Lime - For the smooth soul",
    longDescription: `
      <h3>Sophisticated & Smooth</h3>
      <p>The Dark & Stormy is a classic with a twist. Our blend combines the warming spice of ginger with the bright acidity of lime for a perfectly balanced cocktail experience.</p>
    `,
    price: "$35.99",
    priceSubtext: "12 cans delivered one time",
    imageColor: "#2F4F4F",
    imageUrl: "/images/products/dark-stormy.jpg",
    features: [
      { text: "Less sugar", color: "#FF6B6B" },
      { text: "Good Antioxidant", color: "#4ECDC4" },
      { text: "Good Fiber", color: "#45B7D1" },
    ],
    ingredients: [
      "Ginger",
      "Tea",
      "Apple Juice",
      "Carbonated water",
      "Cinnamon",
      "Star Anise",
      "Molasses",
      "Allulose",
      "Lime",
      "Orange",
      "Ashwagandha extract",
    ],
    productBrief:
      "A sophisticated blend that combines the warming spice of ginger with the bright acidity of lime for a perfectly balanced cocktail experience that's both refreshing and warming.",
  },
  {
    id: "maca-martini",
    name: "Maca Martini",
    subtitle: "Really sophisticated.",
    description: "Coffee & Chocolate - For the smooth operator",
    longDescription: `
      <h3>Rich & Indulgent</h3>
      <p>The Maca Martini combines the rich, earthy flavors of maca root with decadent coffee and chocolate notes. This sophisticated blend is perfect for the discerning cocktail enthusiast.</p>
    `,
    price: "$37.99",
    priceSubtext: "12 cans delivered one time",
    imageColor: "#CD5C5C",
    imageUrl: "/images/products/maca-martini.jpg",
    features: [
      { text: "High antioxidant", color: "#FF6B6B" },
      { text: "High Calcium", color: "#4ECDC4" },
      { text: "Caffeine", color: "#45B7D1" },
    ],
    ingredients: [
      "cocoa",
      "coffee",
      "non-alcoholic rum",
      "milk",
      "allulose",
      "maca powder",
      "lime",
    ],
    productBrief:
      "The Maca Martini combines the rich, earthy flavors of maca root with decadent coffee and chocolate notes for a sophisticated blend that offers both indulgence and wellness.",
  },
];

export async function POST() {
  try {
    console.log("Start seeding production database...");

    const results = [];
    for (const product of products) {
      const result = await prisma.product.upsert({
        where: { id: product.id },
        update: {
          name: product.name,
          subtitle: product.subtitle,
          description: product.description,
          longDescription: product.longDescription,
          price: product.price,
          priceSubtext: product.priceSubtext,
          imageColor: product.imageColor,
          imageUrl: product.imageUrl,
          features: product.features,
          ingredients: product.ingredients,
          productBrief: product.productBrief,
        },
        create: product,
      });
      results.push(result.id);
      console.log(`Created/Updated product with id: ${result.id}`);
    }

    console.log("Production seeding finished.");

    return NextResponse.json({
      success: true,
      message: "Production database seeded successfully",
      products: results,
    });
  } catch (error) {
    console.error("Error seeding production database:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
