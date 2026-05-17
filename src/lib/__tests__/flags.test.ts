import { stripeFlag, cartFlag, ctaBannerFlag } from "@/flags";

// flags/next and @flags-sdk/vercel are mocked globally in jest.setup.js
// The adapter returns undefined in tests (no dashboard/cookie). Pages apply
// ?? true so the UI defaults to showing features when no value is configured.

describe("feature flags — keys and default values", () => {
  it("stripeFlag has key 'stripe'", () => {
    expect(stripeFlag.key).toBe("stripe");
  });

  it("cartFlag has key 'cart'", () => {
    expect(cartFlag.key).toBe("cart");
  });

  it("ctaBannerFlag has key 'ctabanner'", () => {
    expect(ctaBannerFlag.key).toBe("ctabanner");
  });

  it("flags return undefined when adapter has no value (pages fall back to ?? true)", async () => {
    await expect(stripeFlag()).resolves.toBeUndefined();
    await expect(cartFlag()).resolves.toBeUndefined();
    await expect(ctaBannerFlag()).resolves.toBeUndefined();
  });
});
