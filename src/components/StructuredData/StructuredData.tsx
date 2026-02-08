/**
 * Structured Data Component
 * Adds JSON-LD structured data for SEO and Google Search features
 * This helps Google display site logo and rich snippets in search results
 */
export default function StructuredData(): JSX.Element {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mocktails On The Go",
    url: "https://mocktailsonthego.com",
    logo: "https://mocktailsonthego.com/images/motg-logo.png",
    description:
      "Malaysia's 1st ever adaptogenic mocktails. 100% Halal Ingredients 0% Alcohol",
    sameAs: [
      // Add your social media links here when available
      // "https://www.facebook.com/mocktailonthego",
      // "https://www.instagram.com/mocktailonthego",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema),
      }}
    />
  );
}
