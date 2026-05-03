import styled from "styled-components";

export type FormSurfaceVariant = "form" | "dashboard";

export const Section = styled.section<{ $variant?: FormSurfaceVariant }>`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme, $variant }) =>
    $variant === "dashboard" ? theme.spacing["2xl"] : theme.spacing.xl};
`;

export const SectionTitle = styled.h2<{ $variant?: FormSurfaceVariant }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantic.primary};
  margin: ${({ theme, $variant }) =>
    $variant === "dashboard" ? "0" : `0 0 ${theme.spacing.lg} 0`};
`;
