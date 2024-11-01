import { URLBase } from "../config";
import { z } from "zod";

export const courseEditSchema = z.object({
  id: z.string().uuid(),
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

export type EditCoursesRequest = z.infer<typeof courseEditSchema>;

export async function editCourse(props: EditCoursesRequest) {
  const validated = courseEditSchema.safeParse(props);

  if (!validated.success) {
    console.log(validated.error.formErrors);
    throw new Error("Invalid request");
  }

  const { id, ...rest } = validated.data;

  const response = await fetch(`${URLBase}/api/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(rest),
  });

  return response;
}
