import { URLBase } from "../config";

export async function getDetailsCourse(id: string) {
  const response = await fetch(`${URLBase}/api/web/courses/${id}/details`, {
    method: "GET",
  });

  return response;
}
