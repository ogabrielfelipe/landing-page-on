import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("password123", 12);

  Promise.all([
    await prisma.user.upsert({
      where: { email: "admin@admin.com" },
      update: {},
      create: {
        email: "admin@admin.com",
        name: "Admin",
        password,
      },
    }),
    await prisma.company.upsert({
      where: { document: "00000000000009" },
      update: {},
      create: {
        name: "Company Name",
        document: "00000000000009",
        about: "This is a Company of the example",
        zipCode: "00.000-0000",
        city: "City Name",
        state: "State Name",
        neighborhood: "Neighborhood Name",
        street: "Street Name",
        number: "S/N",
      },
    }),
    await prisma.category.createMany({
      data: [
        {
          name: "Instrumental",
          isActive: true,
          createdAt: new Date(),
        },
        {
          name: "Profissionalizante",
          isActive: true,
          createdAt: new Date(),
        },
      ],
    }),
  ]);
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
