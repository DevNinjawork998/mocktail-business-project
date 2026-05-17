import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

export const stripeFlag = flag<boolean>({
  key: "stripe",
  adapter: vercelAdapter(),
  description: "Enable Stripe payments and checkout flow",
});

export const cartFlag = flag<boolean>({
  key: "cart",
  adapter: vercelAdapter(),
  description: "Show cart icon in navigation and cart menu entry",
});

export const ctaBannerFlag = flag<boolean>({
  key: "ctabanner",
  adapter: vercelAdapter(),
  description: "Show the CTA promotional banner on landing and shop pages",
});
