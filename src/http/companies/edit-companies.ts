import { URLBase } from "../config";
import { z } from "zod";

export const companyEditSchema = z.object({
  id: z.string().uuid(),
  data: z.object({
    name: z.string(),
    document: z.string().min(14),
    about: z.string().min(150).max(2048),
    contacts: z.string().max(1024),
    street: z.string().min(1),
    number: z.string().min(1),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    latitude: z.string().optional().default("0"),
    longitude: z.string().optional().default("0"),
  }),
});

export type EditCompaniesRequest = z.infer<typeof companyEditSchema>;

export async function editCompany(props: EditCompaniesRequest) {
  const validated = companyEditSchema.safeParse(props);

  if (!validated.success) {
    console.log(validated.error);
    throw new Error("Invalid request");
  }

  const { id } = validated.data;

  const response = await fetch(`${URLBase}/api/companies/${id}`, {
    method: "PUT",
    body: JSON.stringify(validated.data),
  });

  return response;
}
