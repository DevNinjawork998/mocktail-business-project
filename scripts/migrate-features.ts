import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

config({ path: resolve(__dirname, "../.env") });
config({ path: resolve(__dirname, "../.env.development.local") });
config({ path: resolve(__dirname, "../.env.local"), override: true });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const baseDefaultFeatures = [
  { icon: "🌾", label: "Fiber" },
  { icon: "🌱", label: "Vegan" },
  { icon: "🥥", label: "Plant Powered" },
  { icon: "🚫🌽", label: "GMO Free" },
  { icon: "🍊", label: "Good Vit C" },
  { icon: "⚡", label: "Good Iron" },
  { icon: "🍬", label: "Less Sugar" },
  { icon: "✨", label: "Antioxidant" },
];

const excludedFeatures = [
  "Cocoa",
  "Coffee",
  "Maca",
  "Maca Root",
  "Fresh Orange",
  "Cranberry",
  "Baobab",
  "Ginger",
  "Cinnamon",
  "Ashwagandha",
  "Paleo",
  "Gluten Free",
];

const featureIconMap: Record<string, string> = {
  Antioxidant: "✨",
  Caffeine: "☕",
  Calcium: "🥛",
  Fiber: "🌾",
  "GMO Free": "🚫🌽",
  "Good Iron": "⚡",
  "Good Vit C": "🍊",
  "High Calcium": "🥛",
  "High Fiber": "🌾",
  "Less Sugar": "🍬",
  "Less sugar": "🍬",
  "Plant Powered": "🥥",
  Vegan: "🌱",
};

const normalizeFeatureLabel = (label: string): string => {
  const normalized = label.trim();
  if (/^high\s+fiber$/i.test(normalized)) return "Fiber";
  if (/^high\s+antioxidant$/i.test(normalized)) return "Antioxidant";
  if (/^high\s+calcium$/i.test(normalized)) return "Calcium";
  if (/^good\s+fiber$/i.test(normalized)) return "Fiber";
  if (/^good\s+antioxidant$/i.test(normalized)) return "Antioxidant";
  if (normalized === "Less sugar" || normalized === "Less Sugar")
    return "Less Sugar";
  return normalized;
};

async function run() {
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    const ingredients = (product.ingredients as Array<string | { name: string; emoji?: string }> | null) || [];
    
    // Convert current ingredients to array of strings for checking text
    const ingredientStrings = ingredients.map(ing => typeof ing === "string" ? ing : ing.name);
    
    const hasMilk = ingredientStrings.some((ing) => ing.toLowerCase().includes("milk"));
    const isMacaMartini = product.id === "maca-martini";
    
    const defaultFeatures = baseDefaultFeatures.filter((f) => {
      if (hasMilk && f.label === "Vegan") return false;
      if (isMacaMartini && f.label === "Good Vit C") return false;
      return true;
    });

    const currentFeatures = (product.features as Array<{ text: string; color?: string; icon?: string }>) || [];
    
    const productSpecificFeatures = currentFeatures
      .filter((f) => !excludedFeatures.includes(f.text))
      .map((f) => {
        const normalizedLabel = normalizeFeatureLabel(f.text);
        return {
          icon: f.icon || featureIconMap[normalizedLabel] || featureIconMap[f.text] || "✨",
          text: normalizedLabel,
          color: f.color || "#451515"
        };
      });
      
    const hasProductLessSugar = productSpecificFeatures.some(
      (f) => f.text === "Less Sugar*" || f.text === "Less sugar" || f.text === "Less Sugar"
    );

    const finalDefaultFeatures = hasProductLessSugar
      ? defaultFeatures.filter((f) => f.label !== "Less Sugar")
      : defaultFeatures;

    // Combine default features with product-specific features
    const allComputedFeatures = [...finalDefaultFeatures.map(f => ({ icon: f.icon, text: f.label, color: "#451515" })), ...productSpecificFeatures].filter(
      (feature, index, self) =>
        index === self.findIndex((f) => f.text === feature.text)
    );
    
    console.log(`Updating product ${product.id} (${product.name}) features...`);
    
    await prisma.product.update({
      where: { id: product.id },
      data: {
        features: allComputedFeatures as any,
      }
    });
  }
  
  console.log("Migration complete!");
}

run().catch(console.error).finally(() => prisma.$disconnect());