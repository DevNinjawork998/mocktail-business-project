/**
 * Helper function to parse HTML into structured data for the ProductForm
 * Extracts section title (h3) and paragraphs (p) from HTML string
 */
export function parseLongDescription(html: string): {
  sectionTitle: string;
  paragraphs: string[];
} {
  if (!html || html.trim() === "") {
    return { sectionTitle: "", paragraphs: [""] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  let sectionTitle = "";
  const paragraphs: string[] = [];

  // Extract h3 title
  const h3Element = doc.querySelector("h3");
  if (h3Element) {
    sectionTitle = h3Element.textContent?.trim() || "";
  }

  // Extract all paragraphs
  const pElements = doc.querySelectorAll("p");
  if (pElements.length > 0) {
    pElements.forEach((p) => {
      const text = p.textContent?.trim() || "";
      if (text) {
        paragraphs.push(text);
      }
    });
  }

  // If no paragraphs found but there's content, use body text
  if (paragraphs.length === 0) {
    const bodyText = doc.body.textContent?.trim() || "";
    if (bodyText && bodyText !== sectionTitle) {
      paragraphs.push(bodyText);
    }
  }

  // Ensure at least one paragraph field
  if (paragraphs.length === 0) {
    paragraphs.push("");
  }

  return { sectionTitle, paragraphs };
}

/**
 * Helper function to combine structured data into HTML
 * Combines section title and paragraphs into an HTML string
 */
export function combineLongDescription(
  sectionTitle: string,
  paragraphs: string[]
): string {
  const filteredParagraphs = paragraphs.filter((p) => p.trim().length > 0);

  if (filteredParagraphs.length === 0) {
    return "";
  }

  let html = "";

  if (sectionTitle.trim()) {
    html += `<h3>${sectionTitle.trim()}</h3>\n`;
  }

  filteredParagraphs.forEach((para) => {
    if (para.trim()) {
      html += `  <p>${para.trim()}</p>\n`;
    }
  });

  return html.trim();
}
