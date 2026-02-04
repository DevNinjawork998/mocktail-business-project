"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import {
  updateLandingPhotoUrl,
  removeLandingPhoto,
} from "@/app/actions/settings";
import * as S from "./SettingsClient.styles";

interface SettingsClientProps {
  initialLandingPhotoUrl: string | null;
}

export default function SettingsClient({
  initialLandingPhotoUrl,
}: SettingsClientProps) {
  const router = useRouter();
  const [landingPhotoUrl, setLandingPhotoUrl] = useState<string | null>(
    initialLandingPhotoUrl,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const handleImageChange = (url: string) => {
    setLandingPhotoUrl(url || null);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!landingPhotoUrl) {
      setError("Please upload a landing photo");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateLandingPhotoUrl(landingPhotoUrl);
      if (result.success) {
        setSuccess("Landing photo updated successfully!");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to save landing photo");
      console.error("Error saving landing photo:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await removeLandingPhoto();
      if (result.success) {
        setLandingPhotoUrl(null);
        setSuccess("Landing photo removed successfully!");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to remove landing photo");
      console.error("Error removing landing photo:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <S.Container>
      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>Landing Photo</S.SectionTitle>
          <S.SectionDescription>
            Upload or change the hero image displayed on the homepage
          </S.SectionDescription>
        </S.SectionHeader>

        <S.FormSection>
          <ImageUpload
            value={landingPhotoUrl || undefined}
            onChange={handleImageChange}
            onUploadStart={() => setIsImageUploading(true)}
            onUploadComplete={() => setIsImageUploading(false)}
            endpoint="landingPhoto"
            label="Landing Photo"
          />

          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
          {success && <S.SuccessMessage>{success}</S.SuccessMessage>}

          <S.ButtonGroup>
            <S.SaveButton
              type="button"
              onClick={handleSave}
              disabled={isSaving || isImageUploading || !landingPhotoUrl}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </S.SaveButton>
            {landingPhotoUrl && (
              <S.RemoveButton
                type="button"
                onClick={handleRemove}
                disabled={isSaving}
              >
                Remove Photo
              </S.RemoveButton>
            )}
          </S.ButtonGroup>
        </S.FormSection>
      </S.Section>
    </S.Container>
  );
}
