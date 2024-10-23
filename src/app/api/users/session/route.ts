import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const sessionSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type sessionRequest = z.infer<typeof sessionSchema>;

export async function POST(request: Request) {
  const body = await request.json();
  const response = sessionSchema.safeParse(body);

  if (!response.success) {
    const { errors } = response.error;
    return NextResponse.json(
      { message: "Invalid request body", errors },
      { status: 400 }
    );
  }

  try {
    const user = await findUserByEmail(response.data);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(
      response.data.password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: { ...user, password: undefined },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
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
