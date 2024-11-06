import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await getCourses();

    return NextResponse.json({ courses }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

async function getCourses() {
  const courses = await prisma.course.findMany({
    where: {
      category: {
        isActive: true,
      },
      starred: true,
    },
    orderBy: {
      createdAt: "desc",
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
      createdAt: true,
    },
  });

  return courses;
}
