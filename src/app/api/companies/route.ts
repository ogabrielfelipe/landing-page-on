import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import {
  GetCompaniesRequest,
  getCompaniesSchema,
} from "@/http/companies/get-companies";

import {
  companiesSchema,
  CreateCompaniesRequest,
} from "@/http/companies/create-companies";

export async function POST(request: Request) {
  const body = await request.json();
  const response = companiesSchema.safeParse(body);

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
    await createCompanies(response.data);
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
  const query = getCompaniesSchema.safeParse(Object.fromEntries(searchParams));

  if (!query.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const companies = await getCompanies(query.data);
  return NextResponse.json({ ...companies }, { status: 200 });
}

async function createCompanies(data: CreateCompaniesRequest) {
  const course = await prisma.company.create({
    data,
  });
  return course;
}

async function getCompanies(props: GetCompaniesRequest) {
  const { page, perPage, ...search } = props;

  const companies = await prisma.company.findMany({
    where: {
      ...(search?.id && { id: search.id }),
      ...(search?.name && { name: { contains: search.name } }),
      ...(search?.document && { name: { contains: search.document } }),
    },
    take: perPage,
    skip: (page - 1) * perPage,
  });

  const countCompanies = await prisma.company.count({
    where: {
      ...(search?.id && { id: search.id }),
      ...(search?.name && { name: { contains: search.name } }),
      ...(search?.document && { name: { contains: search.document } }),
    },
  });

  return {
    companies,
    page,
    perPage,
    totalPage: Math.ceil(countCompanies / perPage),
    total: countCompanies,
  };
}
