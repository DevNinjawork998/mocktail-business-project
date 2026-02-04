import styled from "styled-components";

export const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 60vh;
  background: ${({ theme }) => theme.currentSemantic.background};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const CartHeader = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.currentSemantic.border};
  padding-bottom: 1rem;
`;

export const CartTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0;
`;

export const CartEmpty = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

export const CartEmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin-bottom: 1rem;
`;

export const CartEmptyText = styled.p`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

export const ContinueShoppingButton = styled.button`
  display: inline-block;
  background: ${({ theme }) => theme.currentSemantic.primary};
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.currentSemantic.primaryDark};
  }
`;

export const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};

  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }
`;

export const CartItemImagePlaceholder = styled.div<{ $bgColor: string }>`
  width: 80px;
  height: 80px;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 0.7rem;
  }
`;

export const CartItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const CartItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0;
`;

export const CartItemPrice = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.primary};
`;

export const CartItemSubtext = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
`;

export const CartItemQuantity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: 0.5rem;
  }
`;

export const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.currentSemantic.primary};
    color: white;
    border-color: ${({ theme }) => theme.currentSemantic.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const QuantityInput = styled.input`
  width: 50px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
  /* Hide number input spinners for all browsers */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.currentSemantic.danger};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.currentSemantic.dangerDark};
  }

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    justify-self: end;
    margin-top: 0.5rem;
  }
`;

export const CartSummary = styled.div`
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  height: fit-content;
  position: sticky;
  top: 2rem;

  @media (max-width: 768px) {
    position: static;
    order: -1;
  }
`;

export const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.currentSemantic.border};
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  font-size: 0.95rem;
`;

export const SummaryValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
`;

export const SummaryTotal = styled(SummaryRow)`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.currentSemantic.border};
  font-size: 1.1rem;

  ${SummaryLabel}, ${SummaryValue} {
    font-size: 1.1rem;
    font-weight: 700;
  }
`;

export const CheckoutButton = styled.button`
  display: block;
  width: 100%;
  background: ${({ theme }) => theme.currentSemantic.primary};
  color: white;
  padding: 1rem;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 1.5rem;
  transition: background-color 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.currentSemantic.primaryDark};
  }
`;

export const CartPageBackground = styled.div`
  background: ${({ theme }) => theme.currentSemantic.background};
  min-height: 100vh;
  width: 100vw;
  padding-top: 4rem; /* Account for fixed navigation bar */
`;
