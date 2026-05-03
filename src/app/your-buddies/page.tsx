import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import Testimonials from "@/components/Testimonials/Testimonials";
import Community from "@/components/Community/Community";
import YourBuddiesPageWrapper from "./YourBuddiesPageWrapper";

export const metadata: Metadata = {
  title: "Your Buddies | Mocktails On The Go",
  description:
    "See what our community is saying about Mocktails On The Go. Real reviews from real customers who love our adaptogenic mocktails.",
  alternates: { canonical: "https://mocktailsonthego.com/your-buddies" },
  openGraph: {
    title: "Your Buddies | Mocktails On The Go",
    description:
      "See what our community is saying about Mocktails On The Go. Real reviews from real customers who love our adaptogenic mocktails.",
    url: "https://mocktailsonthego.com/your-buddies",
  },
};

export const dynamic = "force-dynamic";

export default async function YourBuddiesPage() {
  const breadcrumbItems = [{ label: "Community" }];

  const hasDatabaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DIRECT_URL ||
    process.env.PRISMA_DATABASE_URL;

  let testimonials: Array<{
    id: string;
    text: string;
    customerName: string;
    avatarColor: string;
    rating: number;
  }> = [];

  let instagramPosts: Array<{
    id: string;
    postUrl: string;
    imageUrl: string | null;
  }> = [];

  if (hasDatabaseUrl) {
    try {
      const { prisma } = await import("@/lib/prisma");

      [testimonials, instagramPosts] = await Promise.all([
        prisma.testimonial
          .findMany({
            orderBy: { order: "asc" },
            select: {
              id: true,
              text: true,
              customerName: true,
              avatarColor: true,
              rating: true,
            },
          })
          .catch(() => []),
        prisma.instagramPost
          .findMany({
            orderBy: { order: "asc" },
            select: {
              id: true,
              postUrl: true,
              imageUrl: true,
            },
          })
          .catch(() => []),
      ]);
    } catch (_error) {
      // Silently handle errors — empty arrays will be used
    }
  }

  return (
    <YourBuddiesPageWrapper>
      <Navigation />
      <Breadcrumb items={breadcrumbItems} />
      <Testimonials testimonials={testimonials} />
      <Community instagramPosts={instagramPosts} />
      <Footer />
    </YourBuddiesPageWrapper>
  );
}
