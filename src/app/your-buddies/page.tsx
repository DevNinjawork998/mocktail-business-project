import React from "react";
import { prisma } from "@/lib/prisma";
import Navigation from "@/components/Navigation/Navigation";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import Testimonials from "@/components/Testimonials/Testimonials";
import Community from "@/components/Community/Community";
import * as S from "./page.styles";

export default async function YourBuddiesPage() {
  const breadcrumbItems = [{ label: "Community" }];

  let testimonials = [];
  try {
    testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        text: true,
        customerName: true,
        avatarColor: true,
        rating: true,
      },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    testimonials = [];
  }

  let instagramPosts = [];
  try {
    instagramPosts = await prisma.instagramPost.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        postUrl: true,
        imageUrl: true,
      },
    });
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    instagramPosts = [];
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
