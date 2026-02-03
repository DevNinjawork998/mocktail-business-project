"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import * as S from "./ImageUpload.styles";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUploadStart?: () => void;
  endpoint: "productImage" | "ingredientImage";
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onUploadStart,
  endpoint,
  label = "Image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use UploadThing hook for auto-upload functionality
  const { startUpload, isUploading: utIsUploading } = useUploadThing(
    endpoint,
    {
      onClientUploadComplete: (res) => {
        console.log("Upload complete:", res);
        setIsUploading(false);
        if (res && Array.isArray(res) && res.length > 0 && res[0]?.url) {
          console.log("Setting image URL:", res[0].url);
          onChange(res[0].url);
        } else {
          console.error("Invalid upload response:", res);
        }
      },
      onUploadError: (error: Error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
        alert(`Upload failed: ${error.message}`);
      },
    }
  );

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

  const handleRemove = () => {
    onChange("");
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    console.log("File selected, starting upload:", files[0].name);
    setIsUploading(true);
    onUploadStart?.();

    // Start upload immediately
    const uploadedFiles = await startUpload(Array.from(files));
    console.log("Upload result:", uploadedFiles);
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

    console.log("File dropped, starting upload:", files[0].name);
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

      {value ? (
        <S.PreviewContainer>
          <S.ImageWrapper>
            <Image
              src={value}
              alt="Uploaded image"
              fill
              sizes="200px"
              style={{ objectFit: "cover" }}
            />
          </S.ImageWrapper>
          <S.RemoveButton type="button" onClick={handleRemove}>
            Remove Image
          </S.RemoveButton>
        </S.PreviewContainer>
      ) : (
        <>
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
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <S.DropzoneWrapper
                onClick={handleDropzoneClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                $isUploading={isUploading}
                style={{
                  width: "100%",
                  minHeight: "200px",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  borderRadius: "12px",
                  border: "2px dashed #d1d5db",
                  backgroundColor: isUploading ? "#f3f4f6" : "#f9fafb",
                  cursor: isUploading ? "wait" : "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                {isUploading ? (
                  <>
                    <S.Spinner />
                    <S.UploadingText>Uploading...</S.UploadingText>
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
                      Choose a file or drag and drop
                    </p>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      Image (4MB)
                    </p>
                  </>
                )}
              </S.DropzoneWrapper>
            </>
          )}
        </>
      )}
    </S.Container>
  );
}
