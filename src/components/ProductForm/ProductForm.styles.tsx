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
  background-color: white;
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
`;

export const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.semantic.danger : theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 1rem;
  font-family: inherit;
  background-color: ${({ theme }) => theme.currentSemantic.background};
  color: ${({ theme }) => theme.currentSemantic.foreground};
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.semantic.primary};
  }
`;

export const ColorInput = styled.input<{ $hasError?: boolean }>`
  width: 80px;
  height: 50px;
  padding: 0;
  border: 2px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.semantic.danger : theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: scale(1.05);
    border-color: ${({ theme }) => theme.semantic.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.semantic.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.semantic.primary}20;
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

export const ParagraphRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${TextArea} {
    flex: 1;
  }
`;

export const DynamicRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${Input} {
    flex: 1;
  }
`;

export const AddButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  border: 2px dashed ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.semantic.secondary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.semantic.secondary};
    background-color: ${({ theme }) => theme.semantic.secondary}10;
  }
`;

export const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  background-color: ${({ theme }) => theme.semantic.danger};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.semantic.dangerDark};
  }
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
