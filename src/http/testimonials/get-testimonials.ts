import { URLBase } from "../config";
import { z } from "zod";

export const getTestimonialsSchema = z.object({
  page: z.number({ coerce: true }).optional().default(1),
  perPage: z.number({ coerce: true }).optional().default(10),
  id: z.string().uuid().optional(),
  student: z.string().optional(),
  description: z.string().optional(),
  courseId: z.string().uuid().optional(),
});

export type GetTestimonialsRequest = z.infer<typeof getTestimonialsSchema>;

export async function getTestimonials(props: GetTestimonialsRequest) {
  const validated = getTestimonialsSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(
    `${URLBase}/api/testimonials?${new URLSearchParams(
      validated.data as unknown as Record<string, string>
    )}`,
    {
      method: "GET",
    }
  );

  return response;
}
