import { prisma } from "@/lib/prisma";
import CommunityListClient from "./CommunityListClient";

export default async function CommunityPage() {
  const [testimonials, instagramPosts] = await Promise.all([
    prisma.testimonial.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        text: true,
        customerName: true,
        avatarColor: true,
        rating: true,
        order: true,
        updatedAt: true,
      },
    }),
    prisma.instagramPost.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        postUrl: true,
        imageUrl: true,
        order: true,
        updatedAt: true,
      },
    }),
  ]);

  return (
    <CommunityListClient
      testimonials={testimonials}
      instagramPosts={instagramPosts}
    />
  );
}
