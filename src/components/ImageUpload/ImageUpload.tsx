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

  const handleRemove = () => {
    onChange("");
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
        <S.DropzoneWrapper $isUploading={isUploading}>
          <UploadDropzone
            endpoint={endpoint}
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
