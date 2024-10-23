import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const courseSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  duration: z.number({ coerce: true }),
  starred: z.boolean().optional().default(false),
  instructor: z.string(),
});

type CreateCoursesRequest = z.infer<typeof courseSchema>;

export async function POST(request: Request) {
  const body = await request.json();
  const response = courseSchema.safeParse(body);

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

  try {
    await createCourses(response.data);
    return NextResponse.json({
      message: "Course created successfully",
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

const getCoursesSchema = z.object({
  page: z.number({ coerce: true }).optional().default(1),
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  starred: z.boolean().optional(),
  instructor: z.string().optional(),
});

type GetCoursesRequest = z.infer<typeof getCoursesSchema>;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = getCoursesSchema.safeParse(Object.fromEntries(searchParams));

  if (!query.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const courses = await getCourses(query.data);
  return NextResponse.json({ courses }, { status: 200 });
}

async function createCourses(data: CreateCoursesRequest) {
  const course = await prisma.course.create({
    data,
  });
  return course;
}

async function getCourses(props: GetCoursesRequest) {
  const { page = 1, ...search } = props;
  const courses = await prisma.course.findMany({
    where: {
      ...(search?.id && { id: search.id }),
      ...(search?.name && { name: { contains: search.name } }),
      ...(search?.description && {
        description: { contains: search.description },
      }),
      ...(search?.starred && { starred: search.starred }),
      ...(search?.instructor && {
        instructor: { contains: search.instructor },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    skip: (page - 1) * 10,
  });
  return courses;
}
