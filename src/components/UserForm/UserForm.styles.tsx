import styled from "styled-components";

export {
  Form,
  ErrorMessage,
  ButtonGroup,
  CancelButton,
  SubmitButton,
} from "@/components/ui/AdminFormChrome/AdminFormChrome.styles";
export { Section, SectionTitle } from "@/components/ui/FormSurface/FormSurface.styles";

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
