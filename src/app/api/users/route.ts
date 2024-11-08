import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

type userRequest = z.infer<typeof userSchema>;

const TOTAL_USERS_ALLOWED = 2;

export async function POST(request: Request) {
  const body = await request.json();
  const response = userSchema.safeParse(body);

  if (!response.success) {
    const { errors } = response.error;
    return NextResponse.json(
      { message: "Invalid request body", errors },
      { status: 400 }
    );
  }

  const totalUsers = await getTotalUsers();

  if (totalUsers >= TOTAL_USERS_ALLOWED) {
    return NextResponse.json(
      {
        message: "Only 2 users are allowed",
      },
      { status: 401 }
    );
  }

  const verifyUsersByEmail = await getUserByEmail(response.data.email);

  if (verifyUsersByEmail) {
    return NextResponse.json(
      {
        message: "User with this email is already created",
      },
      { status: 401 }
    );
  }

  const passwordHashed = await hash(response.data.password, 12);

  const data = {
    name: response.data.name,
    email: response.data.email,
    password: passwordHashed,
  };

  try {
    await createUsers(data);
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function getTotalUsers() {
  const totalUser = prisma.user.count({});
  return totalUser;
}

async function getUserByEmail(email: string) {
  const user = prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}

async function createUsers({ name, email, password }: userRequest) {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  return user;
}

async function getUsers() {
  const users = prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return users;
}
