import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid rgba(69, 21, 21, 0.2);
  border-top: 2px solid #451515;
  border-radius: 50%;
  animation: ${spin} 1.5s linear infinite;
  flex-shrink: 0;
`;

export const UploadingText = styled.p`
  color: #451515;
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
`;

export const ProgressBarContainer = styled.div`
  width: 80%;
  max-width: 160px;
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

export const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

export const ImageWrapper = styled.div<{ $isUploading?: boolean }>`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.currentSemantic.border};
  opacity: ${({ $isUploading }) => ($isUploading ? 0.8 : 1)};
  transition: opacity 0.2s ease;
`;

export const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(1px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 10;
  border-radius: ${({ theme }) => theme.radii.lg};
`;

export const RemoveButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.semantic.danger};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.semantic.dangerDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DropzoneWrapper = styled.div<{ $isUploading?: boolean }>`
  opacity: ${({ $isUploading }) => ($isUploading ? 0.6 : 1)};
  pointer-events: ${({ $isUploading }) => ($isUploading ? "none" : "auto")};
  width: 100%;
  transition: all 0.3s ease;
  position: relative;

  /* Ensure file inputs are accessible */
  & input[type="file"] {
    pointer-events: auto !important;
    cursor: pointer !important;
  }

  /* Target the UploadDropzone root container */
  & > div {
    width: 100% !important;
    transition: all 0.3s ease !important;
    border-radius: ${({ theme }) => theme.radii.lg} !important;
    overflow: visible !important;
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    pointer-events: auto !important;
  }

  /* Ensure no overflow or clipping and center all nested divs */
  & > div,
  & > div > div {
    overflow: visible !important;
    max-width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    pointer-events: auto !important;
  }

  /* Fix text wrapping - target all text elements and center them */
  & [data-ut-element="label"],
  & [data-ut-element="allowed-content"],
  & [data-ut-element="upload-icon"],
  & [data-ut-element="button"],
  & p,
  & span {
    width: 100% !important;
    max-width: 100% !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    white-space: normal !important;
    text-align: center !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  /* Center the button specifically and ensure it's clickable */
  & [data-ut-element="button"],
  & button {
    display: block !important;
    margin-left: auto !important;
    margin-right: auto !important;
    pointer-events: auto !important;
    cursor: pointer !important;
    position: relative !important;
    z-index: 10 !important;
  }

  /* Ensure labels and file inputs are clickable */
  & label {
    cursor: pointer !important;
    pointer-events: auto !important;
    position: relative !important;
    z-index: 10 !important;
  }

  /* Center the icon */
  & [data-ut-element="upload-icon"],
  & svg {
    display: block !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  /* Hover effect */
  &:hover:not([data-uploading="true"]) {
    & > div {
      border-color: ${({ theme }) => theme.semantic.primary} !important;
      background-color: ${({ theme }) =>
        theme.currentSemantic.backgroundSecondary} !important;
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.lg} !important;
    }

    & [data-ut-element="button"] {
      background-color: ${({ theme }) =>
        theme.colors.chocolateKisses.dark} !important;
      transform: scale(1.02);
    }
  }

  /* Active/dragging state */
  &[data-dragging="true"] {
    & > div {
      border-color: ${({ theme }) => theme.semantic.primary} !important;
      background-color: ${({ theme }) => theme.semantic.primary}10 !important;
      border-width: 3px !important;
      border-style: solid !important;
    }
  }

  /* Uploading state */
  &[data-uploading="true"] {
    cursor: wait;
  }
`;
