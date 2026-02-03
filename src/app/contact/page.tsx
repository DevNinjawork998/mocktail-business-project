"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import {
  PageContainer,
  ContentSection,
  Title,
  Paragraph,
} from "./page.styles";

export default function ContactPage() {
  return (
    <PageContainer>
      <Navigation />
      <ContentSection>
        <Title>Contact Us</Title>
        <Paragraph>
          We&apos;d love to hear from you! Reach out to us on{" "}
          <Link
            href="https://instagram.com/mocktailsonthego"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            Instagram @MocktailsOnTheGo
          </Link>{" "}
          or send us a message on WhatsApp.
        </Paragraph>
        <Paragraph>
          For business inquiries, partnerships, or press, please contact us at{" "}
          <Link
            href="mailto:info@mocktailsonthego.com"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            info@mocktailsonthego.com
          </Link>{" "}
          or through our social media channels.
        </Paragraph>
      </ContentSection>
      <Footer />
    </PageContainer>
  );
}
