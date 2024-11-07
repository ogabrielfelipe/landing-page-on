import { z } from "zod";

const _env = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().min(1),
  NEXT_PUBLIC_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
});

const validatedEnv = _env.safeParse(process.env);

if (!validatedEnv.success) {
  throw new Error("Invalid env");
}

export const env = validatedEnv.data;
