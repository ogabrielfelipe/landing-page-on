import { URLBase } from "../config";

export async function getCoursesStarred() {
  const response = await fetch(`${URLBase}/api/web/courses/starred`, {
    method: "GET",
  });

  return response;
}
