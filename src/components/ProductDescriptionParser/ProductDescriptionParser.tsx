"use client";

import * as S from "./ProductDescriptionParser.styles";

interface ProductDescriptionParserProps {
  htmlContent: string;
}

interface ParsedSection {
  title: string;
  paragraphs: string[];
  isList?: boolean;
}

const stripTags = (html: string): string =>
  html.replace(/<[^>]*>/g, "").trim();

const parseHTML = (html: string): ParsedSection[] => {
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  const tokenRegex = /<(h3|p|ul)(?:[^>]*)>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = tokenRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const inner = match[2];

    if (tag === "h3") {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: stripTags(inner), paragraphs: [] };
    } else if (tag === "p" && currentSection) {
      const text = stripTags(inner);
      if (text) currentSection.paragraphs.push(text);
    } else if (tag === "ul" && currentSection) {
      const liRegex = /<li(?:[^>]*)>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liRegex.exec(inner)) !== null) {
        const text = stripTags(liMatch[1]);
        if (text) currentSection.paragraphs.push(text);
      }
      currentSection.isList = true;
    }
  }

  if (currentSection) sections.push(currentSection);

  if (sections.length === 0) {
    const pRegex = /<p(?:[^>]*)>([\s\S]*?)<\/p>/gi;
    const paragraphs: string[] = [];
    let pMatch;
    while ((pMatch = pRegex.exec(html)) !== null) {
      const text = stripTags(pMatch[1]);
      if (text) paragraphs.push(text);
    }
    if (paragraphs.length > 0) {
      sections.push({ title: "", paragraphs });
    }
  }

  return sections;
};

const extractKeyPoints = (text: string): string[] =>
  text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15 && !s.match(/^\W+$/))
    .map((s) => s.replace(/^[,\s]+|[,\s]+$/g, ""))
    .filter((s) => s.length > 0);

const generateSectionId = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ProductDescriptionParser({
  htmlContent,
}: ProductDescriptionParserProps): React.ReactElement {
  const sections = parseHTML(htmlContent);

  if (sections.length === 0) {
    return <S.EmptyDescription>No description available.</S.EmptyDescription>;
  }

  return (
    <S.DescriptionContainer>
      {sections.map((section, sectionIndex) => {
        const sectionId = section.title
          ? generateSectionId(section.title)
          : `section-${sectionIndex}`;
        return (
          <S.Section key={sectionIndex}>
            {section.title && (
              <S.SectionTitle
                id={sectionIndex === 0 ? "section-title" : sectionId}
              >
                {section.title}
              </S.SectionTitle>
            )}

            {section.paragraphs.length > 0 && (
              <S.ContentWrapper>
                {section.isList ? (
                  <S.KeyPointsList>
                    {section.paragraphs.map((item, itemIndex) => (
                      <S.KeyPoint key={itemIndex}>
                        <S.BulletIcon>•</S.BulletIcon>
                        <S.KeyPointText>{item}</S.KeyPointText>
                      </S.KeyPoint>
                    ))}
                  </S.KeyPointsList>
                ) : (
                  section.paragraphs.map((paragraph, paraIndex) => {
                    if (paragraph.length > 120) {
                      const keyPoints = extractKeyPoints(paragraph);
                      if (keyPoints.length > 1) {
                        return (
                          <S.KeyPointsList key={paraIndex}>
                            {keyPoints.map((point, pointIndex) => (
                              <S.KeyPoint key={pointIndex}>
                                <S.BulletIcon>•</S.BulletIcon>
                                <S.KeyPointText>{point}.</S.KeyPointText>
                              </S.KeyPoint>
                            ))}
                          </S.KeyPointsList>
                        );
                      }
                    }

                    return (
                      <S.Paragraph key={paraIndex}>{paragraph}</S.Paragraph>
                    );
                  })
                )}
              </S.ContentWrapper>
            )}
          </S.Section>
        );
      })}
    </S.DescriptionContainer>
  );
}
