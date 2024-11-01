import { URLBase } from "../config";
import { z } from "zod";

export const categoryActiveSchema = z.object({
  id: z.string().uuid(),
});

export type ActiveCategoriesRequest = z.infer<typeof categoryActiveSchema>;

export async function activeCategory(props: ActiveCategoriesRequest) {
  const validated = categoryActiveSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const { id } = validated.data;

  const response = await fetch(`${URLBase}/api/categories/${id}/active`, {
    method: "PATCH",
  });

  return response;
}
