import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import {
  categoryEditSchema,
  EditCategoriesRequest,
} from "@/http/categories/edit-categories";

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const body = await request.json();

  const bodyValidated = categoryEditSchema.safeParse(body);

  if (!bodyValidated.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const category = await findById(id);

  if (!category) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  try {
    await editCategory(category.id, bodyValidated.data);
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

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  const category = await findById(id);

  if (!category) {
    return NextResponse.json(
      { message: "Category not found" },
      { status: 404 }
    );
  }

  try {
    await deleteCategory(category.id);
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

async function editCategory(id: string, data: EditCategoriesRequest) {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data,
  });
  return category;
}

async function deleteCategory(id: string) {
  const category = await prisma.category.delete({
    where: { id },
  });
  return category;
}

async function findById(id?: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category;
}
