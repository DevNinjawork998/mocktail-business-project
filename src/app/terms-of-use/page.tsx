import type { Metadata } from "next";
import TermsOfUsePageClient from "./TermsOfUsePageClient";

export const metadata: Metadata = {
  title: "Terms of Use | Mocktails On The Go",
  description:
    "Read the Terms of Use for Mocktails On The Go. Understand your rights and responsibilities when using our website and services.",
  alternates: { canonical: "https://mocktailsonthego.com/terms-of-use" },
  robots: { index: true, follow: false },
};

export default function TermsOfUsePage() {
  return <TermsOfUsePageClient />;
}
