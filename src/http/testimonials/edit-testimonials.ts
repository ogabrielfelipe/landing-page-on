import { URLBase } from "../config";
import { z } from "zod";

export const testimonialEditSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(10).max(255),
});

export type EditTestimonialsRequest = z.infer<typeof testimonialEditSchema>;

export async function editTestimonial(props: EditTestimonialsRequest) {
  const validated = testimonialEditSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const { id, ...rest } = validated.data;

  const response = await fetch(`${URLBase}/api/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(rest),
  });

  return response;
}
