import styled from "styled-components";

export const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: calc(
    4rem + 2rem
  ); /* Account for fixed navigation bar + existing padding */
  min-height: 60vh;

  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: calc(
      4rem + 1rem
    ); /* Account for fixed navigation bar + existing padding */
  }
`;

export const CheckoutHeader = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.currentSemantic.border};
  padding-bottom: 1rem;
`;

export const CheckoutTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0;
`;

export const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const OrderSummary = styled.div`
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  height: fit-content;
`;

export const SummaryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.currentSemantic.border};
`;

export const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
`;

export const OrderItemImagePlaceholder = styled.div<{ $bgColor: string }>`
  width: 60px;
  height: 60px;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.2;
`;

export const OrderItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const OrderItemName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0;
`;

export const OrderItemSubtext = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
`;

export const OrderItemQuantity = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
`;

export const OrderItemPrice = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.primary};
`;

export const OrderTotal = styled.div`
  border-top: 1px solid ${({ theme }) => theme.currentSemantic.border};
  padding-top: 1rem;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const TotalLabel = styled.span`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  font-size: 0.95rem;
`;

export const TotalValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
`;

export const TotalAmount = styled(TotalRow)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.currentSemantic.border};
  font-size: 1.1rem;

  ${TotalLabel}, ${TotalValue} {
    font-size: 1.1rem;
    font-weight: 700;
  }
`;

export const CustomerInfo = styled.div`
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  margin-top: 1rem;
`;

export const CustomerInfoTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.currentSemantic.border};
`;

export const CustomerInfoForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  font-size: 0.9rem;
`;

export const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.currentSemantic.primary};
  }
`;

export const FormTextarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.currentSemantic.primary};
  }
`;

export const WhatsAppSection = styled.div`
  grid-column: 1 / -1;
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  text-align: center;
`;

export const WhatsAppTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0 0 1rem 0;
`;

export const WhatsAppDescription = styled.p`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

export const WhatsAppButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: #25d366;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;

  &:hover {
    background: #128c7e;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #bdbdbd !important;
    color: white;
  }
  &:hover:disabled {
    background: #bdbdbd !important;
    color: white;
  }
`;

export const WhatsAppIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

export const EmptyCartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin-bottom: 1rem;
`;

export const EmptyCartText = styled.p`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

export const BackToCartButton = styled.button`
  background: ${({ theme }) => theme.currentSemantic.primary};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.currentSemantic.primaryDark};
  }
`;

export const PaymentSection = styled.div`
  grid-column: 1 / -1;
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  text-align: center;
`;

export const PaymentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin: 0 0 1rem 0;
`;

export const PaymentDescription = styled.p`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

export const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PaymentOption = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PaymentOptionButton = styled.button<{
  $isSelected?: boolean;
  $variant?: "whatsapp" | "stripe";
}>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid
    ${({ theme, $isSelected, $variant }) =>
      $variant === "whatsapp"
        ? "#25d366"
        : $isSelected
          ? theme.currentSemantic.primary
          : theme.currentSemantic.border};
  border-radius: 8px;
  background: ${({ $isSelected, $variant }) =>
    $variant === "whatsapp"
      ? $isSelected
        ? "#25d366"
        : "#f0f9f0"
      : $isSelected
        ? "rgba(59, 130, 246, 0.05)"
        : "white"};
  color: ${({ $isSelected, $variant, theme }) =>
    $variant === "whatsapp"
      ? $isSelected
        ? "white"
        : "#25d366"
      : theme.currentSemantic.text};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    border-color: ${({ $variant, theme }) =>
      $variant === "whatsapp" ? "#25d366" : theme.currentSemantic.primary};
    background: ${({ $variant }) =>
      $variant === "whatsapp" ? "#25d366" : "rgba(59, 130, 246, 0.05)"};
    color: ${({ $variant, theme }) =>
      $variant === "whatsapp" ? "white" : theme.currentSemantic.text};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.currentSemantic.primary}33;
    outline: 2px solid ${({ theme }) => theme.currentSemantic.primary};
    outline-offset: 2px;
    z-index: 1;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PaymentOptionIcon = styled.div<{
  $isSelected?: boolean;
  $variant?: "whatsapp" | "stripe";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ theme }) => theme.currentSemantic.surface};
  color: ${({ $isSelected, $variant }) =>
    $variant === "whatsapp" ? ($isSelected ? "white" : "#25d366") : "inherit"};
`;

export const PaymentOptionText = styled.span`
  display: block;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  font-size: 1rem;
`;

export const PaymentOptionDescription = styled.span`
  display: block;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid ${({ theme }) => theme.currentSemantic.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const DisclaimerNotice = styled.div`
  grid-column: 1 / -1;
  background: ${({ theme }) => theme.currentSemantic.background};
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
`;

export const DisclaimerText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
`;

export const TermsConsentSection = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const ConsentCheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const ConsentCheckbox = styled.input`
  margin-top: 0.25rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: ${({ theme }) => theme.currentSemantic.primary};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.currentSemantic.primary};
    outline-offset: 2px;
  }
`;

export const ConsentLabel = styled.label`
  cursor: pointer;
  flex: 1;
`;

export const ConsentText = styled.span`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.currentSemantic.text};
  display: block;
`;

export const ConsentLink = styled.a`
  color: ${({ theme }) => theme.currentSemantic.primary};
  text-decoration: underline;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;
