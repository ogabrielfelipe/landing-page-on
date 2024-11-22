import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const getCompanySchema = z.object({
  page: z.number({ coerce: true }).optional().default(1),
  perPage: z.number({ coerce: true }).optional().default(1),
});

type GetCompanyRequest = z.infer<typeof getCompanySchema>;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = getCompanySchema.safeParse(Object.fromEntries(searchParams));

  if (!query.success) {
    return NextResponse.json(
      { message: "Invalid query parameters" },
      { status: 400 }
    );
  }

  try {
    const company = await getCompany(query.data);

    return NextResponse.json({ company }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

async function getCompany({ page, perPage }: GetCompanyRequest) {
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
    take: perPage,
    skip: (page - 1) * perPage,
  });

  return company;
}
