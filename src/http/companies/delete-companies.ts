import { URLBase } from "../config";
import { z } from "zod";

export const companyDeleteSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteCompanyRequest = z.infer<typeof companyDeleteSchema>;

export async function deleteCompany(props: DeleteCompanyRequest) {
  const validated = companyDeleteSchema.safeParse(props);

  if (!validated.success) {
    throw new Error("Invalid request");
  }

  const response = await fetch(
    `${URLBase}/api/companies/${validated.data.id}`,
    {
      method: "DELETE",
    }
  );

  return response;
}
