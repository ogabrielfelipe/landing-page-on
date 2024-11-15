import { getCompany } from "@/http/web/get-company";
import Image from "next/image";

async function getData() {
  if (process.env.NEXT_PUBLIC_SKIP_FETCH_ERRORS) {
    const company = {
      name: "",
    };
    return company;
  }

  const res = await getCompany();
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  const company = data.company;

  const companyWithContacts = {
    ...company,
    contacts: JSON.parse(company.contacts),
  };

  return companyWithContacts;
}

export default async function Header() {
  const company = await getData();

  return (
    <>
      <header className="bg-blue-900 text-blue-100 text-center p-8 flex flex-wrap justify-evenly items-center">
        <Image
          src={
            "https://live.staticflickr.com/65535/54120123332_5e2356c26b_c.jpg"
          }
          alt={`logo-${company?.name}`}
          width={100}
          height={100}
        />
        <h1 className="m-0 text-2xl">{company?.name}</h1>
      </header>

      <nav
        className="bg-blue-800 text-blue-900 text-center p-4"
        aria-label="Navegação principal"
      >
        <a
          className="text-blue-100 decoration-none hover:text-blue-500 p-1 m-0.5"
          href="/"
        >
          Página Inicial
        </a>
        <a
          className="text-blue-100 decoration-none hover:text-blue-500 p-1 m-0.5"
          href="/courses"
        >
          Cursos
        </a>
        <a
          className="text-blue-100 decoration-none hover:text-blue-500 p-1 m-0.5"
          href="/about"
        >
          Sobre
        </a>
      </nav>
    </>
  );
}
