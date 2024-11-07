import { URLBase } from "../config";

export async function getCourses() {
  const response = await fetch(`${URLBase}/api/web/courses`, {
    method: "GET",
  });

  return response;
}
