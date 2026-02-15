import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.currentSemantic.background};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: ${({ theme }) => theme.currentSemantic.card};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing["2xl"]};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      padding: ${theme.spacing["3xl"]};
    }
  `}
`;

export const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

export const Logo = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  margin: 0;
  font-family: "Poppins", sans-serif;
`;

export const Tagline = styled.p`
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.currentSemantic.foreground};
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.semantic.danger : theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.currentSemantic.background};
  color: ${({ theme }) => theme.currentSemantic.foreground};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.semantic.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.semantic.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  }
`;

export const FieldError = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.semantic.danger};
`;

export const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.semantic.danger}15;
  border: 1px solid ${({ theme }) => theme.semantic.danger};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.semantic.danger};
  font-size: 0.875rem;
  text-align: center;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.chocolateKisses.base};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

export const FooterText = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
`;

export const OAuthButton = styled.button<{ $provider: "google" }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.currentSemantic.background};
  color: ${({ theme }) => theme.currentSemantic.foreground};
  border: 2px solid ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.currentSemantic.backgroundHover};
    border-color: ${({ theme }) => theme.currentSemantic.borderHover};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.currentSemantic.border};
`;

export const DividerText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
