import styled from "styled-components";
import { media } from "@/theme/styled-theme";

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  min-width: 0;
  text-align: left;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  margin: 0;
  line-height: 1.4;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;

  ${media.md} {
    font-size: 1.375rem;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Paragraph = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0;
  overflow-wrap: break-word;
  word-wrap: break-word;

  ${media.md} {
    font-size: 1.0625rem;
  }
`;

export const KeyPointsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.currentSemantic.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  min-width: 0;
  width: 100%;

  ${media.md} {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const KeyPoint = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.currentSemantic.text};
  min-width: 0;

  ${media.md} {
    gap: ${({ theme }) => theme.spacing.md};
    font-size: 1.0625rem;
  }
`;

export const BulletIcon = styled.span`
  color: ${({ theme }) => theme.colors.chocolateKisses.base};
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 1.2;
  flex-shrink: 0;
  margin-top: 0.15rem;
`;

export const KeyPointText = styled.span`
  flex: 1;
  min-width: 0;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
`;

export const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  font-style: italic;
  margin: 0;
`;
