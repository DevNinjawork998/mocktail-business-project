import React from "react";

export default function StructuredData(): React.ReactElement {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mocktails On The Go",
    url: "https://mocktailsonthego.com",
    logo: "https://mocktailsonthego.com/images/motg-logo.png",
    description:
      "Malaysia's 1st ever adaptogenic mocktails. 100% Halal Ingredients 0% Alcohol",
    sameAs: [
      "https://www.facebook.com/mocktailsonthego",
      "https://www.instagram.com/mocktailsonthego",
      "https://www.tiktok.com/@mocktailsonthego",
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Mocktails On The Go",
    url: "https://mocktailsonthego.com",
    logo: "https://mocktailsonthego.com/images/motg-logo.png",
    description:
      "Malaysia's 1st ever adaptogenic mocktails. 100% Halal Ingredients 0% Alcohol",
    servesCuisine: "Beverages",
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "Malaysia",
    },
    sameAs: [
      "https://www.facebook.com/mocktailsonthego",
      "https://www.instagram.com/mocktailsonthego",
      "https://www.tiktok.com/@mocktailsonthego",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
    </>
  );
}
