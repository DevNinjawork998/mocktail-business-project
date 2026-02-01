import styled from "styled-components";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

export const HeaderContent = styled.div``;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  margin: 0;
  font-family: serif;
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const AddButton = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.chocolateKisses.base};
  color: white;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.chocolateKisses.base};
    outline-offset: 2px;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantic.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

export const EmptyText = styled.p`
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Table = styled.table`
  width: 100%;
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-collapse: collapse;
  overflow: hidden;
`;

export const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.semantic.backgroundSecondary};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.currentSemantic.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHead = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.semantic.primary};
`;

export const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  vertical-align: middle;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.semantic.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.semantic.primary};
`;

export const UserDetails = styled.div``;

export const UserName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.semantic.primary};
`;

export const UserEmail = styled.div`
  font-size: 0.75rem;
  /* Use darker color for better contrast - meets WCAG AA (4.5:1) */
  color: ${({ theme }) => theme.semantic.primary};
  opacity: 0.75;
`;

export const RoleBadge = styled.span<{ $role: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${({ theme, $role }) => {
    if ($role === "SUPERADMIN") return theme.colors.chocolateKisses.base;
    if ($role === "ADMIN") return theme.colors.royalOrange.base;
    return theme.semantic.backgroundSecondary;
  }};
  color: ${({ theme, $role }) => {
    // Use white text on dark backgrounds for better contrast (WCAG AA compliant)
    if ($role === "SUPERADMIN") return "#FFFFFF";
    if ($role === "ADMIN") return "#FFFFFF";
    return theme.semantic.primary;
  }};
`;

export const OAuthBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ theme }) => theme.semantic.backgroundSecondary};
  /* Use primary color with sufficient opacity for WCAG AA contrast (4.5:1) */
  color: ${({ theme }) => theme.semantic.primary};
  opacity: 0.85;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EditButton = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.semantic.secondary};
  color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: inline-block;

  &:hover {
    background-color: ${({ theme }) => theme.colors.royalOrange.dark};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.semantic.primary};
    outline-offset: 2px;
  }
`;

export const DeleteButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.semantic.danger};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.semantic.dangerDark};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.semantic.danger};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
