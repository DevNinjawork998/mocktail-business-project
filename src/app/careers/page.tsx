import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import * as S from "./page.styles";

export const metadata: Metadata = {
  title: "Careers | Mocktails On The Go",
  description:
    "Join the Mocktails On The Go team. Explore career opportunities at Malaysia's 1st adaptogenic mocktail brand.",
  alternates: { canonical: "https://mocktailsonthego.com/careers" },
  openGraph: {
    title: "Careers | Mocktails On The Go",
    description:
      "Join the Mocktails On The Go team. Explore career opportunities at Malaysia's 1st adaptogenic mocktail brand.",
    url: "https://mocktailsonthego.com/careers",
  },
};

export default function CareersPage() {
  return (
    <S.PageContainer>
      <Navigation />
      <S.ContentSection>
        <S.Title>Careers</S.Title>
        <S.Paragraph>
          Join us in changing the drinking scene! We&apos;re always looking for
          passionate individuals who share our vision of creating functional,
          delicious mocktails.
        </S.Paragraph>
        <S.Paragraph>
          Stay tuned for career opportunities. Follow us on social media to be
          the first to know when positions open up!
        </S.Paragraph>
      </S.ContentSection>
      <Footer />
    </S.PageContainer>
  );
}
