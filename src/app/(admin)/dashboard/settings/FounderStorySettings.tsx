"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { setFounderStory } from "@/app/actions/settings";
import { DEFAULT_FOUNDER_STORY, FounderStoryData } from "@/types/founder";
import * as S from "./SettingsClient.styles";

interface FounderStorySettingsProps {
  initialData?: FounderStoryData;
}

export default function FounderStorySettings({
  initialData = DEFAULT_FOUNDER_STORY,
}: FounderStorySettingsProps) {
  const router = useRouter();
  const [data, setData] = useState<FounderStoryData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const isDirty = JSON.stringify(data) !== JSON.stringify(initialData);

  const handleParagraphChange = (index: number, value: string) => {
    const newParagraphs = [...data.paragraphs];
    newParagraphs[index] = value;
    setData({ ...data, paragraphs: newParagraphs });
    setError(null);
    setSuccess(null);
  };

  const addParagraph = () => {
    setData({ ...data, paragraphs: [...data.paragraphs, ""] });
  };

  const removeParagraph = (index: number) => {
    setData({
      ...data,
      paragraphs: data.paragraphs.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = (url: string) => {
    if (!url.trim()) return;
    setData({ ...data, imageUrl: url });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await setFounderStory(data);
      if (result.success) {
        setSuccess("Founder story saved successfully!");
        router.refresh();
      } else {
        setError(result.error || "Failed to save founder story.");
      }
    } catch (err) {
      setError("Failed to save founder story.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <S.Section>
      <S.SectionHeader>
        <S.SectionTitle>Founder Story</S.SectionTitle>
        <S.SectionDescription>
          Update the content and image for the &quot;Meet Our Founder&quot; page.
        </S.SectionDescription>
      </S.SectionHeader>

      <S.FormSection>
        {/* Image */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, fontSize: "0.875rem", color: "#374151" }}>
            Founder Photo
          </label>
          {data.imageUrl ? (
            <S.SlideCard style={{ maxWidth: "200px" }}>
              <S.SlideThumb>
                <Image
                  src={data.imageUrl}
                  alt="Founder"
                  fill
                  sizes="200px"
                  style={{ objectFit: "cover" }}
                />
              </S.SlideThumb>
              <S.SlideRemoveButton
                type="button"
                onClick={() => setData({ ...data, imageUrl: null })}
                disabled={isSaving}
              >
                Remove
              </S.SlideRemoveButton>
            </S.SlideCard>
          ) : (
            <S.AddPhotoSection>
              <ImageUpload
                onChange={handleImageUpload}
                onUploadStart={() => setIsImageUploading(true)}
                onUploadComplete={() => setIsImageUploading(false)}
                endpoint="productImage"
                label="Add photo"
              />
            </S.AddPhotoSection>
          )}
        </div>

        {/* Paragraphs */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, fontSize: "0.875rem", color: "#374151" }}>
            Story Paragraphs
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.paragraphs.map((p, index) => (
              <div key={index} style={{ position: "relative" }}>
                <textarea
                  value={p}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #D1D5DB",
                    fontSize: "0.875rem",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                  placeholder={`Paragraph ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    background: "#FEE2E2",
                    color: "#991B1B",
                    border: "none",
                    borderRadius: "0.25rem",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addParagraph}
              style={{
                alignSelf: "flex-start",
                padding: "0.5rem 1rem",
                background: "#F3F4F6",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              + Add Paragraph
            </button>
          </div>
        </div>

        {/* Quote */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, fontSize: "0.875rem", color: "#374151" }}>
            Quote Text
          </label>
          <input
            type="text"
            value={data.quote}
            onChange={(e) => setData({ ...data, quote: e.target.value })}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid #D1D5DB",
              fontSize: "0.875rem",
            }}
          />
        </div>

        {/* Quote Author */}
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, fontSize: "0.875rem", color: "#374151" }}>
            Quote Author
          </label>
          <input
            type="text"
            value={data.author}
            onChange={(e) => setData({ ...data, author: e.target.value })}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid #D1D5DB",
              fontSize: "0.875rem",
            }}
          />
        </div>

        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        {success && <S.SuccessMessage>{success}</S.SuccessMessage>}

        <S.ButtonGroup>
          <S.SaveButton
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving || isImageUploading || !isDirty}
          >
            {isSaving ? "Saving founder..." : "Save founder story"}
          </S.SaveButton>
        </S.ButtonGroup>
      </S.FormSection>
    </S.Section>
  );
}
