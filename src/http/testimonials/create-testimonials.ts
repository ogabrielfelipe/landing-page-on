import { URLBase } from "../config";
import { z } from "zod";

export const testimonialsSchema = z.object({
  student: z.string().min(1),
  description: z.string().min(10).max(255),
  courseId: z.string().uuid(),
});

export type CreateTestimonialsRequest = z.infer<typeof testimonialsSchema>;

export async function createTestimonial(props: CreateTestimonialsRequest) {
  const validated = testimonialsSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(`${URLBase}/api/testimonials`, {
    method: "POST",
    body: JSON.stringify(validated.data),
  });
  return response;
}
