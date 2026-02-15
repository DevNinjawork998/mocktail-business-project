import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  margin: 0;
  font-family: "Poppins", sans-serif;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

export const StatCard = styled.div`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const StatIcon = styled.div`
  font-size: 2.5rem;
`;

export const StatContent = styled.div`
  flex: 1;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
`;

export const StatLink = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.semantic.secondary};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const Section = styled.section`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantic.primary};
  margin: 0;
`;

export const ViewAllLink = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.semantic.secondary};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background-color: ${({ theme }) => theme.semantic.backgroundSecondary};
`;

export const ActivityIcon = styled.div`
  font-size: 1.5rem;
`;

export const ActivityContent = styled.div`
  flex: 1;
`;

export const ActivityName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.semantic.primary};
`;

export const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
`;

export const EditLink = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.semantic.secondary};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
`;

export const QuickActions = styled.section`
  background-color: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

export const ActionButton = styled.span<{ $variant: "primary" | "secondary" }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme, $variant }) =>
    $variant === "primary"
      ? theme.colors.chocolateKisses.base
      : theme.semantic.secondary};
  color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme, $variant }) =>
      $variant === "primary"
        ? theme.colors.chocolateKisses.dark
        : theme.colors.royalOrange.dark};
  }
`;
