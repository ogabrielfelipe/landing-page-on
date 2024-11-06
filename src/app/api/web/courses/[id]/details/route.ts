import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/")[4];

  try {
    const courses = await getCourseById(id);

    return NextResponse.json({ courses }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

async function getCourseById(courseId: string) {
  const course = await prisma.course.findUniqueOrThrow({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      name: true,
      level: true,
      shortDescription: true,
      starred: true,
      duration: true,
      instructor: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      testimonials: true,
      description: true,
      image: true,
      createdAt: true,
    },
  });

  return course;
}
