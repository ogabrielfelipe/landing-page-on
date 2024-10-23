import { URLBase } from "../config";
import { z } from "zod";

export const getCoursesSchema = z.object({
  page: z.number({ coerce: true }).optional().default(1),
  search: z
    .object({
      name: z.string(),
      description: z.string(),
      starred: z.boolean().optional().default(false),
      instructor: z.string(),
    })
    .optional(),
});

export type GetCoursesRequest = z.infer<typeof getCoursesSchema>;

export async function getCourses(props: GetCoursesRequest) {
  const validated = getCoursesSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(
    `${URLBase}/api/courses?${new URLSearchParams(
      validated.data as unknown as Record<string, string>
    )}`,
    {
      method: "GET",
    }
  );
  return response;
}
