import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const _env = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NAME_LANDING_PAGE_ON: z.string().min(1),
  EMAIL_LANDING_PAGE_ON: z.string().email(),
  PASSWORD_LANDING_PAGE_ON: z.string().min(6),
});

async function main() {
  const validatedEnv = _env.safeParse(process.env);

  if (!validatedEnv.success) {
    throw new Error("Invalid env");
  }

  const env = validatedEnv.data;

  const NAME_ENV = env.NAME_LANDING_PAGE_ON;
  const EMAIL_ENV = env.EMAIL_LANDING_PAGE_ON;
  const PASSWORD_ENV = env.PASSWORD_LANDING_PAGE_ON;

  // console.log(environment);

  const password = await hash(PASSWORD_ENV, 12);

  Promise.all([
    await prisma.user.upsert({
      where: { email: EMAIL_ENV },
      update: {},
      create: {
        email: EMAIL_ENV,
        name: NAME_ENV,
        password,
      },
    }),

    await prisma.company.create({
      data: {
        name: "Tech Solutions Ltda",
        about:
          "A Tech Solutions é uma empresa especializada em desenvolvimento de software e soluções tecnológicas inovadoras, focada em atender as necessidades de nossos clientes com excelência.",
        document: "12345678000190",
        contacts:
          '[{"id":"7f1587d3-2bbe-4c9a-983d-f92a33ee75ca","type":"mail","content":"contact@mail.com"},{"id":"7f1587d3-2bbe-4c9a-983d-f92a33ee75c1","type":"whatsapp","content":"2299999-0000"}]',
        city: "São Paulo",
        neighborhood: "Jardins",
        number: "1234",
        state: "SP",
        street: "Avenida Paulista",
        zipCode: "01310-100",
      },
    }),

    await prisma.course.create({
      data: {
        name: "Técnico em Informática",
        shortDescription:
          "O curso de informática tem como objetivo capacitar os alunos a utilizarem ferramentas e recursos tecnológicos de forma eficiente, promovendo habilidades práticas e teóricas que são essenciais no mercado de trabalho atual.",
        description:
          "<p>Metodologia: O curso combina aulas teóricas com atividades práticas, permitindo que os alunos desenvolvam suas habilidades em um ambiente de aprendizado interativo. Projetos em grupo e estudos de caso são utilizados para reforçar o aprendizado. Público-Alvo: O curso é destinado a iniciantes que desejam adquirir conhecimentos básicos em informática, bem como a profissionais que buscam aprimorar suas habilidades tecnológicas. Duração: O curso tem duração de 40 horas, distribuídas em aulas semanais. </p>",
        duration: 6,
        starred: true,
        image: "",
        instructor: "John Doe",
        category: {
          create: {
            name: "Profissionalizante",
            isActive: true,
          },
        },
      },
    }),

    await prisma.course.create({
      data: {
        name: "Curso de Gutarra I",
        shortDescription:
          "O curso de Guitarra I tem como objetivo introduzir os alunos ao mundo da guitarra, proporcionando uma base sólida em técnicas, teoria musical e prática instrumental. Os alunos aprenderão a tocar suas primeiras músicas e desenvolver habilidades que os prepararão para avançar em seu aprendizado musical.",
        description:
          "<p>Metodologia: O curso combina aulas teóricas com prática instrumental, permitindo que os alunos desenvolvam suas habilidades em um ambiente colaborativo. Aulas práticas e exercícios individuais são complementados por atividades em grupo. Público-Alvo: O curso é destinado a iniciantes que desejam aprender a tocar guitarra, sem necessidade de experiência prévia. Duração: O curso tem duração de 40 horas, distribuídas em aulas semanais.</p>",
        duration: 6,
        starred: false,
        image: "",
        instructor: "Fulano de Tal",
        category: {
          create: {
            name: "Instrumental",
            isActive: true,
          },
        },
      },
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
