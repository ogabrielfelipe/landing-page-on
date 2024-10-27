import { URLBase } from "../config";
import { z } from "zod";

export const getCompaniesSchema = z.object({
  page: z.number({ coerce: true }).optional().default(1),
  perPage: z.number({ coerce: true }).optional().default(10),
  id: z.string().optional(),
  name: z.string().optional(),
  document: z.string().optional(),
});

export type GetCompaniesRequest = z.infer<typeof getCompaniesSchema>;

export async function getCompanies(props: GetCompaniesRequest) {
  const validated = getCompaniesSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(
    `${URLBase}/api/companies?${new URLSearchParams(
      validated.data as unknown as Record<string, string>
    )}`,
    {
      method: "GET",
    }
  );
  return response;
}
