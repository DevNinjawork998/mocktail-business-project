import "@testing-library/jest-dom";

// Mock Vercel Flags SDK — ESM packages that can't run in jsdom.
// The mock preserves the flag key and runs decide() as the fallback so tests get realistic values.
jest.mock("flags/next", () => ({
  flag: ({ key, decide, description }) => {
    const fn = async () => (decide ? decide() : undefined);
    fn.key = key;
    fn.description = description;
    return fn;
  },
  createFlagsDiscoveryEndpoint: () => async () =>
    new Response(JSON.stringify({}), { status: 200 }),
  getProviderData: () => ({}),
}));

jest.mock("@flags-sdk/vercel", () => ({
  vercelAdapter: () => ({ origin: undefined, decide: undefined }),
}));

// Configure React testing environment for act()
// This tells React that we're in a testing environment that supports act()
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
