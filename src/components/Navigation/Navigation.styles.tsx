import styled from "styled-components";

// Styled Components
export const NavContainer = styled.nav`
  background-color: ${({ theme }) => theme.colors.royalOrange.base};
  border-bottom: 1px solid ${({ theme }) => theme.currentSemantic.border};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 50;
  transition: all 0.3s ease;
`;

export const NavWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

export const NavContent = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  height: 4rem;

  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.md}) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      grid-template-columns: auto 1fr auto;
    }
  `}
`;

export const DesktopNavLinks = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};

  ${({ theme }) =>
    theme.breakpoints.md &&
    `
    @media (min-width: ${theme.breakpoints.md}) {
      display: flex;
    }
  `}
`;

export const NavLink = styled.div`
  color: white;
  font-weight: 500;
  transition: color 0.2s ease;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.caramel.base};
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  padding: ${({ theme }) => theme.spacing.sm};
  color: white;
  transition: color 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;

  &:hover {
    color: ${({ theme }) => theme.colors.caramel.base};
  }

  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.md}) {
      display: flex;
      align-items: center;
      justify-content: center;
      order: 1;
    }
  `}

  ${({ theme }) =>
    theme.breakpoints.md &&
    `
    @media (min-width: ${theme.breakpoints.md}) {
      display: none;
    }
  `}
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.md}) {
      flex: 1;
      justify-content: center;
      order: 2;
    }
  `}
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const LogoImage = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  margin-right: ${({ theme }) => theme.spacing.sm};

  img {
    height: 100%;
    width: auto;
  }

  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.md}) {
      height: 35px;
      margin-right: ${theme.spacing.xs};
    }
  `}
`;

export const LogoText = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;

  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.md}) {
      font-size: 1.125rem;
    }
  `}
`;

export const LogoAccent = styled.span`
  color: ${({ theme }) => theme.colors.caramel.base};
`;

export const CartIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.md}) {
      order: 3;
    }
  `}
`;

export const DesktopRightNav = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  ${({ theme }) =>
    theme.breakpoints.md &&
    `
    @media (min-width: ${theme.breakpoints.md}) {
      display: flex;
    }
  `}
`;

export const ThemeButton = styled.button`
  color: white;
  transition: color 0.2s ease;
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.caramel.base};
  }
`;

export const IconButton = styled.a`
  color: white;
  transition: color 0.2s ease;
  text-decoration: none;
  position: relative;

  &:hover {
    color: ${({ theme }) => theme.colors.caramel.base};
  }
`;

export const CartBadge = styled.span`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: ${({ theme }) => theme.semantic.secondary};
  color: white;
  font-size: 0.75rem;
  border-radius: ${({ theme }) => theme.radii.full};
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MobileCartBadge = styled(CartBadge)`
  width: 1rem;
  height: 1rem;
  font-size: 0.75rem;
`;

export const MobileIcons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) =>
    theme.breakpoints.md &&
    `
    @media (min-width: ${theme.breakpoints.md}) {
      display: none;
    }
  `}
`;

export const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-top: 1px solid ${({ theme }) => theme.currentSemantic.border};

  ${({ theme }) =>
    theme.breakpoints.md &&
    `
    @media (min-width: ${theme.breakpoints.md}) {
      display: none;
    }
  `}
`;

export const MobileMenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const MobileNavLink = styled.div`
  color: white;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  transition: color 0.2s ease;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.caramel.base};
  }
`;
