import { URLBase } from "../config";
import { z } from "zod";

export const categoryDeleteSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteUserRequest = z.infer<typeof categoryDeleteSchema>;

export async function deleteUser(props: DeleteUserRequest) {
  const validated = categoryDeleteSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(`${URLBase}/api/users/${validated.data.id}`, {
    method: "DELETE",
  });

  return response;
}
