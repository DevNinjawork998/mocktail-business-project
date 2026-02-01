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

export const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.currentSemantic.border};
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

  &:hover {
    background-color: ${({ theme }) => theme.semantic.dangerDark};
  }
`;

export const DropzoneWrapper = styled.div<{ $isUploading?: boolean }>`
  opacity: ${({ $isUploading }) => ($isUploading ? 0.6 : 1)};
  pointer-events: ${({ $isUploading }) => ($isUploading ? "none" : "auto")};
  width: 100%;
  transition: all 0.3s ease;
  position: relative;
  
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
  
  /* Center the button specifically */
  & [data-ut-element="button"],
  & button {
    display: block !important;
    margin-left: auto !important;
    margin-right: auto !important;
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
      background-color: ${({ theme }) => theme.currentSemantic.backgroundSecondary} !important;
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.lg} !important;
    }
    
    & [data-ut-element="button"] {
      background-color: ${({ theme }) => theme.colors.chocolateKisses.dark} !important;
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
