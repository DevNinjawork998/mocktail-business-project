import { getLandingHeroSlideUrls } from "@/app/actions/settings";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings | Admin Dashboard",
};

export default async function SettingsPage() {
  const result = await getLandingHeroSlideUrls();
  const initialLandingSlideUrls = result.success ? result.data ?? [] : [];

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
      <SettingsClient initialLandingSlideUrls={initialLandingSlideUrls} />
    </div>
  );
}
