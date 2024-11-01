import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import {
  GetTestimonialsRequest,
  getTestimonialsSchema,
} from "@/http/testimonials/get-testimonials";

import {
  testimonialsSchema,
  CreateTestimonialsRequest,
} from "@/http/testimonials/create-testimonials";

export async function POST(request: Request) {
  const body = await request.json();
  const response = testimonialsSchema.safeParse(body);

  if (!response.success) {
    const { errors } = response.error;
    return NextResponse.json(
      {
        message: "Invalid request body",
        errors,
      },
      { status: 400 }
    );
  }

  const course = await getCourseById(response.data.courseId);

  if (!course) {
    return NextResponse.json(
      {
        message: "Course Not Found",
      },
      { status: 404 }
    );
  }

  try {
    await createTestimonials(response.data);
    return NextResponse.json({
      message: "Testimonial created successfully",
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

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
    return NextResponse.json({ ...testimonials }, { status: 200 });
  } catch (e) {
    console.log("Erros: ", e);
    return NextResponse.json({ errors: e }, { status: 500 });
  }
}

async function createTestimonials(data: CreateTestimonialsRequest) {
  const testimonial = await prisma.testimonial.create({
    data,
  });
  return testimonial;
}

async function getTestimonials(props: GetTestimonialsRequest) {
  const { page, perPage, ...search } = props;

  const testimonials = await prisma.testimonial.findMany({
    where: {
      ...(search?.id && { id: { contains: search.id } }),
      ...(search?.student && { student: { contains: search.student } }),
      ...(search?.description && {
        description: { contains: search.description },
      }),
      ...(search?.courseId && { courseId: { contains: search.courseId } }),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      course: true,
    },
    take: perPage,
    skip: (page - 1) * perPage,
  });

  const countTestimonials = await prisma.testimonial.count({
    where: {
      ...(search?.id && { id: { contains: search.id } }),
      ...(search?.student && { student: { contains: search.student } }),
      ...(search?.description && {
        description: { contains: search.description },
      }),
      ...(search?.courseId && { courseId: { contains: search.courseId } }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    testimonials: testimonials,
    page,
    perPage,
    totalPage: Math.ceil(countTestimonials / perPage),
    total: countTestimonials,
  };
}

async function getCourseById(courseId: string) {
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  return course;
}
