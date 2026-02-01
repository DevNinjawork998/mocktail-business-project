import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Use PostgreSQL adapter for production seeding
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    id: "tequila-sundown",
    name: "Tequila Sundown",
    subtitle: "Refreshing, tart and citrusy",
    description: "Very refreshing, tart and citrusy. Perfect for a hot weather",
    longDescription: `
      <h3>Immunity & Glowing Skin</h3>
      <p>Fresh orange, cranberry and baobab supports immunity and glowing skin. Perfect for hot weather, this refreshing blend combines the tangy sweetness of cranberries with the bright citrus notes of fresh orange.</p>
      <p>Enriched with baobab, a superfood high in vitamin C and antioxidants, this mocktail helps boost your immune system while promoting healthy, radiant skin.</p>
    `,
    price: "$35.99",
    priceSubtext: "12 cans delivered one time",
    imageColor: "#FF6347",
    imageUrl: "/images/products/tequila-sundown.jpg",
    features: [
      { text: "Fresh Orange", color: "#FF6B6B" },
      { text: "Cranberry", color: "#DC143C" },
      { text: "Baobab", color: "#FFB347" },
    ],
    ingredients: [
      "Carbonated Water",
      "Fresh Orange Juice",
      "Cranberry Juice Concentrate",
      "Baobab Powder",
      "Natural Orange Flavor",
      "Natural Cranberry Flavor",
      "Stevia Leaf",
      "Himalayan Pink Salt",
    ],
    productBrief:
      "Very refreshing, tart and citrusy. Perfect for a hot weather. Fresh orange, cranberry and baobab supports immunity and glowing skin.",
    nutritionFacts: [
      { label: "Calories", value: "45" },
      { label: "Total Fat", value: "0g" },
      { label: "Sodium", value: "25mg" },
      { label: "Total Carbohydrate", value: "15g" },
      { label: "Dietary Fiber", value: "4g" },
      { label: "Total Sugars", value: "4g" },
      { label: "Includes Added Sugars", value: "0g" },
      { label: "Protein", value: "0g" },
      { label: "Vitamin C", value: "45%" },
    ],
  },
  {
    id: "dark-stormy",
    name: "Dark & Stormy",
    subtitle: "Smooth & complex",
    description:
      "Acquired and aged taste from the perfect blend of ginger & our homemade non-alcoholic rum",
    longDescription: `
      <h3>Digestion & Stress Relief</h3>
      <p>The perfect blend of ashwagandha, tea, cinnamon and ginger supports digestion & relieves stress. This sophisticated mocktail offers an acquired and aged taste from our carefully crafted combination of warming spices.</p>
      <p>Our homemade non-alcoholic rum base is enhanced with adaptogenic ashwagandha to help manage stress, while ginger and cinnamon work together to soothe your digestive system and provide anti-inflammatory benefits.</p>
    `,
    price: "$35.99",
    priceSubtext: "12 cans delivered one time",
    imageColor: "#8B4513",
    imageUrl: "/images/products/dark-stormy.jpg",
    features: [
      { text: "Ashwagandha", color: "#9B7653" },
      { text: "Ginger", color: "#CD853F" },
      { text: "Cinnamon", color: "#D2691E" },
    ],
    ingredients: [
      "Carbonated Water",
      "Ginger Root Extract",
      "Ashwagandha Root Powder",
      "Black Tea Extract",
      "Cinnamon Extract",
      "Natural Rum Flavor (Non-Alcoholic)",
      "Natural Ginger Flavor",
      "Stevia Leaf",
      "Himalayan Pink Salt",
    ],
    productBrief:
      "Acquired and aged taste from the perfect blend of ginger & our homemade non-alcoholic rum. The perfect blend of ashwagandha, tea, cinnamon and ginger supports digestion & relieves stress.",
    nutritionFacts: [
      { label: "Calories", value: "40" },
      { label: "Total Fat", value: "0g" },
      { label: "Sodium", value: "20mg" },
      { label: "Total Carbohydrate", value: "14g" },
      { label: "Dietary Fiber", value: "3g" },
      { label: "Total Sugars", value: "4g" },
      { label: "Includes Added Sugars", value: "0g" },
      { label: "Protein", value: "0g" },
      { label: "Vitamin C", value: "10%" },
    ],
  },
  {
    id: "maca-martini",
    name: "Maca Martini",
    subtitle: "Creamy & chocolaty",
    description: "Creamy & Chocolaty to keep your spirits & mood up",
    longDescription: `
      <h3>Stamina & Libido Boost</h3>
      <p>Maca root, cocoa & coffee increases stamina & libido. This indulgent mocktail combines the rich, earthy flavors of maca root with decadent dark chocolate and aromatic coffee for a truly sophisticated experience.</p>
      <p>Maca root is an ancient Peruvian superfood known for its energy-boosting properties and natural support for hormonal balance and vitality. Combined with mood-enhancing cocoa and energizing coffee, this creamy blend keeps your spirits high and your energy sustained.</p>
    `,
    price: "$37.99",
    priceSubtext: "12 cans delivered one time",
    imageColor: "#654321",
    imageUrl: "/images/products/maca-martini.jpg",
    features: [
      { text: "Maca Root", color: "#DEB887" },
      { text: "Cocoa", color: "#6F4E37" },
      { text: "Coffee", color: "#3E2723" },
    ],
    ingredients: [
      "Carbonated Water",
      "Maca Root Powder",
      "Coffee Extract",
      "Cocoa Powder",
      "Natural Coffee Flavor",
      "Natural Chocolate Flavor",
      "Coconut Cream",
      "Stevia Leaf",
      "Himalayan Pink Salt",
    ],
    productBrief:
      "Creamy & Chocolaty to keep your spirits & mood up. Maca root, cocoa & coffee increases stamina & libido.",
    nutritionFacts: [
      { label: "Calories", value: "55" },
      { label: "Total Fat", value: "1g" },
      { label: "Sodium", value: "30mg" },
      { label: "Total Carbohydrate", value: "16g" },
      { label: "Dietary Fiber", value: "5g" },
      { label: "Total Sugars", value: "5g" },
      { label: "Includes Added Sugars", value: "0g" },
      { label: "Protein", value: "1g" },
      { label: "Vitamin C", value: "8%" },
    ],
  },
];

