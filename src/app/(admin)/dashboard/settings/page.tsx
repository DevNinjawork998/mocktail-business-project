import { getLandingPhotoUrl } from "@/app/actions/settings";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings | Admin Dashboard",
};

export default async function SettingsPage() {
  const result = await getLandingPhotoUrl();
  const landingPhotoUrl = result.success ? result.data || null : null;

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
      <SettingsClient initialLandingPhotoUrl={landingPhotoUrl} />
    </div>
  );
}
