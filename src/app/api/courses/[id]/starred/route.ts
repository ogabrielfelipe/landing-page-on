import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/")[3];

  const course = await findById(id);


  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  try {
    await editCourse(course.id, { starred: !course.starred });
    return NextResponse.json(
      { message: "Course updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

async function editCourse(id: string, data: { starred: boolean }) {
  const course = await prisma.course.update({
    where: {
      id,
    },
    data,
  });
  return course;
}

async function findById(id?: string) {
  const course = await prisma.course.findUnique({
    where: { id },
  });
  return course;
}