const ingredients = [
  {
    name: "Baobab",
    icon: "🌳",
    imageUrl: "/images/ingredients/baobab.jpg",
    subtitle: "Your gut's new BFF",
    description:
      "High-fiber fuel paired with zinc to keep your gut and immunity in check.",
    type: "Adaptogen",
    order: 1,
  },
  {
    name: "Coffee",
    icon: "☕",
    imageUrl: "/images/ingredients/coffee.jpg",
    subtitle: "Mental alertness",
    description:
      "The ultimate liquid spark for sharp mental alertness and staying dialed-in all day.",
    type: "Adaptogen",
    order: 2,
  },
  {
    name: "Cinnamon",
    icon: "🌿",
    imageUrl: "/images/ingredients/cinnamon.jpg",
    subtitle: "Antioxidant-rich spice",
    description:
      "A cozy, antioxidant-rich spice that helps your body fight off oxidative stress naturally.",
    type: "Adaptogen",
    order: 3,
  },
  {
    name: "Ginger",
    icon: "🫚",
    imageUrl: "/images/ingredients/ginger.jpg",
    subtitle: "Digestive sidekick",
    description:
      "Your digestive sidekick, perfect for soothing the stomach and keeping things moving smoothly.",
    type: "Adaptogen",
    order: 4,
  },
  {
    name: "Ashwagandha",
    icon: "🪷",
    imageUrl: "/images/ingredients/ashwagandha.jpg",
    subtitle: "Chill-inducing adaptogen",
    description:
      "A chill-inducing adaptogen that helps your body master stress and find its balance.",
    type: "Adaptogen",
    order: 5,
  },
  {
    name: "Maca",
    icon: "🥔",
    imageUrl: "/images/ingredients/maca.jpg",
    subtitle: "Energy-boosting root",
    description:
      "An ancient energy-boosting root known for naturally supporting a healthy, vibrant libido.",
    type: "Adaptogen",
    order: 6,
  },
  {
    name: "Orange",
    icon: "🍊",
    imageUrl: "/images/ingredients/orange.jpg",
    subtitle: "Vitamin C powerhouse",
    description:
      "A zesty Vitamin C powerhouse for bright skin and a resilient immune system.",
    type: "Fruit",
    order: 7,
  },
  {
    name: "Lime",
    icon: "🍋",
    imageUrl: "/images/ingredients/lime.jpg",
    subtitle: "Balance stomach acidity",
    description:
      "Refreshing citrus that helps balance stomach acidity for a happy, alkalized gut environment.",
    type: "Fruit",
    order: 8,
  },
  {
    name: "Cocoa",
    icon: "🍫",
    imageUrl: "/images/ingredients/cocoa.jpg",
    subtitle: "Heart health & mood",
    description:
      "Deliciously dark and packed with antioxidants for heart health and major mood boosts.",
    type: "Adaptogen",
    order: 9,
  },
  {
    name: "Tea",
    icon: "🍵",
    imageUrl: "/images/ingredients/tea.jpg",
    subtitle: "Steady caffeine lift",
    description:
      "Provides a gentle, steady caffeine lift for focused energy without the jittery crash.",
    type: "Adaptogen",
    order: 10,
  },
  {
    name: "Cranberry",
    icon: "🫐",
    imageUrl: "/images/ingredients/cranberry.jpg",
    subtitle: "Urinary health",
    description:
      "Tart and tiny antioxidant bombs that support urinary health and overall body wellness.",
    type: "Fruit",
    order: 11,
  },
];

async function main() {
  console.log("Start seeding production database...");

  // Delete products that are no longer in the seed data
  const productsToRemove = ["tropical-twist", "berry-bliss", "citrus-splash"];
  for (const productId of productsToRemove) {
    try {
      await prisma.product.deleteMany({
        where: { id: productId },
      });
      console.log(`Deleted product with id: ${productId}`);
    } catch (_error) {
      // Product might not exist, that's okay
      console.log(`Product ${productId} not found or already deleted`);
    }
  }

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
        nutritionFacts: product.nutritionFacts,
      },
      create: product,
    });
    console.log(`Created/Updated product with id: ${result.id}`);
  }

  for (const ingredient of ingredients) {
    const result = await prisma.ingredient.upsert({
      where: { name: ingredient.name },
      update: {
        icon: ingredient.icon,
        imageUrl: ingredient.imageUrl,
        subtitle: ingredient.subtitle,
        description: ingredient.description,
        type: ingredient.type,
        order: ingredient.order,
      },
      create: ingredient,
    });
    console.log(`Created/Updated ingredient: ${result.name}`);
  }

  console.log("Production seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });