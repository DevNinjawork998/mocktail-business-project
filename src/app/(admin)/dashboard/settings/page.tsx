import { getLandingHeroSlideUrls, getFounderStory } from "@/app/actions/settings";
import SettingsClient from "./SettingsClient";
import { DEFAULT_FOUNDER_STORY } from "@/types/founder";

export const metadata = {
  title: "Settings | Admin Dashboard",
};

export default async function SettingsPage() {
  const [result, founderResult] = await Promise.all([
    getLandingHeroSlideUrls(),
    getFounderStory(),
  ]);
  const initialLandingSlideUrls = result.success ? result.data ?? [] : [];
  const initialFounderStory = founderResult.success ? (founderResult.data ?? DEFAULT_FOUNDER_STORY) : DEFAULT_FOUNDER_STORY;

  return (
    <div>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          fontFamily: "serif",
        }}
      >
        Settings
      </h1>
      <SettingsClient 
        initialLandingSlideUrls={initialLandingSlideUrls} 
        initialFounderStory={initialFounderStory}
      />
    </div>
  );
}
