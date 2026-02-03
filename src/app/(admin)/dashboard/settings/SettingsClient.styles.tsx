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
