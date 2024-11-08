import { URLBase } from "../config";
import { z } from "zod";

export const userEditSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

export type EditCategoriesRequest = z.infer<typeof userEditSchema>;

export async function editUser(props: EditCategoriesRequest) {
  const validated = userEditSchema.safeParse(props);

  if (!validated.success) {
    console.log(validated.error.formErrors);
    throw new Error("Invalid request");
  }

  const { id } = validated.data;

  const response = await fetch(`${URLBase}/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(validated.data),
  });

  return response;
}
