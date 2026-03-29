import styled from "styled-components";

export const SuccessPanel = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.semantic.primary}12;
  border: 1px solid ${({ theme }) => theme.semantic.primary}40;
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.currentSemantic.foreground};
  font-size: 0.9375rem;
  line-height: 1.5;
  text-align: center;
`;

export const BackRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;
