import { stripeFlag, cartFlag, ctaBannerFlag } from "@/flags";

// flags/next and @flags-sdk/vercel are mocked globally in jest.setup.js

describe("feature flags — keys and default values", () => {
  it("stripeFlag has key 'stripe' and defaults to true", async () => {
    expect(stripeFlag.key).toBe("stripe");
    await expect(stripeFlag()).resolves.toBe(true);
  });

  it("cartFlag has key 'cart' and defaults to true", async () => {
    expect(cartFlag.key).toBe("cart");
    await expect(cartFlag()).resolves.toBe(true);
  });

  it("ctaBannerFlag has key 'ctabanner' and defaults to true", async () => {
    expect(ctaBannerFlag.key).toBe("ctabanner");
    await expect(ctaBannerFlag()).resolves.toBe(true);
  });
});
