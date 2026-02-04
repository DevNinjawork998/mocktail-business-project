/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cocktail Business Theme Colors
        "chocolate-kisses": {
          DEFAULT: "#451515",
          light: "#6B2D2D",
          dark: "#2A0F0F",
        },
        mauvelous: {
          DEFAULT: "#D4AAB3",
          light: "#E5C4CB",
          dark: "#C3909B",
        },
        caramel: {
          DEFAULT: "#FAC358",
          light: "#FCDA8A",
          dark: "#F7AC26",
        },
        "royal-orange": {
          DEFAULT: "#DD541C",
          light: "#E87A4A",
          dark: "#C43E0A",
        },
        "bittersweet-shimmer": {
          DEFAULT: "#C65F58",
          light: "#D8827B",
          dark: "#B03C35",
        },
        // Semantic colors
        primary: "#451515",
        "primary-light": "#D4AAB3",
        secondary: "#DD541C",
        accent: "#FAC358",
        danger: "#C65F58",
        // Background colors
        background: "#edcfb9",
        "background-secondary": "#edcfb9",
        surface: "#edcfb9",
        "surface-hover": "#D4AAB3",
        // Text colors
        foreground: "#451515",
        "foreground-muted": "rgba(69, 21, 21, 0.7)",
        "foreground-light": "rgba(69, 21, 21, 0.5)",
        // Border colors
        border: "rgba(69, 21, 21, 0.2)",
        "border-light": "rgba(69, 21, 21, 0.1)",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      lineHeight: {
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
      },
      boxShadow: {
        theme:
          "0 1px 3px 0 rgba(69, 21, 21, 0.1), 0 1px 2px 0 rgba(69, 21, 21, 0.06)",
        "theme-lg":
          "0 10px 15px -3px rgba(69, 21, 21, 0.1), 0 4px 6px -2px rgba(69, 21, 21, 0.05)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
