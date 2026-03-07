import nextConfig from "eslint-config-next";
import tseslint from "typescript-eslint";

const eslintConfig = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.nyc_output/**",
      "**/*.lcov",
      "**/prisma/generated/**",
      "**/.eslintcache",
      "**/.cache/**",
      "**/*.log",
      "**/.env",
      "**/.env*.local",
      "**/.vscode/**",
      "**/.idea/**",
      "**/.DS_Store",
      "next-env.d.ts",
      "jest.config.js",
    ],
  },
  ...nextConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
