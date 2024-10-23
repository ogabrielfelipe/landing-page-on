import { URLBase } from "../config";
import { z } from "zod";

export const courseEditSchema = z.object({
  id: z.string().uuid(),
});

export type StarredCourseRequest = z.infer<typeof courseEditSchema>;

export async function starredCourse(props: StarredCourseRequest) {
  const validated = courseEditSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(
    `${URLBase}/api/courses/${validated.data.id}/starred`,
    {
      method: "PATCH",
    }
  );

  return response;
}
