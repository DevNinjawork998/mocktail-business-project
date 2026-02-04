import styled from "styled-components";

export const Sidebar = styled.aside`
  width: 260px;
  background-color: ${({ theme }) => theme.colors.chocolateKisses.base};
  color: white;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const LogoSection = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Logo = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  font-family: serif;
`;

export const Nav = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const NavItem = styled.div<{ $isActive?: boolean }>`
  a {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md}
      ${({ theme }) => theme.spacing.xl};
    color: ${({ $isActive }) =>
      $isActive ? "white" : "rgba(255, 255, 255, 0.7)"};
    text-decoration: none;
    font-weight: ${({ $isActive }) => ($isActive ? "600" : "400")};
    background-color: ${({ $isActive }) =>
      $isActive ? "rgba(255, 255, 255, 0.1)" : "transparent"};
    border-left: 3px solid
      ${({ $isActive, theme }) =>
        $isActive ? theme.colors.caramel.base : "transparent"};
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
`;

export const NavIcon = styled.span`
  font-size: 1.25rem;
`;

export const UserSection = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const UserInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserRole = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.caramel.base};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const SignOutButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${({ theme }) => theme.radii.md};
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;
