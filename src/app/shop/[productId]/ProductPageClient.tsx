"use client";

import React, { useState } from "react";
import { Product } from "@/data/serverProductService";
import {
  ProductPageContainer,
  ProductLayout,
  MainContent,
  ProductImageSection,
  ProductImagePlaceholder,
  ProductDetailsSection,
  ProductTitle,
  ProductSubtitle,
  ProductFeatures,
  FeatureBadge,
  PriceSection,
  Price,
  PriceSubtext,
  ButtonGroup,
  Sidebar,
  SidebarTitle,
  SidebarGrid,
  SidebarProductCard,
  SidebarProductImage,
  SidebarProductName,
  ProductInfoSection,
  ProductInfoLeft,
  ProductInfoRight,
  ProductInfoTitle,
  ProductInfoDescription,
  ProductInfoIngredients,
  ProductInfoNutritionBox,
  ProductInfoNutritionTitle,
  ProductInfoNutritionTable,
  ProductInfoFeatureRow,
  ProductInfoFeatureIcon,
  ProductInfoFeatureLabel,
  ProductImageContainer,
  ProductImage,
  SidebarProductImageContainer,
  SidebarProductImageStyled,
  FeatureItemContainer,
  NutritionFactValue,
  WhatsAppButton,
  WhatsAppIcon,
  ProductDisclaimerSection,
  ProductDisclaimerText,
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalContentText,
  ModalConsentSection,
  ModalConsentCheckboxWrapper,
  ModalConsentCheckbox,
  ModalConsentLabel,
  ModalConsentText,
  ModalConsentLink,
  ModalButtonGroup,
  ModalProceedButton,
  ModalCancelButton,
} from "./page.styles";
import { formatCurrency } from "@/app/lib/stripe";
import ProductDescriptionParser from "@/components/ProductDescriptionParser/ProductDescriptionParser";

interface ProductPageClientProps {
  product: Product;
  otherProducts: Product[];
}

