import { URLBase } from "../config";
import { z } from "zod";

export const getCategoriesSchema = z.object({
  page: z.number({ coerce: true }).optional().default(1),
  perPage: z.number({ coerce: true }).optional().default(10),
  id: z.string().optional(),
  name: z.string().optional(),
  isActive: z.boolean({ coerce: true }).optional(),
});

export type GetCategoriesRequest = z.infer<typeof getCategoriesSchema>;

export async function getCategories(props: GetCategoriesRequest) {
  const validated = getCategoriesSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(
    `${URLBase}/api/categories?${new URLSearchParams(
      validated.data as unknown as Record<string, string>
    )}`,
    {
      method: "GET",
    }
  );
  return response;
}
