import type { Metadata } from "next";
import PrivacyPageClient from "./PrivacyPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Mocktails On The Go",
  description:
    "Read the Mocktails On The Go privacy policy to understand how we collect, use, and protect your personal information.",
  alternates: { canonical: "https://mocktailsonthego.com/privacy" },
  robots: { index: true, follow: false },
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
