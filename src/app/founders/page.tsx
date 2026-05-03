import type { Metadata } from "next";
import FoundersPageClient from "./FoundersPageClient";
import { getFounderStory } from "@/app/actions/settings";
import { DEFAULT_FOUNDER_STORY } from "@/types/founder";

export const metadata: Metadata = {
  title: "Meet Our Founders - Cocktail Business",
  description:
    "Learn about the passionate founders behind Mocktails On The Go and their journey to create Malaysia's 1st ever adaptogenic mocktails.",
};

export default async function FoundersPage() {
  const result = await getFounderStory();
  const storyData =
    result.success && result.data ? result.data : DEFAULT_FOUNDER_STORY;

  return <FoundersPageClient storyData={storyData} />;
}