export default function ProductPageClient({
  product,
  otherProducts,
}: ProductPageClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const handleWhatsAppInquiry = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setConsentGiven(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleProceedToWhatsApp = () => {
    if (!consentGiven) {
      return;
    }

    try {
      // Simple WhatsApp message
      const message = `Hey, I am interested in your ${product.name}. How can I order it?`;

      // WhatsApp phone number with country code
      const phoneNumber = "60146491165";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message,
      )}`;

      // Close modal first
      handleCloseModal();

      // Open WhatsApp in new tab
      const newWindow = window.open(whatsappUrl, "_blank");
      if (!newWindow) {
        // Fallback if popup blocked
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      alert("There was an error opening WhatsApp. Please try again.");
    }
  };

  // Data from Prisma database
  const ingredients = product.ingredients;
  const nutritionFacts = product.nutritionFacts;
  const productBrief = product.productBrief;

  const features = [
    { icon: "🌾", label: "High Fiber" },
    { icon: "🍬", label: "Less Sugar*" },
    { icon: "🌱", label: "Vegan" },
    { icon: "🥥", label: "Plant Powered" },
    { icon: "🥚", label: "Paleo" },
    { icon: "🚫🌾", label: "Gluten Free" },
    { icon: "🚫🌽", label: "GMO Free" },
  ];

  const priceNumber = Number(product.price.replace(/[^0-9.]/g, ""));

  return (
    <ProductPageContainer>
      <ProductLayout>
        <MainContent>
          <ProductImageSection>
            {product.imageUrl ? (
              <ProductImageContainer>
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  style={{
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                  sizes="(max-width: 768px) 200px, 250px"
                />
              </ProductImageContainer>
            ) : (
              <ProductImagePlaceholder $bgColor={product.imageColor}>
                {product.name}
              </ProductImagePlaceholder>
            )}
          </ProductImageSection>

          <ProductDetailsSection>
            <div>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductSubtitle>{product.subtitle}</ProductSubtitle>
            </div>

            <ProductFeatures>
              {product.features.map((feature, index) => (
                <FeatureBadge key={index} $bgColor={feature.color}>
                  {feature.text}
                </FeatureBadge>
              ))}
            </ProductFeatures>

            <ProductDescriptionParser htmlContent={product.longDescription} />

            <PriceSection>
              <Price>{formatCurrency(priceNumber * 100)}</Price>
              <PriceSubtext>{product.priceSubtext}</PriceSubtext>
            </PriceSection>

            <ButtonGroup>
              <WhatsAppButton onClick={handleWhatsAppInquiry}>
                <WhatsAppIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </WhatsAppIcon>
                Send a text through WhatsApp
              </WhatsAppButton>
            </ButtonGroup>
          </ProductDetailsSection>
        </MainContent>
        <Sidebar>
          <SidebarTitle>Our Flavors</SidebarTitle>
          <SidebarGrid>
            {otherProducts.map((sideProduct) => (
              <SidebarProductCard
                key={sideProduct.id}
                href={`/shop/${sideProduct.id}`}
              >
                {sideProduct.imageUrl ? (
                  <SidebarProductImageContainer>
                    <SidebarProductImageStyled
                      src={sideProduct.imageUrl}
                      alt={sideProduct.name}
                      fill
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                      sizes="50px"
                    />
                  </SidebarProductImageContainer>
                ) : (
                  <SidebarProductImage $bgColor={sideProduct.imageColor}>
                    {sideProduct.name}
                  </SidebarProductImage>
                )}
                <SidebarProductName>{sideProduct.name}</SidebarProductName>
              </SidebarProductCard>
            ))}
          </SidebarGrid>
        </Sidebar>
      </ProductLayout>
      {/* New Product Info Section styled to match brand */}
      <ProductInfoSection>
        <ProductInfoLeft>
          <ProductInfoTitle>{product.name}</ProductInfoTitle>
          <ProductInfoDescription>
            {productBrief || "Product description coming soon..."}
          </ProductInfoDescription>
          <ProductInfoIngredients>
            <strong>Ingredients:</strong>{" "}
            {ingredients && ingredients.length > 0
              ? ingredients.join(", ")
              : "Ingredients information coming soon..."}
          </ProductInfoIngredients>
          <ProductInfoFeatureRow>
            {features.map((f, idx) => (
              <FeatureItemContainer key={idx}>
                <ProductInfoFeatureIcon>{f.icon}</ProductInfoFeatureIcon>
                <ProductInfoFeatureLabel>{f.label}</ProductInfoFeatureLabel>
              </FeatureItemContainer>
            ))}
          </ProductInfoFeatureRow>
        </ProductInfoLeft>
        <ProductInfoRight>
          <ProductInfoNutritionBox>
            <ProductInfoNutritionTitle>
              Nutrition Facts
            </ProductInfoNutritionTitle>
            <ProductInfoNutritionTable>
              {nutritionFacts && nutritionFacts.length > 0 ? (
                nutritionFacts.map((fact, idx) => (
                  <React.Fragment key={idx}>
                    <div>{fact.label}</div>
                    <NutritionFactValue>{fact.value}</NutritionFactValue>
                  </React.Fragment>
                ))
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Nutrition information coming soon...
                </div>
              )}
            </ProductInfoNutritionTable>
          </ProductInfoNutritionBox>
        </ProductInfoRight>
      </ProductInfoSection>

      <ProductDisclaimerSection>
        <ProductDisclaimerText>
          Individual results may vary. These statements have not been evaluated
          by health authorities. This product is not intended to diagnose,
          treat, cure, or prevent any disease. Please review our{" "}
          <a href="/disclaimer" target="_blank" rel="noopener noreferrer">
            full disclaimer
          </a>{" "}
          for more information. If you have allergies or medical conditions,
          please consult with a healthcare professional before consuming.
        </ProductDisclaimerText>
      </ProductDisclaimerSection>

      {/* Terms of Service Consent Modal */}
      {showModal && (
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContainer>
            <ModalTitle>Terms of Service Consent Required</ModalTitle>
            <ModalContent>
              <ModalContentText>
                To proceed with your inquiry via WhatsApp, we need your consent to
                collect and process your personal data for inquiry and communication
                purposes.
              </ModalContentText>
              <ModalContentText>
                By clicking &quot;Proceed to WhatsApp&quot;, you will be sharing your interest in
                this product with us. We will use this information to respond to your
                inquiry and provide you with product information and ordering details.
              </ModalContentText>
              <ModalConsentSection>
                <ModalConsentCheckboxWrapper>
                  <ModalConsentCheckbox
                    id="productTermsConsent"
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                  />
                  <ModalConsentLabel htmlFor="productTermsConsent">
                    <ModalConsentText>
                      I agree to the collection and processing of my personal data for
                      inquiry and communication purposes. I have read and agree to the{" "}
                      <ModalConsentLink
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms of Service
                      </ModalConsentLink>
                      . *
                    </ModalConsentText>
                  </ModalConsentLabel>
                </ModalConsentCheckboxWrapper>
              </ModalConsentSection>
            </ModalContent>
            <ModalButtonGroup>
              <ModalCancelButton onClick={handleCloseModal}>
                Cancel
              </ModalCancelButton>
              <ModalProceedButton
                onClick={handleProceedToWhatsApp}
                disabled={!consentGiven}
              >
                Proceed to WhatsApp
              </ModalProceedButton>
            </ModalButtonGroup>
          </ModalContainer>
        </ModalOverlay>
      )}
    </ProductPageContainer>
  );
}
