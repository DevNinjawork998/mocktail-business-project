"use client";

import { useState, useMemo, type MouseEvent } from "react";
import { Product } from "@/data/serverProductService";
import ProductImageSlider from "@/components/ProductImageSlider/ProductImageSlider";
import {
  ProductPageContainer,
  ProductLayout,
  MainContent,
  ProductImageSection,
  ProductImagePlaceholder,
  ProductDetailsSection,
  ProductTitle,
  ProductSubtitle,
  ProductDescription,
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
  ProductInfoTitle,
  ProductInfoIngredients,
  ProductInfoFeatureRow,
  ProductInfoFeatureIcon,
  ProductInfoFeatureLabel,
  SidebarProductImageContainer,
  SidebarProductImageStyled,
  FeatureItemContainer,
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
  ImageZoomOverlay,
  ImageZoomContainer,
  ImageZoomImage,
  ImageZoomCloseButton,
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
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);

  // Build image URLs array: main imageUrl first, then supporting photos from ProductImage (order 1, 2)
  const imageUrls = useMemo(() => {
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/4b2c1512-4efc-413b-bace-ac682a95f5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProductPageClient.tsx:77',message:'Building imageUrls - initial data',data:{productId:product.id,imageUrl:product.imageUrl,imagesCount:product.images?.length||0,images:product.images?.map(i=>({order:i.order,url:i.url}))||[]},timestamp:Date.now(),runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const urls: string[] = [];
    const urlSet = new Set<string>(); // Track URLs to prevent duplicates
    const orderSet = new Set<number>(); // Track orders to ensure only one image per order
    
    // Always start with main imageUrl (this is the primary source for the main photo)
    if (product.imageUrl) {
      urls.push(product.imageUrl);
      urlSet.add(product.imageUrl);
      orderSet.add(0); // Mark order 0 as used
      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/4b2c1512-4efc-413b-bace-ac682a95f5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProductPageClient.tsx:87',message:'Added main imageUrl',data:{imageUrl:product.imageUrl,currentUrlsCount:urls.length},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7246/ingest/4b2c1512-4efc-413b-bace-ac682a95f5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProductPageClient.tsx:90',message:'WARNING: product.imageUrl is missing',data:{productId:product.id},timestamp:Date.now(),runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
    }
    
    // Then add supporting photos from ProductImage records (order 1, 2 only)
    // We skip order 0 because it's the same as imageUrl
    // Also ensure no ProductImage URL matches imageUrl (even if order > 0)
    if (product.images && product.images.length > 0) {
      // Group by order and take only the first occurrence of each order
      const orderMap = new Map<number, string>();
      
      product.images.forEach((img) => {
        // Only process order 1 and 2 (strictly)
        if (img.order <= 0 || img.order > 2) {
          return;
        }
        // Skip if URL matches imageUrl
        if (product.imageUrl && img.url === product.imageUrl) {
          return;
        }
        // Skip if URL already exists (duplicate URL check)
        if (urlSet.has(img.url)) {
          return;
        }
        // Only keep the first occurrence of each order
        if (!orderMap.has(img.order)) {
          orderMap.set(img.order, img.url);
        }
      });
      
      // Sort by order and add to URLs
      const sortedOrders = Array.from(orderMap.keys()).sort((a, b) => a - b);
      sortedOrders.forEach((order) => {
        const url = orderMap.get(order);
        if (url && !urlSet.has(url)) {
          urls.push(url);
          urlSet.add(url);
          orderSet.add(order);
        }
      });
    }
    
    // Safety limit: Only return max 3 images (main + 2 supporting)
    // This prevents issues if there are ProductImage records with order > 2
    const limitedUrls = urls.slice(0, 3);
    
    // Final deduplication check: ensure no duplicate URLs in final array
    const finalDeduplicatedUrls: string[] = [];
    const finalUrlSet = new Set<string>();
    limitedUrls.forEach((url) => {
      if (!finalUrlSet.has(url)) {
        finalDeduplicatedUrls.push(url);
        finalUrlSet.add(url);
      }
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7246/ingest/4b2c1512-4efc-413b-bace-ac682a95f5c0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProductPageClient.tsx:141',message:'Final imageUrls array',data:{finalUrlsCount:finalDeduplicatedUrls.length,finalUrls:finalDeduplicatedUrls,productId:product.id},timestamp:Date.now(),runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return finalDeduplicatedUrls;
  }, [product.images, product.imageUrl]);

  const handleWhatsAppInquiry = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setConsentGiven(false);
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
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
      const phoneNumber = "60129104201";
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

  // List of ingredient names and features that should not be shown
  const excludedFeatures = [
    "Cocoa",
    "Coffee",
    "Maca",
    "Maca Root",
    "Fresh Orange",
    "Cranberry",
    "Baobab",
    "Ginger",
    "Cinnamon",
    "Ashwagandha",
    "Paleo",
    "Gluten Free",
  ];

  // Default features that should always be shown (excluding Paleo and Gluten Free)
  // Exclude Vegan for Maca Martini since it contains milk
  // Exclude Good Vit C for Maca Martini
  const baseDefaultFeatures = [
    { icon: "🌾", label: "Fiber" },
    { icon: "🍬", label: "Less Sugar*" },
    { icon: "🌱", label: "Vegan" },
    { icon: "🥥", label: "Plant Powered" },
    { icon: "🚫🌽", label: "GMO Free" },
    { icon: "🍊", label: "Good Vit C" },
    { icon: "⚡", label: "Good Iron" },
  ];

  // Remove Vegan if product contains milk (Maca Martini)
  const hasMilk = ingredients?.some((ing) =>
    ing.toLowerCase().includes("milk"),
  );

  // Remove Good Vit C for Maca Martini
  const isMacaMartini = product.id === "maca-martini";

  const defaultFeatures = baseDefaultFeatures.filter((f) => {
    if (hasMilk && f.label === "Vegan") return false;
    if (isMacaMartini && f.label === "Good Vit C") return false;
    return true;
  });

  // Map common feature texts to icons (alphabetically ordered)
  const featureIconMap: Record<string, string> = {
    Antioxidant: "✨",
    Caffeine: "☕",
    Calcium: "🥛",
    Fiber: "🌾",
    "GMO Free": "🚫🌽",
    "Good Iron": "⚡",
    "Good Vit C": "🍊",
    "High Calcium": "🥛",
    "High Fiber": "🌾",
    "Less Sugar": "🍬",
    "Less sugar": "🍬",
    "Plant Powered": "🥥",
    Vegan: "🌱",
  };

  // Filter out features that are ingredient names or excluded features
  // Also normalize feature labels (replace "High Fiber" -> "Fiber", etc.)
  const normalizeFeatureLabel = (label: string): string => {
    const normalized = label.trim();
    // Handle case-insensitive matching for "High" variations
    if (/^high\s+fiber$/i.test(normalized)) return "Fiber";
    if (/^high\s+antioxidant$/i.test(normalized)) return "Antioxidant";
    if (/^high\s+calcium$/i.test(normalized)) return "Calcium";
    // Handle case-insensitive matching for "Good" variations
    if (/^good\s+fiber$/i.test(normalized)) return "Fiber";
    if (/^good\s+antioxidant$/i.test(normalized)) return "Antioxidant";
    // Normalize "Less sugar" to "Less Sugar*" to match default feature
    if (normalized === "Less sugar" || normalized === "Less Sugar") return "Less Sugar";
    return normalized;
  };

  const productSpecificFeatures =
    product.features && product.features.length > 0
      ? product.features
          .filter((f) => !excludedFeatures.includes(f.text))
          .map((f) => {
            const normalizedLabel = normalizeFeatureLabel(f.text);
            return {
              icon:
                featureIconMap[normalizedLabel] ||
                featureIconMap[f.text] ||
                "✨",
              label: normalizedLabel,
            };
          })
      : [];

  // Check if product has its own "Less sugar" or "Less Sugar" feature
  const hasProductLessSugar = productSpecificFeatures.some(
    (f) =>
      f.label === "Less Sugar*" ||
      f.label === "Less sugar" ||
      f.label === "Less Sugar",
  );

  // Remove "Less Sugar*" from default features if product already has it
  const finalDefaultFeatures = hasProductLessSugar
    ? defaultFeatures.filter((f) => f.label !== "Less Sugar*")
    : defaultFeatures;

  // Combine default features with product-specific features
  // Remove duplicates based on label
  const features = [...finalDefaultFeatures, ...productSpecificFeatures].filter(
    (feature, index, self) =>
      index === self.findIndex((f) => f.label === feature.label),
  );

  const priceNumber = Number(product.price.replace(/[^0-9.]/g, ""));

  return (
    <ProductPageContainer>
      <ProductLayout>
        <MainContent>
          <ProductImageSection>
            {imageUrls.length > 0 ? (
              <ProductImageSlider
                images={imageUrls}
                productName={product.name}
                onImageClick={(index) => {
                  setZoomedImageIndex(index);
                  setShowImageZoom(true);
                }}
              />
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

            {product.description && (
              <ProductDescription>{product.description}</ProductDescription>
            )}

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
          <ProductInfoIngredients>
            <strong>Ingredients:</strong>{" "}
            {ingredients && ingredients.length > 0
              ? ingredients.length > 1
                ? `${ingredients.slice(0, -1).join(", ")}, and ${ingredients[ingredients.length - 1]}`
                : ingredients[0]
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
      </ProductInfoSection>

      <ProductDisclaimerSection>
        <ProductDisclaimerText>
          Individual results may vary. These statements have not been evaluated
          by health authorities. This product is not intended to diagnose,
          treat, cure, or prevent any disease. Please review our{" "}
          <a href="/terms-of-use" target="_blank" rel="noopener noreferrer">
            terms of use
          </a>{" "}
          for more information. If you have allergies or medical conditions,
          please consult with a healthcare professional before consuming.
        </ProductDisclaimerText>
      </ProductDisclaimerSection>

      {/* Image Zoom Modal */}
      {showImageZoom && imageUrls.length > 0 && (
        <ImageZoomOverlay onClick={() => setShowImageZoom(false)}>
          <ImageZoomContainer onClick={(e) => e.stopPropagation()}>
            <ImageZoomCloseButton onClick={() => setShowImageZoom(false)}>
              ×
            </ImageZoomCloseButton>
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : imageUrls.length - 1
                    );
                  }}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    zIndex: 20,
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedImageIndex((prev) =>
                      prev < imageUrls.length - 1 ? prev + 1 : 0
                    );
                  }}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    zIndex: 20,
                  }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : imageUrls.length - 1
                    );
                  }}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    zIndex: 20,
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedImageIndex((prev) =>
                      prev < imageUrls.length - 1 ? prev + 1 : 0
                    );
                  }}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "48px",
                    height: "48px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    zIndex: 20,
                  }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <ImageZoomImage
                src={imageUrls[zoomedImageIndex]}
                alt={`${product.name} - Image ${zoomedImageIndex + 1}`}
                fill
                style={{ objectFit: "contain" }}
                sizes="95vw"
                priority
              />
            </div>
            {imageUrls.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  zIndex: 20,
                }}
              >
                {zoomedImageIndex + 1} / {imageUrls.length}
              </div>
            )}
            {imageUrls.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  zIndex: 20,
                }}
              >
                {zoomedImageIndex + 1} / {imageUrls.length}
              </div>
            )}
          </ImageZoomContainer>
        </ImageZoomOverlay>
      )}

      {/* Terms of Use Consent Modal */}
      {showModal && (
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContainer>
            <ModalTitle>Terms of Use Consent Required</ModalTitle>
            <ModalContent>
              <ModalContentText>
                To proceed with your inquiry via WhatsApp, we need your consent
                to collect and process your personal data for inquiry and
                communication purposes.
              </ModalContentText>
              <ModalContentText>
                By clicking &quot;Proceed to WhatsApp&quot;, you will be sharing
                your interest in this product with us. We will use this
                information to respond to your inquiry and provide you with
                product information and ordering details.
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
                      I agree to the collection and processing of my personal
                      data for inquiry and communication purposes. I have read
                      and agree to the{" "}
                      <ModalConsentLink
                        href="/terms-of-use"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms of Use
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
