import { URLBase } from "../config";
import { z } from "zod";

export const categoriesSchema = z.object({
  name: z.string(),
});

export type CreateCategoriesRequest = z.infer<typeof categoriesSchema>;

export async function createCategory(props: CreateCategoriesRequest) {
  const validated = categoriesSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(`${URLBase}/api/categories`, {
    method: "POST",
    body: JSON.stringify(validated.data),
  });
  return response;
}
