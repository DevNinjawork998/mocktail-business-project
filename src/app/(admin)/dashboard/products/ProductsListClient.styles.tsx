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
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
  background-color: ${({ theme }) => theme.currentSemantic.surface};
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
  background-color: ${({ theme }) => theme.currentSemantic.surface};
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

export const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ProductImage = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

export const ProductImagePlaceholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.semantic.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

export const ProductDetails = styled.div``;

export const ProductName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.semantic.primary};
`;

export const ProductSubtitle = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.currentSemantic.foregroundMuted};
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

  &:hover {
    background-color: ${({ theme }) => theme.colors.royalOrange.dark};
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
