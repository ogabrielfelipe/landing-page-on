import { URLBase } from "../config";

export async function getTestimonials() {
  const response = await fetch(`${URLBase}/api/web/testimonials`, {
    method: "GET",
  });

  return response;
}
