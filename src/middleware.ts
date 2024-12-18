export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/api/courses/:path*",
    "/api/testimonials/:path*",
    "/api/dashboard/:path*",
    "/api/categories/:path*",
    "/api/users/:path*",
  ],
};
