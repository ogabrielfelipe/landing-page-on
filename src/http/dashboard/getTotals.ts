import { URLBase } from "../config";

export async function getTotals() {
  const response = await fetch(`${URLBase}/api/dashboard`, {
    method: "GET",
  });
  return response;
}
