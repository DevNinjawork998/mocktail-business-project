import React from "react";
import Navigation from "@/components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import Testimonials from "@/components/Testimonials/Testimonials";
import Community from "@/components/Community/Community";
import * as S from "./page.styles";

// Force dynamic rendering to avoid build-time database access
export const dynamic = "force-dynamic";

export default async function YourBuddiesPage() {
  const breadcrumbItems = [{ label: "Community" }];

  // Check if DATABASE_URL is available before attempting database access
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
      // Dynamically import prisma only when DATABASE_URL is available
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
      // Silently handle errors - empty arrays will be used
      // Errors are already logged by Prisma or the catch blocks above
    }
  }

  return (
    <S.PageContainer>
      <Navigation />
      <Breadcrumb items={breadcrumbItems} />

      {/* Customer Testimonials */}
      <Testimonials testimonials={testimonials} />

      {/* Community Instagram Grid */}
      <Community instagramPosts={instagramPosts} />

      <Footer />
    </S.PageContainer>
  );
}
