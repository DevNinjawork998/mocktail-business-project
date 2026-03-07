# Favicon Guide – Fully Filled (No White Space)

The owner requested favicons that are **fully filled without white spaces** for Google search results and browser tabs.

## Quick Fix: Regenerate Favicons

If you have an updated logo that should fill the entire icon area:

```bash
npm run favicon:generate
```

This script:

1. **Trims** transparent or uniform-color edges from the source logo
2. **Flattens** any transparency to a solid dark background
3. **Resizes** with "cover" so the image fills the entire square (no padding)

**Source image:** `public/images/motg-logo.png`

To use a different source:

```bash
npx tsx scripts/generate-favicons.ts path/to/your-logo.png
```

## Favicon.ico

The script generates PNG favicons. For `favicon.ico`:

1. Use the new `favicon-32.png` (or any generated PNG)
2. Convert to ICO at [favicon.io](https://favicon.io/favicon-converter/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
3. Replace `public/favicon.ico` with the converted file

## Design Guidelines for "Fully Filled"

For best results in Google and browser tabs:

1. **Fill the canvas** – The design or background should extend to all edges of the square
2. **Avoid transparent edges** – Use a solid background color (e.g. brand dark brown) instead of transparency
3. **No built-in padding** – Design the logo so there’s no intentional margin/padding in the source file

If the source logo has white/transparent padding built in, the script’s `trim` step will remove it. For best quality, provide a logo that already fills its canvas.
