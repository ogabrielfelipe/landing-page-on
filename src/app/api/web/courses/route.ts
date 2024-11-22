import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const getCoursesSchema = z.object({
  page: z.number({ coerce: true }).optional().default(1),
  perPage: z.number({ coerce: true }).optional().default(100),
  starred: z.boolean({ coerce: true }).optional(),
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

  try {
    const courses = await getCourses(query.data);

    return NextResponse.json({ courses }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

async function getCourses(props: GetCoursesRequest) {
  const courses = await prisma.course.findMany({
    where: {
      ...(props?.starred && { starred: props.starred }),

      category: {
        isActive: true,
      },
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
