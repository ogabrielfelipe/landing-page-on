import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const company = await getCompany();

    return NextResponse.json({ company }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

async function getCompany() {
  const company = await prisma.company.findFirst({
    where: {},
    select: {
      name: true,
      about: true,
      contacts: true,
      document: true,
      city: true,
      latitude: true,
      longitude: true,
      neighborhood: true,
      number: true,
      state: true,
      street: true,
      zipCode: true,
    },
  });

  return company;
}
