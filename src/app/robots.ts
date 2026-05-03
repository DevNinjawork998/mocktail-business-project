import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/checkout",
          "/success",
          "/(admin)/",
          "/(auth)/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://mocktailsonthego.com/sitemap.xml",
  };
}
