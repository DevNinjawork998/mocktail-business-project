// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/__tests__/test-utils.tsx",
  ],
  // Use v8 coverage provider to avoid conflicts with Next.js require hook and Istanbul
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/*.styles.{js,jsx,ts,tsx}",
    // Exclude re-export index files
    "!src/**/index.ts",
    // Exclude infrastructure files
    "!src/lib/prisma.ts",
    "!src/theme/index.ts",
    "!src/theme/*-provider.tsx",
    "!src/theme/styled-theme-provider.tsx",
    "!src/theme/theme-provider.tsx",
    // Exclude Next.js app router files that cause coverage instrumentation issues
    "!src/app/**/page.{ts,tsx}",
    "!src/app/**/layout.{ts,tsx}",
    "!src/app/**/error.{ts,tsx}",
    "!src/app/**/not-found.{ts,tsx}",
    "!src/app/**/loading.{ts,tsx}",
    "!src/app/**/route.{ts,tsx}",
    "!src/app/**/template.{ts,tsx}",
    "!src/app/**/default.{ts,tsx}",
    // Exclude Next.js API routes
    "!src/app/api/**/*.{ts,tsx}",
    // Exclude Next.js lib files that use server-side features
    "!src/app/lib/**/*.{ts,tsx}",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/coverage/",
    // Ignore Next.js app router files that conflict with coverage instrumentation
    "/src/app/.*/page\\.(ts|tsx)$",
    "/src/app/.*/layout\\.(ts|tsx)$",
    "/src/app/.*/error\\.(ts|tsx)$",
    "/src/app/.*/not-found\\.(ts|tsx)$",
    "/src/app/.*/loading\\.(ts|tsx)$",
    "/src/app/.*/route\\.(ts|tsx)$",
    "/src/app/api/",
    "/src/app/lib/",
  ],
  // Coverage thresholds temporarily disabled
  // Uncomment and adjust when ready to enforce coverage requirements
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
