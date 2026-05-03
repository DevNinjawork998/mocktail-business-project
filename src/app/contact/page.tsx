import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Mocktails On The Go",
  description:
    "Get in touch with the Mocktails On The Go team. We'd love to hear from you about wholesale inquiries, collaborations, or any questions.",
  alternates: { canonical: "https://mocktailsonthego.com/contact" },
  openGraph: {
    title: "Contact Us | Mocktails On The Go",
    description:
      "Get in touch with the Mocktails On The Go team. We'd love to hear from you about wholesale inquiries, collaborations, or any questions.",
    url: "https://mocktailsonthego.com/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
