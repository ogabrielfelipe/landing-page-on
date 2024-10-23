import { URLBase } from "../config";
import { z } from "zod";

export const courseSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  duration: z.number({ coerce: true }),
  starred: z.boolean().optional().default(false),
  instructor: z.string(),
});

export type CreateCoursesRequest = z.infer<typeof courseSchema>;

export async function createCourse(props: CreateCoursesRequest) {
  const validated = courseSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(`${URLBase}/api/courses`, {
    method: "POST",
    body: JSON.stringify(validated.data),
  });
  return response;
}
