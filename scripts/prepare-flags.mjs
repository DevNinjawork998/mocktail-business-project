// Runs before `next build` to fetch flag definitions from the Vercel dashboard
// and write the synthetic @vercel/flags-definitions package into node_modules.
// Without this, @vercel/flags-core falls back to decide() defaults and ignores
// the dashboard On/Off rules at runtime.
import { prepareFlagsDefinitions } from "@vercel/prepare-flags-definitions";

await prepareFlagsDefinitions({ env: process.env, cwd: process.cwd() }).catch(
  (err) => {
    // Non-fatal: local dev or missing FLAGS key — flags fall back to decide()
    console.warn("[flags] prepareFlagsDefinitions skipped:", err.message);
  },
);
