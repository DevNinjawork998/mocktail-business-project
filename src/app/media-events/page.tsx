import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import Footer from "@/components/Footer/Footer";
import * as S from "./page.styles";

export const metadata: Metadata = {
  title: "Media & Events | Mocktails On The Go",
  description:
    "Stay up to date with the latest news, media coverage, and events featuring Mocktails On The Go — Malaysia's 1st adaptogenic mocktail brand.",
  alternates: { canonical: "https://mocktailsonthego.com/media-events" },
  openGraph: {
    title: "Media & Events | Mocktails On The Go",
    description:
      "Stay up to date with the latest news, media coverage, and events featuring Mocktails On The Go — Malaysia's 1st adaptogenic mocktail brand.",
    url: "https://mocktailsonthego.com/media-events",
  },
};

// Sample events data
const upcomingEvents = [
  {
    date: "Coming Soon",
    title: "Pop-Up Market Experience",
    description:
      "Join us at our next pop-up market where you can taste all our flavors and meet the team!",
    icon: "🎪",
  },
  {
    date: "Stay Tuned",
    title: "Mocktail Masterclass",
    description:
      "Learn the art of crafting perfect mocktails with our founder. Register now for early bird pricing!",
    icon: "🎓",
  },
];

export default function MediaEventsPage() {
  return (
    <S.PageContainer>
      <Navigation />

      <S.HeroSection>
        <S.HeroTitle>Media & Events</S.HeroTitle>
        <S.HeroSubtitle>
          Stay connected with our latest events, press coverage, and community
          happenings
        </S.HeroSubtitle>
      </S.HeroSection>

      <S.ContentSection>
        <S.SectionTitle>Upcoming Events</S.SectionTitle>
        <S.EventsGrid>
          {upcomingEvents.map((event, index) => (
            <S.EventCard key={index}>
              <S.EventImage>{event.icon}</S.EventImage>
              <S.EventContent>
                <S.EventDate>{event.date}</S.EventDate>
                <S.EventTitle>{event.title}</S.EventTitle>
                <S.EventDescription>{event.description}</S.EventDescription>
                <S.EventButton
                  as="button"
                  disabled
                  style={{ opacity: 0.6, cursor: "not-allowed" }}
                >
                  Registration Opens Soon
                </S.EventButton>
              </S.EventContent>
            </S.EventCard>
          ))}
        </S.EventsGrid>

        <S.SectionTitle>In the Media</S.SectionTitle>
        <S.ComingSoon>
          <h3>Press Coverage Coming Soon</h3>
          <p>
            We&apos;re working on getting the word out! Check back here for our
            latest press mentions and media features.
          </p>
        </S.ComingSoon>
      </S.ContentSection>

      <Footer />
    </S.PageContainer>
  );
}
