import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  courseSchema,
  CreateCoursesRequest,
} from "@/http/courses/create-courses";
import {
  GetCoursesRequest,
  getCoursesSchema,
} from "@/http/courses/get-courses";

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
  return NextResponse.json({ ...courses }, { status: 200 });
}

async function createCourses(data: CreateCoursesRequest) {
  const course = await prisma.course.create({
    data,
  });
  return course;
}

async function getCourses(props: GetCoursesRequest) {
  console.log(props);

  const { page, perPage, ...search } = props;

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
    take: perPage,
    skip: (page - 1) * perPage,
  });

  const countCourses = await prisma.course.count({
    where: {
      ...(search?.id && { id: search.id }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    courses,
    page,
    perPage,
    totalPage: Math.ceil(countCourses / perPage),
    total: countCourses,
  };
}
