import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.currentSemantic.foreground};
`;

export const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ImagePreviewWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.currentSemantic.border};
`;

export const ImageActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: center;
  align-items: center;
`;

export const ReorderButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.currentSemantic.backgroundSecondary};
  color: ${({ theme }) => theme.currentSemantic.foreground};
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.semantic.primary};
    color: white;
    border-color: ${({ theme }) => theme.semantic.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RemoveButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.semantic.danger};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  line-height: 1;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.semantic.dangerDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ImageIndex = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.75rem;
  font-weight: 500;
`;

export const DropzoneWrapper = styled.div<{ $isUploading?: boolean }>`
  width: 100%;
  min-height: 150px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px dashed #d1d5db;
  background-color: ${({ $isUploading }) =>
    $isUploading ? "#f3f4f6" : "#f9fafb"};
  cursor: ${({ $isUploading }) => ($isUploading ? "wait" : "pointer")};
  transition: all 0.2s ease;
  position: relative;

  &:hover:not([data-uploading="true"]) {
    border-color: #451515;
    background-color: #f3f4f6;
  }
`;

export const ProgressBarContainer = styled.div`
  width: 80%;
  max-width: 200px;
  height: 8px;
  background-color: rgba(69, 21, 21, 0.15);
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background-color: #451515;
  border-radius: 4px;
  transition: width 0.2s ease-out;
`;

export const UploadingText = styled.p`
  color: #451515;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
`;
