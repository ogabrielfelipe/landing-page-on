import { prisma } from "@/lib/prisma";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET() {
  const totalCourses = await getTotalCourses();
  const totalNewCourses = await getTotalNewCourses();
  const totalTestimonials = await getTotalTestimonials();

  return NextResponse.json(
    {
      total: {
        totalCourses,
        totalNewCourses,
        totalTestimonials,
      },
    },
    { status: 200 }
  );
}

async function getTotalCourses() {
  const courses = await prisma.course.count();
  return courses;
}

async function getTotalNewCourses() {
  const oneWeekAgo = moment().subtract(1, "weeks").toDate();
  const today = moment().toDate();

  const courses = await prisma.course.count({
    where: {
      createdAt: {
        lte: today,
        gte: oneWeekAgo,
      },
    },
  });

  return courses;
}

async function getTotalTestimonials() {
  const testimonials = await prisma.testimonial.count();

  return testimonials;
}
