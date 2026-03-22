import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const SectionHeader = styled.div`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
`;

export const SectionDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #451515;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #5a1a1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const RemoveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 0.875rem;
`;

export const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: 8px;
  font-size: 0.875rem;
`;

export const SlidesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

export const SlideCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  aspect-ratio: 1;
`;

export const SlideThumb = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 120px;
`;

export const SlideRemoveButton = styled.button`
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

  &:hover:not(:disabled) {
    background: #dc2626;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SlideIndex = styled.span`
  position: absolute;
  top: 0.35rem;
  left: 0.35rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: #1f2937;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  z-index: 2;
`;

export const AddPhotoSection = styled.div`
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;
