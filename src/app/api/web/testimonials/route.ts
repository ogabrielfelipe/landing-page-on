import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const getTestimonialsSchema = z.object({
  page: z.number({ coerce: true }).optional().default(1),
  perPage: z.number({ coerce: true }).optional().default(1),
});

type GetTestimonialsRequest = z.infer<typeof getTestimonialsSchema>;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = getTestimonialsSchema.safeParse(
    Object.fromEntries(searchParams)
  );

  if (!query.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 }
    );
  }

  try {
    const testimonials = await getTestimonials(query.data);

    return NextResponse.json({ testimonials }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

async function getTestimonials({ page, perPage }: GetTestimonialsRequest) {
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
    take: perPage,
    skip: (page - 1) * perPage,
  });

  return testimonials;
}
