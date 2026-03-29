import styled from "styled-components";

export const Form = styled.form`
  max-width: 800px;
  margin: 0 auto;
`;

export const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.semantic.danger}15;
  border: 1px solid ${({ theme }) => theme.semantic.danger};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.semantic.danger};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.currentSemantic.foreground};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.semantic.backgroundSecondary};
  }
`;

export const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.chocolateKisses.base};
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
