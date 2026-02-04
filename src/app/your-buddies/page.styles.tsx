import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.currentSemantic.background};
`;

export const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.mauvelous.base} 0%,
    ${({ theme }) => theme.colors.royalOrange.base} 100%
  );
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: white;
`;

export const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-family: serif;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 4rem;
    }
  `}
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.95;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 1.5rem;
    }
  `}
`;

export const ContentSection = styled.section`
  padding: ${({ theme }) => theme.spacing["4xl"]}
    ${({ theme }) => theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-family: serif;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.md}) {
      font-size: 2.5rem;
    }
  `}
`;

export const IntroText = styled.p`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  text-align: center;
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing["3xl"]};
`;
