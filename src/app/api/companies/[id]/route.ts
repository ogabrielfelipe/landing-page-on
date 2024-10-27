import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import {
  companyEditSchema,
  EditCompaniesRequest,
} from "@/http/companies/edit-companies";

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const body = await request.json();

  const bodyValidated = companyEditSchema.safeParse(body);

  if (!bodyValidated.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const company = await findById(id);

  if (!company) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  try {
    await editCompany(company.id, bodyValidated.data);
    return NextResponse.json(
      { message: "Company updated successfully" },
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

  const company = await findById(id);

  if (!company) {
    return NextResponse.json({ message: "Company not found" }, { status: 404 });
  }

  try {
    await deleteCompany(company.id);
    return NextResponse.json(
      { message: "Company deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

async function editCompany(id: string, data: EditCompaniesRequest) {
  const company = await prisma.company.update({
    where: {
      id,
    },
    data,
  });
  return company;
}

async function deleteCompany(id: string) {
  const company = await prisma.company.delete({
    where: { id },
  });
  return company;
}

async function findById(id?: string) {
  const company = await prisma.company.findUnique({
    where: { id },
  });
  return company;
}
