import { config as loadDotenv } from "dotenv";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import type { NextConfig } from "next";

// Next loads `.env.development.local` over `.env.local` by default. Re-apply `.env.local`
// so full local dev (Docker Postgres, etc.) wins when both files define the same keys.
loadDotenv({ path: resolve(process.cwd(), ".env.local"), override: true });

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "qchbny9v2p.ufs.sh",
        port: "",
        pathname: "/**",
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ["styled-components"],
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      // unsafe-eval is required by Next.js React Fast Refresh in dev mode only
      `script-src 'self'${isDev ? " 'unsafe-eval'" : ""} 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com https://vercel.live https://*.vercel-insights.com https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.stripe.com https://api.stripe.com https://*.utfs.io https://*.ufs.sh https://*.ingest.uploadthing.com https://*.vercel-insights.com https://*.vercel.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
      "frame-src https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com https://vercel.live",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        // Apply security headers to ALL routes (pages, API, static files)
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    // Exclude test files from the build
    config.module.rules.push({
      test: /\.(test|spec)\.(ts|tsx|js|jsx)$/,
      loader: "ignore-loader",
    });

    // Exclude __tests__ directories
    config.module.rules.push({
      test: /__tests__/,
      loader: "ignore-loader",
    });

    // Exclude scripts directory from compilation
    config.module.rules.push({
      test: /scripts\/.*\.ts$/,
      loader: "ignore-loader",
    });

    // @vercel/flags-core imports @vercel/flags-definitions with a dynamic import
    // annotated /* turbopackOptional */ — Turbopack skips it when missing, but
    // webpack does not. scripts/prepare-flags.js generates the package before
    // `next build`, so the alias only applies in local dev (npm run dev) where
    // the package hasn't been generated. flags-core handles the empty module
    // gracefully via its `typeof get !== "function"` guard.
    const flagsDefinitionsExists = existsSync(
      resolve(process.cwd(), "node_modules/@vercel/flags-definitions"),
    );
    if (!flagsDefinitionsExists) {
      config.resolve.alias = {
        ...(config.resolve.alias as Record<string, unknown>),
        "@vercel/flags-definitions": false,
      };
    }

    return config;
  },
};

export default nextConfig;
