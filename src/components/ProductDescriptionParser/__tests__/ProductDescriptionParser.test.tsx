import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import ProductDescriptionParser from "../ProductDescriptionParser";
import "@jest/globals";

describe("ProductDescriptionParser", () => {
  describe("Rendering", () => {
    it("renders empty message when no content provided", () => {
      render(<ProductDescriptionParser htmlContent="" />);
      expect(screen.getByText("No description available.")).toBeInTheDocument();
    });

    it("renders empty message when only whitespace provided", () => {
      render(<ProductDescriptionParser htmlContent="   " />);
      expect(screen.getByText("No description available.")).toBeInTheDocument();
    });

    it("renders section title when present", () => {
      const html = "<h3>Test Title</h3><p>Test paragraph content.</p>";
      render(<ProductDescriptionParser htmlContent={html} />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("renders paragraphs correctly", () => {
      const html =
        "<h3>Title</h3><p>First paragraph.</p><p>Second paragraph.</p>";
      render(<ProductDescriptionParser htmlContent={html} />);
      expect(screen.getByText("First paragraph.")).toBeInTheDocument();
      expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    });

    it("renders multiple sections with titles and paragraphs", () => {
      const html = `
        <h3>Section One</h3>
        <p>Content for section one.</p>
        <h3>Section Two</h3>
        <p>Content for section two.</p>
      `;
      render(<ProductDescriptionParser htmlContent={html} />);
      expect(screen.getByText("Section One")).toBeInTheDocument();
      expect(screen.getByText("Section Two")).toBeInTheDocument();
      expect(screen.getByText("Content for section one.")).toBeInTheDocument();
      expect(screen.getByText("Content for section two.")).toBeInTheDocument();
    });
  });

  describe("Parsing Logic", () => {
    it("parses HTML with h3 title and paragraphs correctly", () => {
      const html =
        "<h3>Stamina & Libido Boost</h3><p>Maca root increases stamina.</p>";
      render(<ProductDescriptionParser htmlContent={html} />);
      expect(screen.getByText("Stamina & Libido Boost")).toBeInTheDocument();
      expect(
        screen.getByText("Maca root increases stamina."),
      ).toBeInTheDocument();
    });

    it("handles HTML with only paragraphs (no title)", () => {
      const html =
        "<p>Standalone paragraph one.</p><p>Standalone paragraph two.</p>";
      render(<ProductDescriptionParser htmlContent={html} />);
      expect(screen.getByText("Standalone paragraph one.")).toBeInTheDocument();
      expect(screen.getByText("Standalone paragraph two.")).toBeInTheDocument();
    });

    it("handles empty HTML string", () => {
      render(<ProductDescriptionParser htmlContent="" />);
      expect(screen.getByText("No description available.")).toBeInTheDocument();
    });

    it("handles malformed HTML gracefully", () => {
      const html = "<h3>Title<p>Unclosed tags";
      render(<ProductDescriptionParser htmlContent={html} />);
      // Should still render without crashing - browser parses malformed HTML
      // The title may be combined with unclosed content
      expect(screen.getByText(/Title/)).toBeInTheDocument();
    });

    it("extracts text content correctly from nested elements", () => {
      const html =
        "<h3>Main Title</h3><p><strong>Bold</strong> and <em>italic</em> text.</p>";
      render(<ProductDescriptionParser htmlContent={html} />);
      expect(screen.getByText("Main Title")).toBeInTheDocument();
      expect(screen.getByText("Bold and italic text.")).toBeInTheDocument();
    });
  });

  describe("Key Points Conversion", () => {
    it("converts long paragraphs into bullet points", () => {
      // A long paragraph with multiple sentences (>120 chars)
      const longParagraph =
        "This is the first sentence with enough content. This is the second sentence that is also quite long. This is the third sentence to make it even longer.";
      const html = `<h3>Title</h3><p>${longParagraph}</p>`;
      render(<ProductDescriptionParser htmlContent={html} />);

      // Should have bullet points (•)
      const bullets = screen.getAllByText("•");
      expect(bullets.length).toBeGreaterThan(0);
    });

    it("keeps short paragraphs as regular text", () => {
      const shortParagraph = "Short paragraph here.";
      const html = `<h3>Title</h3><p>${shortParagraph}</p>`;
      render(<ProductDescriptionParser htmlContent={html} />);

      expect(screen.getByText(shortParagraph)).toBeInTheDocument();
      // Should not have bullet points for short paragraphs
      expect(screen.queryByText("•")).not.toBeInTheDocument();
    });

    it("handles paragraphs with multiple sentences", () => {
      const multiSentence =
        "First sentence is here. Second sentence follows. Third sentence concludes. Fourth sentence adds more content to exceed the threshold.";
      const html = `<h3>Title</h3><p>${multiSentence}</p>`;
      render(<ProductDescriptionParser htmlContent={html} />);

      // Should render content (either as bullets or as paragraph)
      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("filters out empty paragraphs", () => {
      const html =
        "<h3>Title</h3><p>Valid content.</p><p></p><p>   </p><p>More content.</p>";
      render(<ProductDescriptionParser htmlContent={html} />);

      expect(screen.getByText("Valid content.")).toBeInTheDocument();
      expect(screen.getByText("More content.")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles HTML with only whitespace in tags", () => {
      const html = "<h3>   </h3><p>   </p>";
      render(<ProductDescriptionParser htmlContent={html} />);
      // When tags have whitespace only, the component renders empty sections
      // but doesn't show "No description available" because sections were found
      // The component should render without crashing
      expect(
        screen.queryByText("No description available."),
      ).not.toBeInTheDocument();
    });

    it("handles HTML with mixed content (h3, p, div)", () => {
      const html =
        "<h3>Title</h3><div>Ignored div content</div><p>Paragraph content.</p>";
      render(<ProductDescriptionParser htmlContent={html} />);

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Paragraph content.")).toBeInTheDocument();
      // div content should be ignored
      expect(screen.queryByText("Ignored div content")).not.toBeInTheDocument();
    });

    it("handles special characters in content", () => {
      const html =
        "<h3>Title with &amp; special chars</h3><p>Content with \"quotes\" and 'apostrophes'.</p>";
      render(<ProductDescriptionParser htmlContent={html} />);

      expect(
        screen.getByText("Title with & special chars"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Content with \"quotes\" and 'apostrophes'."),
      ).toBeInTheDocument();
    });

    it("handles very long paragraphs that need splitting", () => {
      const veryLongParagraph =
        "This is a very long paragraph that contains multiple sentences. " +
        "It should be split into bullet points for better readability. " +
        "Each sentence should become its own bullet point. " +
        "This helps users scan the content more easily. " +
        "The threshold for splitting is 120 characters.";
      const html = `<h3>Long Content</h3><p>${veryLongParagraph}</p>`;
      render(<ProductDescriptionParser htmlContent={html} />);

      expect(screen.getByText("Long Content")).toBeInTheDocument();
      // Should have bullet points
      const bullets = screen.getAllByText("•");
      expect(bullets.length).toBeGreaterThan(1);
    });

    it("handles paragraphs before any h3 tag", () => {
      // When paragraphs appear without an h3, they should still be rendered
      const html = "<p>Orphan paragraph without title.</p>";
      render(<ProductDescriptionParser htmlContent={html} />);

      expect(
        screen.getByText("Orphan paragraph without title."),
      ).toBeInTheDocument();
    });

    it("handles multiple h3 tags with paragraphs in between", () => {
      const html = `
        <h3>First Section</h3>
        <p>First section content.</p>
        <h3>Second Section</h3>
        <p>Second section content.</p>
        <h3>Third Section</h3>
        <p>Third section content.</p>
      `;
      render(<ProductDescriptionParser htmlContent={html} />);

      expect(screen.getByText("First Section")).toBeInTheDocument();
      expect(screen.getByText("Second Section")).toBeInTheDocument();
      expect(screen.getByText("Third Section")).toBeInTheDocument();
      expect(screen.getByText("First section content.")).toBeInTheDocument();
      expect(screen.getByText("Second section content.")).toBeInTheDocument();
      expect(screen.getByText("Third section content.")).toBeInTheDocument();
    });

    it("handles real-world product description HTML", () => {
      const html = `
        <h3>Stamina & Libido Boost</h3>
        <p>Maca root, cocoa & coffee increases stamina & libido. This indulgent mocktail combines the rich, earthy flavors of maca root with decadent dark chocolate and aromatic coffee for a truly sophisticated experience.</p>
        <p>Maca root is an ancient Peruvian superfood known for its energy-boosting properties and natural support for hormonal balance and vitality. Combined with mood-enhancing cocoa and energizing coffee, this creamy blend keeps your spirits high and your energy sustained.</p>
      `;
      render(<ProductDescriptionParser htmlContent={html} />);

      expect(screen.getByText("Stamina & Libido Boost")).toBeInTheDocument();
      // The long paragraphs should be rendered (either as bullets or regular text)
      // Check that the component doesn't crash and renders content
      expect(
        screen.getByRole("heading", { level: 3 }) ||
          screen.getByText("Stamina & Libido Boost"),
      ).toBeInTheDocument();
    });
  });
});
