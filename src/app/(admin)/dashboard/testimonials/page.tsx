import { prisma } from "@/lib/prisma";
import TestimonialsListClient from "./TestimonialsListClient";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
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
  });

  return <TestimonialsListClient testimonials={testimonials} />;
}
