import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.currentSemantic.background};
  padding-top: 4rem; /* Account for fixed navigation bar */
`;

export const ContentSection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  max-width: 800px;
  margin: 0 auto;
  min-height: 60vh;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-family: "Poppins", sans-serif;
`;

export const Paragraph = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
