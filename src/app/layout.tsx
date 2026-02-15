import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/theme/theme-provider";
import { StyledThemeWrapper } from "@/theme/styled-theme-provider";
import StyledComponentsRegistry from "./lib/registry";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/contexts/CartContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StructuredData from "@/components/StructuredData/StructuredData";

export const metadata: Metadata = {
  title: "Mocktails On The Go - Malaysia's 1st Ever Adaptogenic Mocktails",
  description:
    "Mocktails On The Go - Malaysia's 1st ever adaptogenic mocktails. 100% Halal Ingredients 0% Alcohol",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Mocktails On The Go - Malaysia's 1st Ever Adaptogenic Mocktails",
    description:
      "Malaysia's 1st ever adaptogenic mocktails. 100% Halal Ingredients 0% Alcohol",
    url: "https://mocktailsonthego.com",
    siteName: "Mocktails On The Go",
    images: [
      {
        url: "https://mocktailsonthego.com/images/motg-logo.png",
        width: 512,
        height: 512,
        alt: "Mocktails On The Go Logo",
      },
    ],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mocktails On The Go - Malaysia's 1st Ever Adaptogenic Mocktails",
    description:
      "Malaysia's 1st ever adaptogenic mocktails. 100% Halal Ingredients 0% Alcohol",
    images: ["https://mocktailsonthego.com/images/motg-logo.png"],
  },
  verification: {
    google: "NCiw_EkhS8vfwJG6nu_cuQo-s1ROyOicPo5w-pKPpBM",
  },
  metadataBase: new URL("https://mocktailsonthego.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Structured Data for Organization Logo - Google uses this for site logo in search results */}
        <StructuredData />
        <StyledComponentsRegistry>
          <ThemeProvider>
            <StyledThemeWrapper>
              <CartProvider>
                {children}
                <Analytics debug={true} />
                <SpeedInsights />
              </CartProvider>
            </StyledThemeWrapper>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
