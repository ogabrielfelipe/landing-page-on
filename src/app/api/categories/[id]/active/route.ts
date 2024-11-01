import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/")[3];

  const category = await findById(id);

  if (!category) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  try {
    await editCategory(category.id, !category.isActive);
    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

async function editCategory(id: string, isActive: boolean) {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      isActive,
    },
  });
  return category;
}

async function findById(id?: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category;
}
