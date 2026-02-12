"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import * as S from "./ImageUploadMulti.styles";

interface ImageUploadMultiProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
  endpoint: "productImage" | "ingredientImage" | "landingPhoto";
  label?: string;
}

export default function ImageUploadMulti({
  value = [],
  onChange,
  onUploadStart,
  onUploadComplete,
  endpoint,
  label = "Images",
}: ImageUploadMultiProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use UploadThing hook for auto-upload functionality
  const { startUpload, isUploading: utIsUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setUploadProgress(0);
      onUploadComplete?.();
      if (res && Array.isArray(res)) {
        const newUrls = res
          .map((file) => file?.url)
          .filter((url): url is string => !!url);
        if (newUrls.length > 0) {
          onChange([...value, ...newUrls]);
        }
      } else {
        console.error("Invalid upload response:", res);
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
      onUploadComplete?.();
      alert(`Upload failed: ${error.message}`);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  // Only render on the client to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync upload state
  useEffect(() => {
    setIsUploading(utIsUploading);
    if (utIsUploading) {
      onUploadStart?.();
    }
  }, [utIsUploading, onUploadStart]);

  const handleRemove = (indexToRemove: number) => {
    const newUrls = value.filter((_, index) => index !== indexToRemove);
    onChange(newUrls);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newUrls = [...value];
    const [removed] = newUrls.splice(fromIndex, 1);
    newUrls.splice(toIndex, 0, removed);
    onChange(newUrls);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);
    onUploadStart?.();

    // Start upload immediately
    await startUpload(Array.from(files));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);
    onUploadStart?.();

    // Start upload immediately
    startUpload(Array.from(files));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <S.Container>
      <S.Label>{label}</S.Label>

      {value.length > 0 && (
        <S.ImagesGrid>
          {value.map((url, index) => (
            <S.ImagePreviewWrapper key={`${url}-${index}`}>
              <S.ImageWrapper>
                <Image
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  sizes="150px"
                  style={{ objectFit: "cover" }}
                />
              </S.ImageWrapper>
              <S.ImageActions>
                {index > 0 && (
                  <S.ReorderButton
                    type="button"
                    onClick={() => handleReorder(index, index - 1)}
                    title="Move left"
                  >
                    ←
                  </S.ReorderButton>
                )}
                {index < value.length - 1 && (
                  <S.ReorderButton
                    type="button"
                    onClick={() => handleReorder(index, index + 1)}
                    title="Move right"
                  >
                    →
                  </S.ReorderButton>
                )}
                <S.RemoveButton
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={isUploading}
                  title="Remove image"
                >
                  ×
                </S.RemoveButton>
              </S.ImageActions>
              <S.ImageIndex>{index + 1}</S.ImageIndex>
            </S.ImagePreviewWrapper>
          ))}
        </S.ImagesGrid>
      )}

      {!isMounted ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          Loading upload component...
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <S.DropzoneWrapper
            onClick={handleDropzoneClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            $isUploading={isUploading}
          >
            {isUploading ? (
              <>
                <S.ProgressBarContainer>
                  <S.ProgressBar $progress={uploadProgress} />
                </S.ProgressBarContainer>
                <S.UploadingText>
                  Uploading... {uploadProgress}%
                </S.UploadingText>
              </>
            ) : (
              <>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#451515"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p
                  style={{
                    color: "#451515",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  Choose files or drag and drop
                </p>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  Images (4MB each, up to 10 files)
                </p>
              </>
            )}
          </S.DropzoneWrapper>
        </>
      )}
    </S.Container>
  );
}
