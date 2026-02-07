import styled from "styled-components";
import { media } from "@/theme/styled-theme";

export const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  text-align: left;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  margin: 0;
  line-height: 1.4;

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
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0;

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
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
`;

export const KeyPoint = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.currentSemantic.text};

  ${media.md} {
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
`;

export const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  font-style: italic;
  margin: 0;
`;
