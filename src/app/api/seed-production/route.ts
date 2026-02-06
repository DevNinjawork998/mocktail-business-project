import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Check if a URL is from UploadThing (supports both utfs.io and ufs.sh domains)
const isUploadThingUrl = (url: string | null): boolean => {
  if (!url) return false;
  return url.startsWith("https://utfs.io/") || url.includes(".ufs.sh/");
};

const products = [
  {
    id: "tequila-sundown",
    name: "Tequila Sundown",
    subtitle: "Refreshing, tart and citrusy",
    description:
      "Whether you're the life of the party, the quiet observer, or somewhere in between, this drink has your back (and your cells). Fresh orange and cranberry bring the immunity boost and antioxidant armor, while mighty Baobab swoops in with fiber and a vitamin lineup worthy of a standing ovation. It's basically your glow-up in a glass. Proof that looking radiant starts from the inside out.",
    longDescription: `<h3>Gut health & Immunity support</h3>
  <p>Fresh orange and cranberry are high in oxidants which protects cell damages from free radical linking to heart diseases, cancer and diabetes. Baobab is high in iron and vitamin C which is good for immunity and gut support. Pairing iron rich food with vitamin C rich fruits enhances iron absorption in the body</p>`,
    price: "RM11.50",
    priceSubtext: "Min total order 3 bottles. Can mix with other flavours.",
    imageColor: "#FF6347",
    imageUrl:
      "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGLO6VqBvKnPKYEgeG0tm78wrchLAJHQUl5RDZB",
    features: [
      { text: "Good Vitamin C", color: "#FF6B6B" },
      { text: "Good Iron", color: "#DC143C" },
    ],
    ingredients: ["Orange juice", "cranberry", "peach", "carbonated water"],
    productBrief:
      "A refreshing, tart and citrusy mocktail with orange and cranberry. High in antioxidants and vitamin C for gut health and immunity support.",
    nutritionFacts: [
      { label: "Calories", value: "50" },
      { label: "Total Fat", value: "0g" },
      { label: "Sodium", value: "30mg" },
      { label: "Total Carbohydrate", value: "17g" },
      { label: "Dietary Fiber", value: "5g" },
      { label: "Total Sugars", value: "5g" },
      { label: "Includes Added Sugars", value: "0g" },
      { label: "Protein", value: "0g" },
      { label: "Vitamin C", value: "20%" },
    ],
  },
  {
    id: "dark-stormy",
    name: "Dark & Stormy",
    subtitle: "Aged old acquired taste",
    description:
      "The classic rum rebel, now with extra bite. We've spiced things up with fiery ginger, bold cinnamon, and a lime twist sharp enough to cut through the chaos. Then we slipped in ashwagandha because even rebels deserve stress relief and a clear head. It's a storm in a glass, balanced yet untamed, paying cheeky homage to the Cuban original.",
    longDescription: `<h3>Digestion & Stress Relief</h3>
  <p>Our homemade non-alcoholic rum base is enhanced with adaptogen, ashwagandha to help manage stress, while ginger and cinnamon work together to soothe your digestive system and provide anti-inflammatory benefits.</p>`,
    price: "RM10.50",
    priceSubtext: "Min total order 3 bottles. Can mix with other flavours.",
    imageColor: "#8B4513",
    imageUrl:
      "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGL9LVbzkKUo2NbcLsEyGnV6TeMA1KkvQU5hzmg",
    features: [
      { text: "Less sugar", color: "#9B7653" },
      { text: "Antioxidant", color: "#CD853F" },
      { text: "Fiber", color: "#D2691E" },
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
      "Acquired and aged taste from the perfect blend of ginger & our homemade non-alcoholic rum. The perfect blend of ashwagandha, tea, cinnamon and ginger supports digestion & relieves stress.",
    nutritionFacts: [
      { label: "Calories", value: "45" },
      { label: "Total Fat", value: "0g" },
      { label: "Sodium", value: "25mg" },
      { label: "Total Carbohydrate", value: "15g" },
      { label: "Dietary Fiber", value: "4g" },
      { label: "Total Sugars", value: "4g" },
      { label: "Includes Added Sugars", value: "0g" },
      { label: "Protein", value: "0g" },
      { label: "Vitamin C", value: "15%" },
    ],
  },
  {
    id: "maca-martini",
    name: "Maca Martini",
    subtitle: "Creamy & Chocolaty",
    description:
      "Where earthy maca meets a cheeky trio of coffee and chocolate. It's bold, it's smooth, and it's basically liquid charisma. Sip it when you want to feel like James Bond with a gym membership, libido up, stamina strong, and ready to conquer both boardrooms and ball games. Your ultimate wingman for work and play.",
    longDescription: `<h3>Stamina & Libido Boost</h3>
  <p>Maca root is an ancient Peruvian superfood known for its energy-boosting properties and natural support for hormonal balance and vitality. Combined with mood-enhancing cocoa and energizing coffee, this creamy blend keeps your spirits high and your energy sustained.</p>`,
    price: "RM11.50",
    priceSubtext: "Min total order 3 bottles. Can mix with other flavours.",
    imageColor: "#654321",
    imageUrl:
      "https://qchbny9v2p.ufs.sh/f/2frRLzpx3hGL3uSvvjZSIC7hAszGimOtgLuxFbKZRQVjwy2N",
    features: [
      { text: "Antioxidant", color: "#DEB887" },
      { text: "Calcium", color: "#6F4E37" },
      { text: "Caffeine", color: "#3E2723" },
    ],
    ingredients: ["tea", "apple juice", "cinnamon", "star anise"],
    productBrief:
      "Creamy & Chocolaty to keep your spirits & mood up. Maca root, cocoa & coffee increases stamina & libido.",
    nutritionFacts: [
      { label: "Calories", value: "55" },
      { label: "Total Fat", value: "0.5g" },
      { label: "Sodium", value: "35mg" },
      { label: "Total Carbohydrate", value: "18g" },
      { label: "Dietary Fiber", value: "6g" },
      { label: "Total Sugars", value: "6g" },
      { label: "Includes Added Sugars", value: "0g" },
      { label: "Protein", value: "1g" },
      { label: "Vitamin C", value: "10%" },
    ],
  },
];

export async function POST() {
  try {
    console.log("Start seeding production database...");

    // Get existing products to preserve UploadThing URLs
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: products.map((p) => p.id),
        },
      },
      select: {
        id: true,
        imageUrl: true,
      },
    });

    const existingImageUrls = new Map(
      existingProducts
        .filter((p) => isUploadThingUrl(p.imageUrl))
        .map((p) => [p.id, p.imageUrl!]),
    );

    const results = [];
    for (const product of products) {
      // Preserve existing UploadThing URL if it exists, otherwise use seed data
      const imageUrl = existingImageUrls.get(product.id) || product.imageUrl;

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
          imageUrl: imageUrl,
          features: product.features,
          ingredients: product.ingredients,
          productBrief: product.productBrief,
          nutritionFacts: product.nutritionFacts,
        },
        create: {
          ...product,
          imageUrl: imageUrl,
        },
      });
      results.push(result.id);
      console.log(`Created/Updated product with id: ${result.id}`);
      if (existingImageUrls.has(product.id)) {
        console.log(
          `  Preserved UploadThing URL: ${existingImageUrls.get(product.id)}`,
        );
      }
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
