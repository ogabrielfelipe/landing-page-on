import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const sessionSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type sessionRequest = z.infer<typeof sessionSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: { message: `Method ${req.method} Not Allowed` },
    });
  }

  const response = sessionSchema.safeParse(req.body);

  if (!response.success) {
    const { errors } = response.error;
    return res.status(400).json({ message: "Invalid request body", errors });
  }

  try {
    const user = await findUserByEmail(response.data);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await compare(
      response.data.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      user: { ...user, password: undefined },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findUserByEmail(data: sessionRequest) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  return user;
}
