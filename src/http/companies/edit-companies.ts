import { URLBase } from "../config";
import { z } from "zod";

export const companyEditSchema = z.object({
  id: z.string().uuid(),
  data: z.object({
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
  }),
});

export type EditCompaniesRequest = z.infer<typeof companyEditSchema>;

export async function editCompany(props: EditCompaniesRequest) {
  const validated = companyEditSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const { id } = validated.data;

  const response = await fetch(`${URLBase}/api/companies/${id}`, {
    method: "PUT",
    body: JSON.stringify(validated.data),
  });

  return response;
}
