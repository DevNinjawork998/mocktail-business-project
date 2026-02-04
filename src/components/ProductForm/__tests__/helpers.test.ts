import { parseLongDescription, combineLongDescription } from "../helpers";
import "@jest/globals";

describe("ProductForm Helper Functions", () => {
  describe("parseLongDescription", () => {
    it("parses HTML with h3 and paragraphs", () => {
      const html =
        "<h3>Test Title</h3><p>First paragraph.</p><p>Second paragraph.</p>";
      const result = parseLongDescription(html);

      expect(result.sectionTitle).toBe("Test Title");
      expect(result.paragraphs).toEqual([
        "First paragraph.",
        "Second paragraph.",
      ]);
    });

    it("parses HTML with only paragraphs (no title)", () => {
      const html = "<p>First paragraph.</p><p>Second paragraph.</p>";
      const result = parseLongDescription(html);

      expect(result.sectionTitle).toBe("");
      expect(result.paragraphs).toEqual([
        "First paragraph.",
        "Second paragraph.",
      ]);
    });

    it("returns empty structure for empty HTML", () => {
      const result = parseLongDescription("");

      expect(result.sectionTitle).toBe("");
      expect(result.paragraphs).toEqual([""]);
    });

    it("returns empty structure for whitespace-only HTML", () => {
      const result = parseLongDescription("   ");

      expect(result.sectionTitle).toBe("");
      expect(result.paragraphs).toEqual([""]);
    });

    it("handles HTML with no paragraphs", () => {
      const html = "<h3>Just a title</h3>";
      const result = parseLongDescription(html);

      expect(result.sectionTitle).toBe("Just a title");
      expect(result.paragraphs).toEqual([""]);
    });

    it("extracts title correctly", () => {
      const html = "<h3>My Custom Title</h3><p>Content here.</p>";
      const result = parseLongDescription(html);

      expect(result.sectionTitle).toBe("My Custom Title");
    });

    it("extracts multiple paragraphs correctly", () => {
      const html = `
        <h3>Title</h3>
        <p>Paragraph one.</p>
        <p>Paragraph two.</p>
        <p>Paragraph three.</p>
      `;
      const result = parseLongDescription(html);

      expect(result.paragraphs).toHaveLength(3);
      expect(result.paragraphs[0]).toBe("Paragraph one.");
      expect(result.paragraphs[1]).toBe("Paragraph two.");
      expect(result.paragraphs[2]).toBe("Paragraph three.");
    });

    it("handles paragraphs with special characters", () => {
      const html =
        "<h3>Title</h3><p>Content with &amp; special \"chars\" and 'apostrophes'.</p>";
      const result = parseLongDescription(html);

      expect(result.paragraphs[0]).toBe(
        "Content with & special \"chars\" and 'apostrophes'.",
      );
    });

    it("returns at least one empty paragraph when no content", () => {
      const html = "<h3>Title Only</h3>";
      const result = parseLongDescription(html);

      expect(result.paragraphs).toHaveLength(1);
      expect(result.paragraphs[0]).toBe("");
    });

    it("handles null/undefined input gracefully", () => {
      // @ts-expect-error - Testing null input
      const resultNull = parseLongDescription(null);
      expect(resultNull.sectionTitle).toBe("");
      expect(resultNull.paragraphs).toEqual([""]);

      // @ts-expect-error - Testing undefined input
      const resultUndefined = parseLongDescription(undefined);
      expect(resultUndefined.sectionTitle).toBe("");
      expect(resultUndefined.paragraphs).toEqual([""]);
    });

    it("filters out empty paragraphs", () => {
      const html =
        "<h3>Title</h3><p>Content</p><p></p><p>   </p><p>More content</p>";
      const result = parseLongDescription(html);

      expect(result.paragraphs).toEqual(["Content", "More content"]);
    });

    it("handles nested elements in paragraphs", () => {
      const html =
        "<h3>Title</h3><p><strong>Bold</strong> and <em>italic</em> text.</p>";
      const result = parseLongDescription(html);

      expect(result.paragraphs[0]).toBe("Bold and italic text.");
    });

    it("uses body text when no paragraphs found", () => {
      const html = "<div>Some content without p tags</div>";
      const result = parseLongDescription(html);

      expect(result.paragraphs[0]).toBe("Some content without p tags");
    });

    it("handles real-world product description", () => {
      const html = `
        <h3>Stamina & Libido Boost</h3>
        <p>Maca root, cocoa & coffee increases stamina & libido. This indulgent mocktail combines the rich, earthy flavors of maca root with decadent dark chocolate and aromatic coffee for a truly sophisticated experience.</p>
        <p>Maca root is an ancient Peruvian superfood known for its energy-boosting properties and natural support for hormonal balance and vitality.</p>
      `;
      const result = parseLongDescription(html);

      expect(result.sectionTitle).toBe("Stamina & Libido Boost");
      expect(result.paragraphs).toHaveLength(2);
      expect(result.paragraphs[0]).toContain("Maca root, cocoa & coffee");
      expect(result.paragraphs[1]).toContain("ancient Peruvian superfood");
    });
  });

  describe("combineLongDescription", () => {
    it("combines title and paragraphs into HTML", () => {
      const result = combineLongDescription("Test Title", [
        "First paragraph.",
        "Second paragraph.",
      ]);

      expect(result).toContain("<h3>Test Title</h3>");
      expect(result).toContain("<p>First paragraph.</p>");
      expect(result).toContain("<p>Second paragraph.</p>");
    });

    it("omits title when empty", () => {
      const result = combineLongDescription("", [
        "First paragraph.",
        "Second paragraph.",
      ]);

      expect(result).not.toContain("<h3>");
      expect(result).toContain("<p>First paragraph.</p>");
      expect(result).toContain("<p>Second paragraph.</p>");
    });

    it("omits title when whitespace only", () => {
      const result = combineLongDescription("   ", ["Paragraph content."]);

      expect(result).not.toContain("<h3>");
      expect(result).toContain("<p>Paragraph content.</p>");
    });

    it("filters out empty paragraphs", () => {
      const result = combineLongDescription("Title", [
        "Content",
        "",
        "   ",
        "More content",
      ]);

      expect(result).toContain("<p>Content</p>");
      expect(result).toContain("<p>More content</p>");
      expect(result.match(/<p>/g)?.length).toBe(2);
    });

    it("returns empty string when all paragraphs empty", () => {
      const result = combineLongDescription("Title", ["", "   ", ""]);

      expect(result).toBe("");
    });

    it("returns empty string when paragraphs array is empty", () => {
      const result = combineLongDescription("Title", []);

      expect(result).toBe("");
    });

    it("formats HTML correctly with proper spacing", () => {
      const result = combineLongDescription("Title", ["Para 1", "Para 2"]);

      // Should have newlines between elements
      expect(result).toContain("\n");
      expect(result.trim()).toBe(result); // Should be trimmed
    });

    it("handles special characters in content", () => {
      const result = combineLongDescription("Title with & special", [
        "Content with \"quotes\" and 'apostrophes'.",
      ]);

      expect(result).toContain("<h3>Title with & special</h3>");
      expect(result).toContain('"quotes"');
      expect(result).toContain("'apostrophes'");
    });

    it("preserves paragraph order", () => {
      const paragraphs = ["First", "Second", "Third", "Fourth"];
      const result = combineLongDescription("Title", paragraphs);

      const firstIndex = result.indexOf("First");
      const secondIndex = result.indexOf("Second");
      const thirdIndex = result.indexOf("Third");
      const fourthIndex = result.indexOf("Fourth");

      expect(firstIndex).toBeLessThan(secondIndex);
      expect(secondIndex).toBeLessThan(thirdIndex);
      expect(thirdIndex).toBeLessThan(fourthIndex);
    });

    it("trims whitespace from title and paragraphs", () => {
      const result = combineLongDescription("  Title  ", [
        "  Para 1  ",
        "  Para 2  ",
      ]);

      expect(result).toContain("<h3>Title</h3>");
      expect(result).toContain("<p>Para 1</p>");
      expect(result).toContain("<p>Para 2</p>");
    });

    it("handles single paragraph correctly", () => {
      const result = combineLongDescription("Title", ["Single paragraph."]);

      expect(result).toContain("<h3>Title</h3>");
      expect(result).toContain("<p>Single paragraph.</p>");
    });

    it("handles title-only (with at least one valid paragraph)", () => {
      const result = combineLongDescription("Title", ["Content"]);

      expect(result).toContain("<h3>Title</h3>");
      expect(result).toContain("<p>Content</p>");
    });
  });

  describe("Integration: parse then combine", () => {
    it("round-trips simple HTML correctly", () => {
      const originalHtml = "<h3>Title</h3>\n  <p>Paragraph content.</p>";
      const parsed = parseLongDescription(originalHtml);
      const combined = combineLongDescription(
        parsed.sectionTitle,
        parsed.paragraphs,
      );

      expect(combined).toContain("<h3>Title</h3>");
      expect(combined).toContain("<p>Paragraph content.</p>");
    });

    it("round-trips complex HTML correctly", () => {
      const originalHtml = `
        <h3>Stamina & Libido Boost</h3>
        <p>First paragraph content.</p>
        <p>Second paragraph content.</p>
      `;
      const parsed = parseLongDescription(originalHtml);
      const combined = combineLongDescription(
        parsed.sectionTitle,
        parsed.paragraphs,
      );

      expect(combined).toContain("<h3>Stamina & Libido Boost</h3>");
      expect(combined).toContain("<p>First paragraph content.</p>");
      expect(combined).toContain("<p>Second paragraph content.</p>");
    });

    it("preserves content through round-trip", () => {
      const sectionTitle = "Original Title";
      const paragraphs = ["Paragraph one.", "Paragraph two."];

      const combined = combineLongDescription(sectionTitle, paragraphs);
      const parsed = parseLongDescription(combined);

      expect(parsed.sectionTitle).toBe(sectionTitle);
      expect(parsed.paragraphs).toEqual(paragraphs);
    });
  });
});
