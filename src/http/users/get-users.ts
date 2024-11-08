import { URLBase } from "../config";

export async function getUsers() {
  const response = await fetch(`${URLBase}/api/users`, {
    method: "GET",
  });
  return response;
}
