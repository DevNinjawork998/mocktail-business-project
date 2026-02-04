import styled from "styled-components";

export const BreadcrumbContainer = styled.nav`
  padding: 12px 0;
  border-top: 1px solid #E5E5E5;
  border-bottom: 1px solid #E5E5E5;
  background-color: ${({ theme }) => theme.currentSemantic.background};
  position: relative;
  z-index: 40;
  width: 100%;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 40px;
  box-sizing: border-box;
  margin-top: 4rem; /* Account for fixed navigation bar */
`;

export const BreadcrumbWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

export const BreadcrumbList = styled.ol`
  display: flex !important;
  display: flex !important;
  align-items: center;
  gap: 8px;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  visibility: visible !important;
  visibility: visible !important;
`;

export const BreadcrumbItem = styled.li`
  display: flex !important;
  display: flex !important;
  align-items: center;
  gap: 8px;
  visibility: visible !important;
  gap: 8px;
  visibility: visible !important;
`;

export const BreadcrumbLink = styled.div`
  color: #451515;
  color: #451515;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  display: flex;
  align-items: center;

  &:hover {
    color: #3a1111;
  }
  
  svg {
    color: #451515;
    color: #3a1111;
  }
  
  svg {
    color: #451515;
  }
`;

export const BreadcrumbCurrent = styled.span`
  color: #451515;
  color: #451515;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const BreadcrumbSeparator = styled.span`
  color: #A0A0A0;
  color: #A0A0A0;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  
  svg {
    color: #A0A0A0;
  }
  display: flex;
  align-items: center;
  
  svg {
    color: #A0A0A0;
  }
`;
