"use client";

import React from "react";
import * as S from "./ProductDescriptionParser.styles";

interface ProductDescriptionParserProps {
  htmlContent: string;
}

interface ParsedSection {
  title: string;
  paragraphs: string[];
}

export default function ProductDescriptionParser({
  htmlContent,
}: ProductDescriptionParserProps): JSX.Element {
  const parseHTML = (html: string): ParsedSection[] => {
    const sections: ParsedSection[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    let currentSection: ParsedSection | null = null;
    
    // Process all child nodes
    Array.from(doc.body.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        
        if (element.tagName === "H3") {
          // Save previous section if exists
          if (currentSection) {
            sections.push(currentSection);
          }
          // Start new section
          currentSection = {
            title: element.textContent?.trim() || "",
            paragraphs: [],
          };
        } else if (element.tagName === "P" && currentSection) {
          const text = element.textContent?.trim() || "";
          if (text) {
            currentSection.paragraphs.push(text);
          }
        }
      }
    });
    
    // Add last section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    // If no sections found, treat entire content as paragraphs
    if (sections.length === 0) {
      const paragraphs = Array.from(doc.body.querySelectorAll("p"))
        .map((p) => p.textContent?.trim() || "")
        .filter((text) => text.length > 0);
      
      if (paragraphs.length > 0) {
        sections.push({
          title: "",
          paragraphs,
        });
      }
    }
    
    return sections;
  };

  const extractKeyPoints = (text: string): string[] => {
    // Split by periods, commas, and other sentence endings
    // Filter out very short fragments and clean up
    const sentences = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15 && !s.match(/^\W+$/))
      .map((s) => s.replace(/^[,\s]+|[,\s]+$/g, "")) // Remove leading/trailing commas and spaces
      .filter((s) => s.length > 0);
    
    return sentences;
  };

  const sections = parseHTML(htmlContent);

  if (sections.length === 0) {
    return <S.EmptyDescription>No description available.</S.EmptyDescription>;
  }

  return (
    <S.DescriptionContainer>
      {sections.map((section, sectionIndex) => (
        <S.Section key={sectionIndex}>
          {section.title && (
            <S.SectionTitle>{section.title}</S.SectionTitle>
          )}
          
          {section.paragraphs.length > 0 && (
            <S.ContentWrapper>
              {section.paragraphs.map((paragraph, paraIndex) => {
                // For longer paragraphs, break into key points for better readability
                if (paragraph.length > 120) {
                  const keyPoints = extractKeyPoints(paragraph);
                  // Only use bullet points if we got meaningful splits
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
                
                // For shorter paragraphs or if splitting didn't work well, display as regular text
                return (
                  <S.Paragraph key={paraIndex}>{paragraph}</S.Paragraph>
                );
              })}
            </S.ContentWrapper>
          )}
        </S.Section>
      ))}
    </S.DescriptionContainer>
  );
}
