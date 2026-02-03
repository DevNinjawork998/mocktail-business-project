import styled from "styled-components";
import { media } from "@/theme/styled-theme";
import Link from "next/link";
import Image from "next/image";

export const ProductPageContainer = styled.div`
  min-height: 100vh;
  background: white;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};

  ${media.lg} {
    padding: ${({ theme }) => theme.spacing["2xl"]};
    ${({ theme }) => theme.spacing.xl};
  }
`;

export const ProductLayout = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.lg} {
    grid-template-columns: 1fr 300px;
    gap: ${({ theme }) => theme.spacing["3xl"]};
  }
`;

export const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.md} {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing["2xl"]};
  }
`;

export const ProductImageSection = styled.div`
  background: ${({ theme }) => theme.colors.caramel.light};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing["3xl"]};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;

  ${media.md} {
    min-height: 500px;
  }
`;

export const ProductImagePlaceholder = styled.div<{ $bgColor: string }>`
  width: 200px;
  height: 300px;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.xl};

  ${media.md} {
    width: 250px;
    height: 350px;
    font-size: 1.25rem;
  }
`;

export const ProductDetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ProductTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  ${media.md} {
    font-size: 3rem;
  }
`;

export const ProductSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;


export const ProductDescription = styled.div`
  color: ${({ theme }) => theme.currentSemantic.text};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export const PriceSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.royalOrange.base};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const PriceSubtext = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
`;

export const BuyNowButton = styled.button`
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

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  ${media.md} {
    flex-direction: row;
  }
`;

export const AddToCartButton = styled.button`
  background: ${({ theme }) => theme.colors.chocolateKisses.base};
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
    background: ${({ theme }) => theme.colors.chocolateKisses.dark};
  }
`;

export const WhatsAppButton = styled.button`
  background: #25d366;
  color: white;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing["2xl"]};
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  font-weight: bold;
  font-size: 1.125rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    background: #20ba5a;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const WhatsAppIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

export const Sidebar = styled.div`
  background: ${({ theme }) => theme.colors.caramel.light};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  height: fit-content;
`;

export const SidebarTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.chocolateKisses.dark};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

export const SidebarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  ${media.lg} {
    grid-template-columns: 1fr;
  }
`;

export const SidebarProductCard = styled(Link)`
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const SidebarProductImage = styled.div<{ $bgColor: string }>`
  width: 40px;
  height: 60px;
  background: ${({ $bgColor }) => $bgColor};
  border-radius: ${({ theme }) => theme.radii.sm};
  margin: 0 auto ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.5rem;

  ${media.lg} {
    width: 50px;
    height: 75px;
    font-size: 0.625rem;
  }
`;

export const SidebarProductName = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.chocolateKisses.dark};

  ${media.lg} {
    font-size: 0.875rem;
  }
`;

export const IngredientsSection = styled.section`
  margin: 2.5rem auto 0 auto;
  padding: 2rem;
  background: ${({ theme }) => theme.semantic.surface};
  border-radius: 1.25rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid ${({ theme }) => theme.semantic.border};
  max-width: 700px;
`;

export const IngredientsTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.semantic.primary};
  margin-bottom: 1rem;
  letter-spacing: 0.01em;
`;

export const IngredientsList = styled.ul`
  list-style: disc inside;
  padding-left: 1.5rem;
  color: ${({ theme }) => theme.semantic.text};
`;

export const IngredientItem = styled.li`
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
`;


export const ProductBriefSection = styled.section`
  margin: 2rem auto 0 auto;
  padding: 2rem;
  background: ${({ theme }) => theme.semantic.surface};
  border-radius: 1.25rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid ${({ theme }) => theme.semantic.border};
  max-width: 700px;
`;

export const ProductBriefTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.semantic.primary};
  margin-bottom: 1rem;
  letter-spacing: 0.01em;
`;

export const ProductBriefText = styled.p`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.semantic.text};
`;

export const ProductInfoSection = styled.section`
  margin: 3rem auto 0 auto;
  padding: 2.5rem 2rem;
  background: ${({ theme }) => theme.semantic.backgroundSecondary};
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  max-width: 1400px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2.5rem;
  align-items: flex-start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1rem;
  }
`;

export const ProductInfoLeft = styled.div``;

export const ProductInfoTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.semantic.primary};
  margin-bottom: 1rem;
`;

export const ProductInfoIngredients = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.semantic.text};
  margin-bottom: 1.5rem;
  & strong {
    color: ${({ theme }) => theme.semantic.primary};
  }
`;

export const ProductInfoFeatureRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.5rem;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const ProductInfoFeatureIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.semantic.secondary};
  display: flex;
  justify-content: center;
`;

export const ProductInfoFeatureLabel = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.semantic.text};
  text-align: center;
  margin-top: 0.25rem;
`;

export const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  background: ${({ theme }) => theme.currentSemantic.background};
  color: ${({ theme }) => theme.currentSemantic.text};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.currentSemantic.primary};
    color: white;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const QuantityInput = styled.input`
  width: 48px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.currentSemantic.text};
  background: ${({ theme }) => theme.currentSemantic.background};
  /* Hide number input spinners for Chrome, Safari, Edge, Opera */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Hide number input spinners for Firefox */
  -moz-appearance: textfield;
  /* Standard property for compatibility */
  appearance: textfield;
