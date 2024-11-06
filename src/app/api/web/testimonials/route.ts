import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const testimonials = await getTestimonials();

    return NextResponse.json({ testimonials }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

async function getTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: {
      course: {
        category: {
          isActive: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      student: true,
      description: true,
      course: {
        select: {
          name: true,
          instructor: true,
        },
      },
      createdAt: true,
    },
  });

  return testimonials;
}
