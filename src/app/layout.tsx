import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/theme/theme-provider";
import { StyledThemeWrapper } from "@/theme/styled-theme-provider";
import StyledComponentsRegistry from "./lib/registry";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/contexts/CartContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Mocktails On The Go - Malaysia's 1st Ever Adaptogenic Mocktails",
  description:
    "Mocktails On The Go - Malaysia's 1st ever adaptogenic mocktails. 100% Halal Ingredients 0% Alcohol",
  icons: {
    icon: "/images/motg-logo.png",
    apple: "/images/motg-logo.png",
  },
  openGraph: {
    title: "Mocktails On The Go - Malaysia's 1st Ever Adaptogenic Mocktails",
    description:
      "Malaysia's 1st ever adaptogenic mocktails. 100% Halal Ingredients 0% Alcohol",
    url: "https://mocktailsonthego.com",
    siteName: "Mocktails On The Go",
    images: [
      {
        url: "/images/motg-logo.png",
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
    images: ["/images/motg-logo.png"],
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
      <body>
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
