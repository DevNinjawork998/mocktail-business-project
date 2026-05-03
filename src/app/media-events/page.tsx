import type { Metadata } from "next";
import MediaEventsPageClient from "./MediaEventsPageClient";

export const metadata: Metadata = {
  title: "Media & Events | Mocktails On The Go",
  description:
    "Stay up to date with the latest news, media coverage, and events featuring Mocktails On The Go — Malaysia's 1st adaptogenic mocktail brand.",
  alternates: { canonical: "https://mocktailsonthego.com/media-events" },
  openGraph: {
    title: "Media & Events | Mocktails On The Go",
    description:
      "Stay up to date with the latest news, media coverage, and events featuring Mocktails On The Go — Malaysia's 1st adaptogenic mocktail brand.",
    url: "https://mocktailsonthego.com/media-events",
  },
};

export default function MediaEventsPage() {
  return <MediaEventsPageClient />;
}
