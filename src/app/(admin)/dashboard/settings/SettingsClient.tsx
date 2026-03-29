"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { setLandingHeroSlideUrls } from "@/app/actions/settings";
import * as S from "./SettingsClient.styles";
import { DEFAULT_FOUNDER_STORY, FounderStoryData } from "@/types/founder";
import FounderStorySettings from "./FounderStorySettings";

interface SettingsClientProps {
  initialLandingSlideUrls: string[];
  initialFounderStory?: FounderStoryData;
}

export default function SettingsClient({
  initialLandingSlideUrls,
  initialFounderStory = DEFAULT_FOUNDER_STORY,
}: SettingsClientProps) {
  const router = useRouter();
  const [slideUrls, setSlideUrls] = useState<string[]>(
    initialLandingSlideUrls,
  );
  const [addSlotKey, setAddSlotKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  useEffect(() => {
    setSlideUrls(initialLandingSlideUrls);
  }, [initialLandingSlideUrls]);

  const isDirty =
    JSON.stringify(slideUrls) !== JSON.stringify(initialLandingSlideUrls);

  const handleAddUpload = (url: string): void => {
    if (!url.trim()) {
      return;
    }
    setSlideUrls((prev) => [...prev, url]);
    setAddSlotKey((k) => k + 1);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async (): Promise<void> => {
    if (slideUrls.length === 0) {
      setError("Add at least one hero image, or remove all with Remove all.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await setLandingHeroSlideUrls(slideUrls);
      if (result.success) {
        setSuccess("Landing hero images saved successfully!");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to save landing hero images");
      console.error("Error saving landing hero slides:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAt = async (index: number): Promise<void> => {
    const next = slideUrls.filter((_, i) => i !== index);
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await setLandingHeroSlideUrls(next);
      if (result.success) {
        setSlideUrls(next);
        setSuccess(
          next.length === 0
            ? "All landing hero images removed."
            : "Image removed.",
        );
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to remove image");
      console.error("Error removing slide:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAll = async (): Promise<void> => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await setLandingHeroSlideUrls([]);
      if (result.success) {
        setSlideUrls([]);
        setSuccess("All landing hero images removed.");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to remove images");
      console.error("Error removing all slides:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <S.Container>
      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>Landing hero images</S.SectionTitle>
          <S.SectionDescription>
            Upload multiple photos for the homepage hero. They rotate
            automatically for visitors. Save after adding new images; remove
            deletes the file from storage when you confirm.
          </S.SectionDescription>
        </S.SectionHeader>

        <S.FormSection>
          {slideUrls.length > 0 ? (
            <S.SlidesGrid>
              {slideUrls.map((url, index) => (
                <S.SlideCard key={`${url}-${index}`}>
                  <S.SlideIndex>{index + 1}</S.SlideIndex>
                  <S.SlideThumb>
                    <Image
                      src={url}
                      alt={`Hero slide ${index + 1}`}
                      fill
                      sizes="140px"
                      style={{ objectFit: "cover" }}
                    />
                  </S.SlideThumb>
                  <S.SlideRemoveButton
                    type="button"
                    onClick={() => {
                      void handleRemoveAt(index);
                    }}
                    disabled={isSaving}
                    aria-label={`Remove hero image ${index + 1}`}
                  >
                    Remove
                  </S.SlideRemoveButton>
                </S.SlideCard>
              ))}
            </S.SlidesGrid>
          ) : (
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              No hero images yet. Add a photo below.
            </p>
          )}

          <S.AddPhotoSection>
            <ImageUpload
              key={addSlotKey}
              onChange={handleAddUpload}
              onUploadStart={() => setIsImageUploading(true)}
              onUploadComplete={() => setIsImageUploading(false)}
              endpoint="landingPhoto"
              label="Add photo"
            />
          </S.AddPhotoSection>

          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
          {success && <S.SuccessMessage>{success}</S.SuccessMessage>}

          <S.ButtonGroup>
            <S.SaveButton
              type="button"
              onClick={() => {
                void handleSave();
              }}
              disabled={
                isSaving ||
                isImageUploading ||
                !isDirty ||
                slideUrls.length === 0
              }
            >
              {isSaving ? "Saving hero..." : "Save hero images"}
            </S.SaveButton>
            {slideUrls.length > 0 && (
              <S.RemoveButton
                type="button"
                onClick={() => {
                  void handleRemoveAll();
                }}
                disabled={isSaving}
              >
                Remove all
              </S.RemoveButton>
            )}
          </S.ButtonGroup>
        </S.FormSection>
      </S.Section>

      <FounderStorySettings initialData={initialFounderStory} />
    </S.Container>
  );
}
