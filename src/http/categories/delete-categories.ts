import { URLBase } from "../config";
import { z } from "zod";

export const categoryDeleteSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteCategoryRequest = z.infer<typeof categoryDeleteSchema>;

export async function deleteCategory(props: DeleteCategoryRequest) {
  const validated = categoryDeleteSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(
    `${URLBase}/api/categories/${validated.data.id}`,
    {
      method: "DELETE",
    }
  );

  return response;
}
