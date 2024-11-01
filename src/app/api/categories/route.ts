import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  categoriesSchema,
  CreateCategoriesRequest,
} from "@/http/categories/create-categories";

import {
  GetCategoriesRequest,
  getCategoriesSchema,
} from "@/http/categories/get-categories";

export async function POST(request: Request) {
  const body = await request.json();
  const response = categoriesSchema.safeParse(body);

  if (!response.success) {
    const { errors } = response.error;
    return NextResponse.json(
      {
        message: "Invalid request body",
        errors,
      },
      { status: 400 }
    );
  }

  try {
    await createCategories(response.data);
    return NextResponse.json({
      message: "Category created successfully",
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = getCategoriesSchema.safeParse(Object.fromEntries(searchParams));

  if (!query.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const categories = await getCategories(query.data);
  return NextResponse.json({ ...categories }, { status: 200 });
}

async function createCategories(data: CreateCategoriesRequest) {
  const course = await prisma.category.create({
    data: {
      name: data.name,
      isActive: true,
    },
  });
  return course;
}

async function getCategories(props: GetCategoriesRequest) {
  const { page, perPage, ...search } = props;

  const categories = await prisma.category.findMany({
    where: {
      ...(search?.id && { id: search.id }),
      ...(search?.name && { name: { contains: search.name } }),
      ...(search?.isActive && { isActive: search.isActive }),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: perPage,
    skip: (page - 1) * perPage,
  });

  const countCategories = await prisma.category.count({
    where: {
      ...(search?.id && { id: search.id }),
      ...(search?.name && { name: { contains: search.name } }),
      ...(search?.isActive && { isActive: search.isActive }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    categories,
    page,
    perPage,
    totalPage: Math.ceil(countCategories / perPage),
    total: countCategories,
  };
}
