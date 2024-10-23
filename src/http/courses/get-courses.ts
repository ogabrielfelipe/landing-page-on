import { URLBase } from "@/app/admin/page";
import { z } from "zod";

const getCoursesSchema = z.object({
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

type GetCoursesRequest = z.infer<typeof getCoursesSchema>;

export async function getCourses(props: GetCoursesRequest) {
  const response = await fetch(
    `${URLBase}/courses?${new URLSearchParams(
      props as unknown as Record<string, string>
    )}`,
    {
      method: "GET",
    }
  );
  return response.json();
}
