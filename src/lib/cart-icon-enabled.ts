import featureFlagsConfig from "@/config/featureFlags.json";

interface FeatureFlagsJson {
  features: {
    cart?: { enabled: boolean };
    [key: string]: { enabled: boolean } | undefined;
  };
}

const config = featureFlagsConfig as FeatureFlagsJson;

/**
 * Whether the navigation cart icon / cart menu link should show.
 * Uses NEXT_PUBLIC_ENABLE_CART and bundled featureFlags.json — same on server and client
 * (no `typeof window` branching), so SSR + hydration stay in sync.
 */
export function isCartIconEnabled(): boolean {
  const env = process.env.NEXT_PUBLIC_ENABLE_CART;
  if (env !== undefined) {
    return env === "true" || env === "1";
  }
  return config.features.cart?.enabled ?? true;
}
