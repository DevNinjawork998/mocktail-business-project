import { render } from "@testing-library/react";
import StructuredData from "../StructuredData";

describe("StructuredData", () => {
  it("renders structured data script tag", () => {
    const { container } = render(<StructuredData />);
    const script = container.querySelector('script[type="application/ld+json"]');
    
    expect(script).toBeInTheDocument();
  });

  it("contains valid JSON-LD structured data", () => {
    const { container } = render(<StructuredData />);
    const script = container.querySelector('script[type="application/ld+json"]');
    
    expect(script).toBeInTheDocument();
    
    const jsonContent = script?.textContent;
    expect(jsonContent).toBeTruthy();
    
    // Parse and validate JSON
    const parsed = JSON.parse(jsonContent || "{}");
    expect(parsed).toHaveProperty("@context", "https://schema.org");
    expect(parsed).toHaveProperty("@type", "Organization");
  });

  it("contains correct organization information", () => {
    const { container } = render(<StructuredData />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script?.textContent || "{}");
    
    expect(parsed.name).toBe("Mocktails On The Go");
    expect(parsed.url).toBe("https://mocktailsonthego.com");
    expect(parsed.logo).toBe("https://mocktailsonthego.com/images/motg-logo.png");
    expect(parsed.description).toContain("Malaysia's 1st ever adaptogenic mocktails");
  });

  it("includes sameAs array for social media links", () => {
    const { container } = render(<StructuredData />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script?.textContent || "{}");
    
    expect(parsed).toHaveProperty("sameAs");
    expect(Array.isArray(parsed.sameAs)).toBe(true);
  });
});
