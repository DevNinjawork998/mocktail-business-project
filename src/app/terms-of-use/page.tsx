"use client";

import React from "react";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import * as S from "./page.styles";

export default function TermsOfUsePage() {
  return (
    <S.PageContainer>
      <Navigation />
      <S.ContentSection>
        <S.Title>Terms of Use</S.Title>
        <S.Paragraph>
          Welcome to Mocktails On the Go. Please read this disclaimer carefully
          before using our website or purchasing our products.
        </S.Paragraph>

        <S.DisclaimerSection>
          <S.SectionTitle>Health Claims Disclaimer</S.SectionTitle>
          <S.Paragraph>
            The statements made on this website regarding our products have not
            been evaluated by health authorities. Our products are not intended to diagnose,
            treat, cure, or prevent any disease or medical condition.
          </S.Paragraph>
          <S.Paragraph>
            Any health-related information provided on this website is for
            informational purposes only and should not be considered as medical
            advice. Individual results may vary, and the benefits described may
            not be experienced by all users.
          </S.Paragraph>
        </S.DisclaimerSection>

        <S.DisclaimerSection>
          <S.SectionTitle>Product Information</S.SectionTitle>
          <S.Paragraph>
            While we strive to provide accurate and up-to-date information about
            our products, including ingredients, nutritional facts, and
            features, we cannot guarantee that all information is complete,
            current, or error-free. Product formulations may change, and
            information may be updated without notice.
          </S.Paragraph>
          <S.Paragraph>
            We recommend that you:
          </S.Paragraph>
          <S.List>
            <S.ListItem>
              Review product labels and ingredient lists before consumption
            </S.ListItem>
            <S.ListItem>
              Consult with a healthcare professional if you have any medical
              conditions, allergies, or{" "}
              <S.IndentedText>concerns</S.IndentedText>
            </S.ListItem>
            <S.ListItem>
              Contact us directly if you have questions about specific
              ingredients or product information
            </S.ListItem>
          </S.List>
        </S.DisclaimerSection>

        <S.DisclaimerSection>
          <S.SectionTitle>Allergen Information</S.SectionTitle>
          <S.Paragraph>
            Our products may contain allergens or be processed in facilities
            that handle allergens. While we make every effort to provide
            accurate allergen information, we cannot guarantee that our products
            are free from cross-contamination. If you have food allergies or
            sensitivities, please review ingredient lists carefully and consult
            with a healthcare professional before consuming our products.
          </S.Paragraph>
        </S.DisclaimerSection>

        <S.DisclaimerSection>
          <S.SectionTitle>Individual Results</S.SectionTitle>
          <S.Paragraph>
            Individual results from consuming our products may vary based on
            factors including but not limited to: individual health status,
            lifestyle, diet, exercise, genetics, and other personal factors. We
            do not guarantee specific results or outcomes from using our
            products.
          </S.Paragraph>
        </S.DisclaimerSection>

        <S.DisclaimerSection>
          <S.SectionTitle>Limitation of Liability</S.SectionTitle>
          <S.Paragraph>
            To the fullest extent permitted by law, Mocktails On the Go and its
            affiliates shall not be liable for any direct, indirect, incidental,
            special, consequential, or punitive damages arising from your use of
            our products or website, including but not limited to any health
            issues, allergic reactions, or adverse effects.
          </S.Paragraph>
        </S.DisclaimerSection>

        <S.DisclaimerSection>
          <S.SectionTitle>External Links</S.SectionTitle>
          <S.Paragraph>
            Our website may contain links to external websites that are not
            operated by us. We have no control over the content and practices of
            these sites and cannot accept responsibility for their content or
            privacy policies.
          </S.Paragraph>
        </S.DisclaimerSection>

        <S.Paragraph>Last updated January 2026</S.Paragraph>
      </S.ContentSection>
      <Footer />
    </S.PageContainer>
  );
}
