import { URLBase } from "../config";
import { z } from "zod";

export const categoryEditSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  isActive: z.boolean({ coerce: true }),
});

export type EditCategoriesRequest = z.infer<typeof categoryEditSchema>;

export async function editCategory(props: EditCategoriesRequest) {
  const validated = categoryEditSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const { id, ...rest } = validated.data;

  const response = await fetch(`${URLBase}/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(rest),
  });

  return response;
}
