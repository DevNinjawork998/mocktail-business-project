/**
 * Cocktail Business Theme Colors
 * Based on the provided color palette
 */

export const colors = {
  // Primary Color Palette with variants
  chocolateKisses: {
    base: "#451515",
    light: "#6B2D2D",
    dark: "#2A0F0F",
  },
  mauvelous: {
    base: "#D4AAB3",
    light: "#E5C4CB",
    dark: "#C3909B",
  },
  caramel: {
    base: "#FAC358",
    light: "#FCDA8A",
    dark: "#F7AC26",
  },
  royalOrange: {
    base: "#DD541C",
    light: "#E87A4A",
    dark: "#C43E0A",
  },
  bittersweetShimmer: {
    base: "#C65F58",
    light: "#D8827B",
    dark: "#B03C35",
  },

  // RGB variants for transparency
  chocolateKissesRgb: "69, 21, 21",
  mauvelousRgb: "212, 170, 179",
  caramelRgb: "250, 195, 88",
  royalOrangeRgb: "221, 84, 28",
  bittersweetShimmerRgb: "198, 95, 88",
} as const;

export const semanticColors = {
  primary: colors.chocolateKisses.base,
  primaryLight: colors.mauvelous.base,
  secondary: colors.royalOrange.base,
  accent: colors.caramel.base,
  danger: colors.bittersweetShimmer.base,
  dangerDark: colors.bittersweetShimmer.dark,

  // Background colors
  background: "#edcfb9",
  backgroundSecondary: "#edcfb9",
  surface: "#edcfb9",
  surfaceHover: "#D4AAB3",

  // Text colors
  text: colors.chocolateKisses.base,
  textSecondary: `rgba(${colors.chocolateKissesRgb}, 0.7)`,
  foreground: colors.chocolateKisses.base,
  foregroundMuted: `rgba(${colors.chocolateKissesRgb}, 0.7)`,
  foregroundLight: `rgba(${colors.chocolateKissesRgb}, 0.5)`,

  // Border colors
  border: `rgba(${colors.chocolateKissesRgb}, 0.2)`,
  borderLight: `rgba(${colors.chocolateKissesRgb}, 0.1)`,

  // Shadow
  shadow: `rgba(${colors.chocolateKissesRgb}, 0.1)`,
} as const;

export const darkModeColors = {
  background: "#1a1a1a",
  backgroundSecondary: "#2a2a2a",
  surface: "#2a2a2a",
  surfaceHover: "#3a3a3a",
  text: colors.caramel.base,
  textSecondary: `rgba(${colors.caramelRgb}, 0.8)`,
  foreground: colors.caramel.base,
  foregroundMuted: `rgba(${colors.caramelRgb}, 0.8)`,
  foregroundLight: `rgba(${colors.caramelRgb}, 0.6)`,
  border: `rgba(${colors.caramelRgb}, 0.3)`,
  borderLight: `rgba(${colors.caramelRgb}, 0.2)`,
} as const;

export type ColorName = keyof typeof colors;
export type SemanticColorName = keyof typeof semanticColors;

/**
 * Helper function to get color with opacity
 */
export const getColorWithOpacity = (
  colorName: keyof typeof colors,
  opacity: number,
): string => {
  const colorObj = colors[colorName];
  if (typeof colorObj === "object" && "base" in colorObj) {
    // For color objects with base/light/dark variants
    const rgbKey = `${colorName}Rgb` as keyof typeof colors;
    const rgbValue = colors[rgbKey];
    if (typeof rgbValue === "string") {
      return `rgba(${rgbValue}, ${opacity})`;
    }
  }
  return colorObj as string;
};

/**
 * Tailwind CSS class name helpers
 */
export const tailwindColors = {
  text: {
    chocolateKisses: "text-chocolate-kisses",
    mauvelous: "text-mauvelous",
    caramel: "text-caramel",
    royalOrange: "text-royal-orange",
    bittersweetShimmer: "text-bittersweet-shimmer",
  },
  bg: {
    chocolateKisses: "bg-chocolate-kisses",
    mauvelous: "bg-mauvelous",
    caramel: "bg-caramel",
    royalOrange: "bg-royal-orange",
    bittersweetShimmer: "bg-bittersweet-shimmer",
  },
  border: {
    chocolateKisses: "border-chocolate-kisses",
    mauvelous: "border-mauvelous",
    caramel: "border-caramel",
    royalOrange: "border-royal-orange",
    bittersweetShimmer: "border-bittersweet-shimmer",
  },
} as const;
