import styled from "styled-components";

export const TokenMissingPanel = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.currentSemantic.background};
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.currentSemantic.foreground};
  font-size: 0.9375rem;
  line-height: 1.5;
  text-align: center;
`;

export const ActionsRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;
