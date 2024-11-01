import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const courseSchemaEdit = z.object({
  name: z.string(),
  shortDescription: z.string(),
  categoryId: z.string().uuid(),
  description: z.string(),
  image: z.string(),
  level: z.enum(["INITIAL", "INTERMEDIARY", "ADVANCED"]).default("INITIAL"),
  duration: z.number({ coerce: true }),
  starred: z.boolean().optional().default(false),
  instructor: z.string(),
});
type EditCoursesRequest = z.infer<typeof courseSchemaEdit>;

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const body = await request.json();

  const bodyValidated = courseSchemaEdit.safeParse(body);
  if (!bodyValidated.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const course = await findById(id);

  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  const category = await findCategoryById(bodyValidated.data.categoryId);

  if (!category) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  try {
    await editCourse(course.id, bodyValidated.data);
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

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  const course = await findById(id);

  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  try {
    await deleteCourse(course.id);
    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

async function editCourse(id: string, data: EditCoursesRequest) {
  const course = await prisma.course.update({
    where: {
      id,
    },
    data,
  });
  return course;
}

async function deleteCourse(id: string) {
  const course = await prisma.course.delete({
    where: { id },
  });
  return course;
}

async function findById(id?: string) {
  const course = await prisma.course.findUnique({
    where: { id },
  });
  return course;
}

async function findCategoryById(categoryId: string) {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  return category;
}
