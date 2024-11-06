import { URLBase } from "../config";

export async function getCompany() {
  const response = await fetch(`${URLBase}/api/web/company`, {
    method: "GET",
  });

  return response;
}
