import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
});

type userRequest = z.infer<typeof userSchema>;

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop() as string;

  const body = await request.json();
  const response = userSchema.safeParse(body);

  if (!response.success) {
    const { errors } = response.error;
    return NextResponse.json(
      { message: "Invalid request body", errors },
      { status: 400 }
    );
  }

  const user = await findUserById(id);

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  let password: string | null = null;
  if (response.data?.password && response.data.password.length > 0) {
    password = await hash(response.data.password, 12);
  } else {
    password = user.password;
  }

  const data = {
    name: user.name !== response.data?.name ? response.data?.name : user.name,
    email:
      user.email !== response.data?.email ? response.data?.email : user.email,
    password,
  };

  try {
    await updateUser(id, data);
    return NextResponse.json(
      {
        message: "User Updated",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 200 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop() as string;

  const totalUsers = await findUserCount();

  if (totalUsers === 1) {
    return NextResponse.json(
      { message: "Deleting a user is not allowed as there is only one" },
      { status: 401 }
    );
  }

  const user = await findUserById(id);

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 401 });
  }

  try {
    await deleteUser(id);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function findUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
}

async function findUserCount() {
  const userTotal = await prisma.user.count({});
  return userTotal;
}

async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}

async function updateUser(id: string, data: userRequest) {
  await prisma.user.update({
    where: {
      id,
    },
    data,
  });
}
