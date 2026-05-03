import type { Metadata, Viewport } from "next";
import { Poppins, Raleway } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/ui/AppWrapper/AppWrapper";
import StructuredData from "@/components/StructuredData/StructuredData";
import GoogleAdsTag from "@/components/GoogleAdsTag/GoogleAdsTag";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-poppins",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-raleway",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
    card: "summary_large_image",
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
    <html key="mocktails-app-html" lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${raleway.variable}`}>
        <GoogleAdsTag key="google-ads" />
        <StructuredData key="structured-data" />
        <AppWrapper>
          {children}
          <Analytics />
          <SpeedInsights />
        </AppWrapper>
      </body>
    </html>
  );
}
