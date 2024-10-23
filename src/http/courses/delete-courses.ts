import { URLBase } from "../config";
import { z } from "zod";

export const courseDeleteSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteCourseRequest = z.infer<typeof courseDeleteSchema>;

export async function deleteCourse(props: DeleteCourseRequest) {
  const validated = courseDeleteSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(`${URLBase}/api/courses/${validated.data.id}`, {
    method: "DELETE",
  });

  return response;
}
