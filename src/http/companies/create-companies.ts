import { URLBase } from "../config";
import { z } from "zod";

export const companiesSchema = z.object({
  name: z.string(),
  document: z.string().min(14),
  about: z.string().min(150).max(2048),
  contacts: z.string().max(512),
  street: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type CreateCompaniesRequest = z.infer<typeof companiesSchema>;

export async function createCategory(props: CreateCompaniesRequest) {
  const validated = companiesSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(`${URLBase}/api/companies`, {
    method: "POST",
    body: JSON.stringify(validated.data),
  });
  return response;
}