`;

export const ProductImageContainer = styled.div`
  position: relative;
  width: 250px;
  height: 350px;
`;

export const ProductImage = styled(Image)`
  object-fit: cover;
  border-radius: 12px;
`;

export const SidebarProductImageContainer = styled.div`
  position: relative;
  width: 50px;
  height: 75px;
  margin: 0 auto 8px;
`;

export const SidebarProductImageStyled = styled(Image)`
  object-fit: cover;
  border-radius: 6px;
`;

export const FeatureItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  background: white;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.lg} {
    padding: ${({ theme }) => theme.spacing["2xl"]};
  }
`;

export const LoadingContent = styled.div`
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.lg} {
    grid-template-columns: 1fr 300px;
    gap: ${({ theme }) => theme.spacing["3xl"]};
  }
`;

export const LoadingMainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  ${media.md} {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing["2xl"]};
  }
`;

export const LoadingImageSection = styled.div`
  background: ${({ theme }) => theme.colors.caramel.light};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing["3xl"]};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  ${media.md} {
    min-height: 500px;
  }
`;

export const LoadingDetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const LoadingTitle = styled.div`
  height: 3rem;
  background: ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const LoadingSubtitle = styled.div`
  height: 1.125rem;
  background: ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  width: 60%;
`;

export const LoadingFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const LoadingFeatureBadge = styled.div`
  height: 2.5rem;
  background: ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.full};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  width: 200px;
`;

export const LoadingDescription = styled.div`
  height: 8rem;
  background: ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const LoadingPrice = styled.div`
  height: 2rem;
  background: ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  width: 40%;
`;

export const LoadingPriceSubtext = styled.div`
  height: 0.875rem;
  background: ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  width: 30%;
`;

export const LoadingButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  ${media.md} {
    flex-direction: row;
  }
`;

export const LoadingQuantitySelector = styled.div`
  height: 2.5rem;
  background: ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  width: 150px;
`;

export const LoadingAddToCartButton = styled.div`
  height: 3rem;
  background: ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.full};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  flex: 1;
`;

export const LoadingSidebar = styled.div`
  background: ${({ theme }) => theme.colors.caramel.light};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  height: fit-content;
`;

export const LoadingSidebarTitle = styled.div`
  height: 1.5rem;
  background: ${({ theme }) => theme.currentSemantic.border};
  border-radius: ${({ theme }) => theme.radii.md};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const LoadingSidebarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  ${media.lg} {
    grid-template-columns: 1fr;
  }
`;

export const LoadingSidebarCard = styled.div`
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.md};
  height: 120px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export const SidebarImageLoadingPlaceholder = styled.div`
  width: 50px;
  height: 75px;
  margin: 0 auto 8px;
  background: #f3f4f6;
  border-radius: 6px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export const MainImageLoadingPlaceholder = styled.div`
  width: 250px;
  height: 350px;
  background: #f3f4f6;
  border-radius: 12px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  ${media.md} {
    width: 250px;
    height: 350px;
  }
`;

export const ProductDisclaimerSection = styled.div`
  margin: 2rem auto 0 auto;
  padding: 1.25rem 1.5rem;
  background: ${({ theme }) => theme.semantic.surface};
  border: 1px solid ${({ theme }) => theme.semantic.border};
  border-radius: 0.75rem;
  max-width: 1400px;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};
`;

export const ProductDisclaimerText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.currentSemantic.textSecondary};

  a {
    color: ${({ theme }) => theme.semantic.primary};
    text-decoration: underline;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const ModalContainer = styled.div`
  background: ${({ theme }) => theme.currentSemantic.background};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  position: relative;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.semantic.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

export const ModalContent = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const ModalContentText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.currentSemantic.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ModalConsentSection = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.currentSemantic.backgroundSecondary};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
`;

export const ModalConsentCheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ModalConsentCheckbox = styled.input`
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

export const ModalConsentLabel = styled.label`
  cursor: pointer;
  flex: 1;
`;

export const ModalConsentText = styled.span`
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.currentSemantic.text};
  display: block;
`;

export const ModalConsentLink = styled.a`
  color: ${({ theme }) => theme.currentSemantic.primary};
  text-decoration: underline;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;

  ${media.md} {
    flex-direction: row;
  }
`;

export const ModalProceedButton = styled.button`
  background: #25d366;
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  flex: 1;

  &:hover:not(:disabled) {
    background: #20ba5a;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ModalCancelButton = styled.button`
  background: ${({ theme }) => theme.currentSemantic.background};
  color: ${({ theme }) => theme.currentSemantic.text};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme }) => theme.currentSemantic.border};
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  flex: 1;

  &:hover {
    background: ${({ theme }) => theme.currentSemantic.backgroundSecondary};
    border-color: ${({ theme }) => theme.currentSemantic.primary};
  }
`;
