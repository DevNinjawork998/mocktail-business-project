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

export const Section = styled.section`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantic.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  grid-column: ${({ $fullWidth }) => ($fullWidth ? "1 / -1" : "auto")};
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.currentSemantic.foreground};
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.semantic.danger : theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.currentSemantic.background};
  color: ${({ theme }) => theme.currentSemantic.foreground};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.semantic.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.semantic.backgroundSecondary};
  }
`;

export const FieldError = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.semantic.danger};
`;

export const HelpText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
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
