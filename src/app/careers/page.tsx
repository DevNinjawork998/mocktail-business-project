import type { Metadata } from "next";
import CareersPageClient from "./CareersPageClient";

export const metadata: Metadata = {
  title: "Careers | Mocktails On The Go",
  description:
    "Join the Mocktails On The Go team. Explore career opportunities at Malaysia's 1st adaptogenic mocktail brand.",
  alternates: { canonical: "https://mocktailsonthego.com/careers" },
  openGraph: {
    title: "Careers | Mocktails On The Go",
    description:
      "Join the Mocktails On The Go team. Explore career opportunities at Malaysia's 1st adaptogenic mocktail brand.",
    url: "https://mocktailsonthego.com/careers",
  },
};

export default function CareersPage() {
  return <CareersPageClient />;
}
