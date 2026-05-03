import styled from "styled-components";

export {
  Form,
  ErrorMessage,
  ButtonGroup,
  CancelButton,
  SubmitButton,
} from "@/components/ui/AdminFormChrome/AdminFormChrome.styles";
export {
  Section,
  SectionTitle,
} from "@/components/ui/FormSurface/FormSurface.styles";

export const SubsectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.foreground};
  margin: ${({ theme }) => theme.spacing.lg} 0
    ${({ theme }) => theme.spacing.md} 0;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.currentSemantic.border};

  &:first-of-type {
    margin-top: 0;
  }
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
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
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

export const NameInput = styled(Input)`
  font-size: 1.75rem;
  font-weight: 700;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.semantic.primary};
`;

export const SubtitleInput = styled(Input)`
  font-size: 1.25rem;
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.royalOrange.base};
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
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;

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

export const SupportingPhotosContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const SupportingPhotoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;
