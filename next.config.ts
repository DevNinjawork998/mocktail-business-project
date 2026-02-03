import type { NextConfig } from "next";

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
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ["styled-components"],
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

    return config;
  },
};

export default nextConfig;
