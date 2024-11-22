import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

type Contacts = {
  id: string;
  type: string;
  content: string;
};

type Company = {
  name: string;
  document: string;
  about: string;
  contacts: Contacts[];
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
};

type HeaderProps = {
  company: Company | null;
};

export default function Header({ company }: HeaderProps) {
  return (
    <>
      <header className="bg-blue-900 text-blue-100 text-center p-8 flex flex-wrap justify-evenly items-center">
        <Image
          src={
            "https://live.staticflickr.com/65535/54157911404_9f6fb3410a_o.png"
          }
          alt={`logo-${company?.name}`}
          width={150}
          height={150}
        />
        {company?.name ? (
          <h1 className="m-0 text-2xl">{company?.name}</h1>
        ) : (
          <Skeleton className="h-14 w-60" />
        )}
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
