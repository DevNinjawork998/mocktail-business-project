import styled, { keyframes } from "styled-components";
import { media } from "@/theme/styled-theme";

export const SuccessContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.currentSemantic.background};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.lg} {
    padding: ${({ theme }) => theme.spacing["2xl"]};
  }
`;

export const SuccessContent = styled.div`
  max-width: 800px;
  width: 100%;
  background: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  text-align: center;
`;

export const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const SuccessTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.royalOrange.base};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${media.md} {
    font-size: 3rem;
  }
`;

export const SuccessMessage = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

export const OrderDetails = styled.div`
  background: ${({ theme }) => theme.colors.caramel.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: left;
`;

export const OrderDetailsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

export const OrderDetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const OrderItemName = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.currentSemantic.text};
  flex: 1;
`;

export const OrderItemQuantity = styled.span`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin: 0 ${({ theme }) => theme.spacing.md};
`;

export const OrderItemPrice = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.royalOrange.base};
`;

export const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.chocolateKisses.base};
  color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: 1.125rem;
`;

export const CustomerInfo = styled.div`
  background: ${({ theme }) => theme.colors.caramel.light};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: left;
`;

export const CustomerInfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

export const CustomerInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const CustomerInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.currentSemantic.border};

  &:last-child {
    border-bottom: none;
  }

  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const CustomerInfoLabel = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.currentSemantic.text};
  min-width: 100px;

  ${media.sm} {
    min-width: auto;
  }
`;

export const CustomerInfoValue = styled.span`
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  text-align: right;
  flex: 1;

  ${media.sm} {
    text-align: left;
  }
`;

export const BackToShopButton = styled.button`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.royalOrange.base},
    ${({ theme }) => theme.colors.bittersweetShimmer.base}
  );
  color: white;
  padding: ${({ theme }) => theme.spacing.lg};
  ${({ theme }) => theme.spacing["2xl"]};
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  font-weight: bold;
  font-size: 1.125rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

export const LoadingMessage = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  text-align: center;
`;

// Confetti animation
export const confettiFall = keyframes`
  0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
`;

export const Confetti = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  pointer-events: none;
  z-index: 10;

  span {
    position: absolute;
    font-size: 2rem;
    animation: ${confettiFall} 2.5s linear infinite;
    opacity: 0;
  }
`;

export const CocktailEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

export const SuccessIconStyled = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.currentSemantic.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 2rem;
  box-shadow: 0 2px 8px ${({ theme }) => theme.currentSemantic.primaryLight};
`;

export const SuccessTitleStyled = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const SuccessMessageStyled = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 600px;
`;

export const OrderDetailsStyled = styled.div`
  background: ${({ theme }) => theme.currentSemantic.surface};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1.5px solid ${({ theme }) => theme.currentSemantic.border};
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
`;

export const OrderId = styled.div`
  font-size: 0.98rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin-bottom: 0.5rem;
  font-weight: 400;
`;

export const OrderIdValue = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.currentSemantic.primaryLight};
  color: ${({ theme }) => theme.currentSemantic.primary};
  font-family: "Menlo", "Monaco", "Consolas", monospace;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.25em 0.9em;
  margin-top: 0.25em;
  margin-bottom: 0.25em;
  user-select: all;
  letter-spacing: 0.01em;
  border: 1.5px solid ${({ theme }) => theme.currentSemantic.primary};
  word-break: break-all;
  white-space: pre-wrap;
  max-width: 100%;
  overflow-wrap: anywhere;
  box-sizing: border-box;
`;

export const NextSteps = styled.div`
  background: ${({ theme }) => theme.currentSemantic.primaryLight};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
`;

export const NextStepsTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.currentSemantic.primary};
  margin-bottom: 1rem;
`;

export const NextStepsList = styled.ul`
  text-align: left;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  line-height: 1.6;
`;

export const NextStepsItem = styled.li`
  margin-bottom: 0.5rem;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const Button = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  min-width: 150px;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px rgba(215, 38, 96, 0.08);
  &:hover {
    transform: translateY(-2px) scale(1.04);
  }
`;

export const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.currentSemantic.primary};
  color: white;
  &:hover {
    background: ${({ theme }) => theme.currentSemantic.primaryDark};
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${({ theme }) => theme.currentSemantic.surface};
  color: ${({ theme }) => theme.currentSemantic.primary};
  border: 2px solid ${({ theme }) => theme.currentSemantic.primary};
  &:hover {
    background: ${({ theme }) => theme.currentSemantic.primaryLight};
    color: ${({ theme }) => theme.currentSemantic.primaryDark};
    border-color: ${({ theme }) => theme.currentSemantic.primaryDark};
  }
`;

export const SocialShare = styled.div`
  margin-top: 2rem;
  color: ${({ theme }) => theme.currentSemantic.primary};
  font-size: 1.1rem;
  font-weight: 500;
`;

export const SuccessContainerStyled = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;
