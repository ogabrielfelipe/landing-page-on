import { URLBase } from "../config";
import { z } from "zod";

export const testimonialDeleteSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteTestimonialRequest = z.infer<typeof testimonialDeleteSchema>;

export async function deleteTestimonial(props: DeleteTestimonialRequest) {
  const validated = testimonialDeleteSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(
    `${URLBase}/api/testimonials/${validated.data.id}`,
    {
      method: "DELETE",
    }
  );

  return response;
}
