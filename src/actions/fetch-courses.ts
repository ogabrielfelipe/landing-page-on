"use server";

import { prisma } from "@/lib/prisma";

type Course = {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  level: string;
  instructor: string;
};

interface coursesFetch {
  courses: Course[];
}

export async function fetchCourses(): Promise<coursesFetch> {
  "use server";
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      level: true,
      duration: true,
      instructor: true,
    },
  });

  return { courses };
}
