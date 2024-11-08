import { URLBase } from "../config";
import { z } from "zod";

export const usersSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUsersRequest = z.infer<typeof usersSchema>;

export async function createUser(props: CreateUsersRequest) {
  const validated = usersSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(`${URLBase}/api/users`, {
    method: "POST",
    body: JSON.stringify(validated.data),
  });
  return response;
}
