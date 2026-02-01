import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
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
`;
