"use client";

import React from "react";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import * as S from "./page.styles";

export default function PrivacyPage() {
  return (
    <S.PageContainer>
      <Navigation />
      <S.ContentSection>
        <S.Title>Privacy Policy</S.Title>
        <S.Paragraph>
          At Mocktails On the Go, we take your privacy seriously and are committed
          to protecting your personal data in accordance with the Personal Data
          Protection Act 2010 (PDPA) of Malaysia, including amendments effective 2024–2025. This Privacy Policy explains how we
          collect, record, retain, store, use, analyze, process, and disclose your personal
          information when you visit our website or use our services.
        </S.Paragraph>
        <S.Paragraph>Last updated: January 2026</S.Paragraph>

        <S.PrivacySection>
          <S.SectionTitle>1. Personal Data Protection Act (PDPA) Compliance</S.SectionTitle>
          <S.Paragraph>
            Mocktails On the Go is committed to complying with the Personal Data
            Protection Act 2010 (Act 709) of Malaysia. We respect your privacy and
            are dedicated to protecting your personal data in accordance with the
            principles and requirements set forth in the PDPA.
          </S.Paragraph>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>2. Information We Collect</S.SectionTitle>
          <S.Paragraph>
            We may collect, record, retain, store, use, analyze, process, and disclose the following types of personal data:
          </S.Paragraph>
          <S.List>
            <S.ListItem>
              <S.StrongText>Personal Identification Information:</S.StrongText> Name,
              email address, phone number, delivery address
            </S.ListItem>
            <S.ListItem>
              <S.StrongText>Order Information:</S.StrongText> Products purchased,
              order history, payment information (processed securely through third-party
              payment processors)
            </S.ListItem>
            <S.ListItem>
              <S.StrongText>Communication Data:</S.StrongText> Messages sent through
              our contact forms, WhatsApp communications, customer service inquiries
            </S.ListItem>
            <S.ListItem>
              <S.StrongText>Technical Data:</S.StrongText> IP address, browser type,
              device information, website usage data through cookies and similar
              technologies
            </S.ListItem>
          </S.List>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>3. How We Use Your Information</S.SectionTitle>
          <S.Paragraph>
            We process your personal data only for lawful, necessary, and proportionate purposes, including:
          </S.Paragraph>
          <S.List>
            <S.ListItem>
              To process and fulfill your orders, including delivery arrangements.
            </S.ListItem>
            <S.ListItem>
              To communicate with you regarding your orders, inquiries, and customer
              service requests.
            </S.ListItem>
            <S.ListItem>
              To send you marketing communications (only with your explicit consent).
            </S.ListItem>
            <S.ListItem>
              To improve our website, products, and services based on usage patterns.
            </S.ListItem>
            <S.ListItem>
              To comply with legal obligations and prevent fraud.
            </S.ListItem>
          </S.List>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>4. Data Sharing and Disclosure</S.SectionTitle>
          <S.Paragraph>
            We do not sell your personal data. We may share your information with:
          </S.Paragraph>
          <S.List>
            <S.ListItem>
              <S.StrongText>Service Providers:</S.StrongText> Third-party companies
              that help us operate our business, such as payment processors, delivery
              services, and IT service providers, under strict confidentiality
              agreements
            </S.ListItem>
            <S.ListItem>
              <S.StrongText>Legal Requirements:</S.StrongText> When required by law,
              court order, or government regulation
            </S.ListItem>
            <S.ListItem>
              <S.StrongText>Business Transfers:</S.StrongText> In the event of a
              merger, acquisition, or sale of assets, your data may be transferred
              to the new entity
            </S.ListItem>
          </S.List>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>5. Data Security</S.SectionTitle>
          <S.Paragraph>
            We implement appropriate technical and organizational security measures to
            protect your personal data against unauthorized access, alteration,
            disclosure, or destruction. These measures include:
          </S.Paragraph>
          <S.List>
            <S.ListItem>Secure data transmission using encryption (SSL/TLS).</S.ListItem>
            <S.ListItem>Limited access to personal data on a need-to-know basis.</S.ListItem>
            <S.ListItem>Regular compliance audits and staff training.</S.ListItem>
          </S.List>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>6. Your Rights Under PDPA</S.SectionTitle>
          <S.Paragraph>
            Under the Personal Data Protection Act 2010, you have the following
            rights regarding your personal data:
          </S.Paragraph>
          <S.List>
            <S.ListItem>
              <S.StrongText>Right of Access & Correction:</S.StrongText> Request access to or correction of your data.
            </S.ListItem>
            <S.ListItem>
              <S.StrongText>Right to Withdraw Consent:</S.StrongText> Withdraw consent at any time.
            </S.ListItem>
            <S.ListItem>
              <S.StrongText>Right to Limit Processing:</S.StrongText> Restrict how your data is used.
            </S.ListItem>
            <S.ListItem>
              <S.StrongText>Right to Object:</S.StrongText> Object to processing in certain circumstances.
            </S.ListItem>
          </S.List>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>7. Data Retention</S.SectionTitle>
          <S.Paragraph>
            We will retain your personal data only for as long as necessary to fulfill
            the purposes outlined in this Privacy Policy, unless a longer retention
            period is required or permitted by law. When we no longer need your
            personal data, we will securely delete or anonymize it.
          </S.Paragraph>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>8. Cookies and Tracking Technologies</S.SectionTitle>
          <S.Paragraph>
            Our website uses cookies to enhance your browsing experience. By continuing to use our website, you consent to the use of cookies. You may withdraw consent at any time by adjusting your browser settings.
          </S.Paragraph>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>9. Liability Disclaimer</S.SectionTitle>
          <S.Paragraph>
            We disclaim responsibility for breaches beyond our reasonable control, including third-party service providers and external websites. We encourage you to review the privacy policies of any third-party sites you visit. Your use of such sites is at your own risk.
          </S.Paragraph>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>10. Changes to This Privacy Policy</S.SectionTitle>
          <S.Paragraph>
            We reserve the right to amend, vary, or revise this Privacy Policy at any time. By publishing the updated policy on our website, we deem that you have been notified. Continued use of our services constitutes valid and express consent to the revised terms.
          </S.Paragraph>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>11. Contact Us for Data Protection Matters</S.SectionTitle>
          <S.Paragraph>
            If you have any questions, concerns, or requests regarding this Privacy
            Policy or wish to exercise your rights under the PDPA, please contact us:
          </S.Paragraph>
          <S.Paragraph>
            <S.StrongText>Mocktails On the Go Email: krishanthini@mocktailsonthego.com</S.StrongText>
          </S.Paragraph>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>12. Consent</S.SectionTitle>
          <S.Paragraph>
            By using our website and services, you expressly consent to the continued collection, recording, retention, storage, use, analyzing, disclosure and processing of your personal data as described in this Privacy Policy. Your consent will continue until withdrawn.
          </S.Paragraph>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>13. Cross-border Transfers</S.SectionTitle>
          <S.Paragraph>
            If personal data is transferred outside Malaysia, we will ensure equivalent protection standards in line with PDPA requirements. Such transfers will only occur with your consent or where permitted by law.
          </S.Paragraph>
        </S.PrivacySection>

        <S.PrivacySection>
          <S.SectionTitle>14. Data Breach Notification</S.SectionTitle>
          <S.Paragraph>
            In the event of a personal data breach, we will notify the Personal Data Protection Commissioner and affected individuals within the timeframe required by law. We will also take immediate steps to mitigate risks and prevent recurrence.
          </S.Paragraph>
        </S.PrivacySection>
      </S.ContentSection>
      <Footer />
    </S.PageContainer>
  );
}
