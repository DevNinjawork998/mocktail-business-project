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

const ingredientEmojis: Record<string, string> = {
  Ginger: "🫚",
  Tea: "🍵",
  "Apple Juice": "🍎",
  "Carbonated water": "🫧",
  Cinnamon: "🪵",
  "Star Anise": "🌟",
  Molasses: "🍯",
  Allulose: "🍬",
  Lime: "🍋‍🟩",
  Orange: "🍊",
  "Ashwagandha extract": "🌿",
  "Orange juice": "🍊",
  cranberry: "🍒", // close enough
  peach: "🍑",
  "Cranberry juice": "🍒",
  tea: "🍵",
  "apple juice": "🍎",
  cinnamon: "🪵",
  "star anise": "🌟",
  "carbonated water": "🫧",
  "Oat milk": "🥛",
  "Maca root extract": "🪴",
  Coffee: "☕",
  Cocoa: "🍫",
  "Baobab extract": "🌳",
  "coconut water": "🥥",
};

function getEmoji(name: string) {
  // Case insensitive match
  for (const [key, value] of Object.entries(ingredientEmojis)) {
    if (name.toLowerCase() === key.toLowerCase()) {
      return value;
    }
  }
  return "";
}

async function run() {
  const products = await prisma.product.findMany();

  for (const product of products) {
    const ingredients =
      (product.ingredients as Array<
        string | { name: string; emoji?: string }
      > | null) || [];

    const newIngredients = ingredients.map((ing) => {
      if (typeof ing === "string") {
        return {
          name: ing,
          emoji: getEmoji(ing),
        };
      } else {
        return {
          name: ing.name,
          emoji: ing.emoji || getEmoji(ing.name),
        };
      }
    });

    console.log(
      `Updating product ${product.id} (${product.name}) ingredients...`,
    );

    await prisma.product.update({
      where: { id: product.id },
      data: {
        ingredients: newIngredients as any,
      },
    });
  }

  console.log("Ingredients migration complete!");
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
