import type { Metadata } from "next";
import FoundersPageClient from "./FoundersPageClient";

export const metadata: Metadata = {
  title: "Meet Our Founders - Cocktail Business",
  description:
    "Learn about the passionate founders behind Mocktails On The Go and their journey to create Malaysia's 1st ever adaptogenic mocktails.",
};

export default function FoundersPage() {
  return <FoundersPageClient />;
}
