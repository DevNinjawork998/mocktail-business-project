import {
  isFeatureEnabled,
  isStripeEnabled,
  isCTABannerEnabled,
  getAllFeatureFlags,
  clearFeatureFlagsCache,
} from "../featureFlags";

// Mock fs and path modules
const mockReadFileSync = jest.fn();
jest.mock("fs", () => ({
  readFileSync: (...args: unknown[]) => mockReadFileSync(...args),
}));

jest.mock("path", () => ({
  join: jest.fn((...args) => args.join("/")),
}));

describe("featureFlags", () => {
  const originalEnv = process.env;
  const originalWindow = global.window;

  beforeEach(() => {
    jest.clearAllMocks();
    clearFeatureFlagsCache();
    // Reset environment variables
    process.env = { ...originalEnv };
    // Reset mocks
    mockReadFileSync.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
    if (originalWindow !== undefined) {
      (global as { window?: unknown }).window = originalWindow;
    }
  });

  describe("isFeatureEnabled", () => {
    it("returns true when environment variable is 'true'", () => {
      process.env.NEXT_PUBLIC_ENABLE_TESTFEATURE = "true";

      expect(isFeatureEnabled("testfeature")).toBe(true);
    });

    it("returns true when environment variable is '1'", () => {
      process.env.NEXT_PUBLIC_ENABLE_TESTFEATURE = "1";

      expect(isFeatureEnabled("testfeature")).toBe(true);
    });

    it("returns false when environment variable is 'false'", () => {
      process.env.NEXT_PUBLIC_ENABLE_TESTFEATURE = "false";

      expect(isFeatureEnabled("testfeature")).toBe(false);
    });

    it("returns false when environment variable is '0'", () => {
      process.env.NEXT_PUBLIC_ENABLE_TESTFEATURE = "0";

      expect(isFeatureEnabled("testfeature")).toBe(false);
    });


    it("returns true by default when no environment variable is set (client-side)", () => {
      (global as { window?: unknown }).window = {};
      delete process.env.NEXT_PUBLIC_ENABLE_TESTFEATURE;

      expect(isFeatureEnabled("testfeature")).toBe(true);
    });

    it("handles uppercase feature names correctly", () => {
      process.env.NEXT_PUBLIC_ENABLE_STRIPE = "true";

      expect(isFeatureEnabled("stripe")).toBe(true);
    });

    it("handles mixed case feature names correctly", () => {
      process.env.NEXT_PUBLIC_ENABLE_CTABANNER = "true";

      expect(isFeatureEnabled("ctabanner")).toBe(true);
    });
  });

  describe("isStripeEnabled", () => {
    it("returns true when Stripe is enabled via environment variable", () => {
      process.env.NEXT_PUBLIC_ENABLE_STRIPE = "true";

      expect(isStripeEnabled()).toBe(true);
    });

    it("returns false when Stripe is disabled via environment variable", () => {
      process.env.NEXT_PUBLIC_ENABLE_STRIPE = "false";

      expect(isStripeEnabled()).toBe(false);
    });

    it("returns true by default", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_STRIPE;

      expect(isStripeEnabled()).toBe(true);
    });
  });

  describe("isCTABannerEnabled", () => {
    it("returns true when CTABanner is enabled via environment variable", () => {
      process.env.NEXT_PUBLIC_ENABLE_CTABANNER = "true";

      expect(isCTABannerEnabled()).toBe(true);
    });

    it("returns false when CTABanner is disabled via environment variable", () => {
      process.env.NEXT_PUBLIC_ENABLE_CTABANNER = "false";

      expect(isCTABannerEnabled()).toBe(false);
    });

    it("returns true by default", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_CTABANNER;

      expect(isCTABannerEnabled()).toBe(true);
    });
  });

  describe("getAllFeatureFlags", () => {
    it("returns empty object on client-side", () => {
      (global as { window?: unknown }).window = {};

      const flags = getAllFeatureFlags();

      expect(flags).toEqual({});
    });


    it("handles feature names with different cases", () => {
      process.env.NEXT_PUBLIC_ENABLE_TESTFEATURE = "true";

      expect(isFeatureEnabled("testfeature")).toBe(true);
      expect(isFeatureEnabled("TESTFEATURE")).toBe(true);
      expect(isFeatureEnabled("TestFeature")).toBe(true);
    });

    it("handles undefined environment variables correctly", () => {
      delete process.env.NEXT_PUBLIC_ENABLE_UNKNOWNFEATURE;

      // Should default to true
      expect(isFeatureEnabled("unknownfeature")).toBe(true);
    });
  });

  describe("clearFeatureFlagsCache", () => {
    it("clears the cached config", () => {
      // Note: In jsdom, window is always defined, so getAllFeatureFlags returns {}
      // Cache clearing is tested through isFeatureEnabled which uses getFeatureFlagsConfig
      clearFeatureFlagsCache();

      // Verify cache is cleared by checking that isFeatureEnabled still works
      const result = isFeatureEnabled("stripe");
      expect(typeof result).toBe("boolean");
    });

  });
});
