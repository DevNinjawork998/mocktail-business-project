"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import * as S from "./ImageUpload.styles";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  endpoint: "productImage" | "ingredientImage";
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  endpoint,
  label = "Image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleRemove = () => {
    onChange("");
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
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
        <S.DropzoneWrapper
          $isUploading={isUploading}
          data-uploading={isUploading}
          data-dragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <UploadDropzone
            endpoint={endpoint}
            appearance={{
              container: {
                width: "100%",
                minHeight: "200px",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                overflow: "visible",
              },
              uploadIcon: {
                width: "48px",
                height: "48px",
                color: "#451515",
                margin: "0 auto",
                display: "block",
              },
              label: {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#451515",
                textAlign: "center",
                width: "100%",
                maxWidth: "100%",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                padding: "0 0.5rem",
                margin: "0 auto",
                display: "block",
              },
              allowedContent: {
                fontSize: "0.75rem",
                color: "rgba(69, 21, 21, 0.7)",
                textAlign: "center",
                width: "100%",
                maxWidth: "100%",
                marginTop: "0.5rem",
                marginLeft: "auto",
                marginRight: "auto",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                padding: "0 0.5rem",
                display: "block",
              },
              button: {
                marginTop: "0.75rem",
                marginLeft: "auto",
                marginRight: "auto",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#451515",
                color: "white",
                borderRadius: "0.5rem",
                fontWeight: 500,
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                display: "block",
              },
            }}
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              setIsUploading(false);
              if (res?.[0]?.url) {
                onChange(res[0].url);
              }
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              console.error("Upload error:", error);
              alert(`Upload failed: ${error.message}`);
            }}
          />
        </S.DropzoneWrapper>
      )}
    </S.Container>
  );
}
