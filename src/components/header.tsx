import Image from "next/image";

type HomeProps = {
  title?: string;
  image: string;
};

export default function Header({ title }: HomeProps) {
  return (
    <>
      <header className="bg-blue-900 text-blue-100 text-center p-8 flex flex-wrap justify-evenly items-center">
        <Image
          src={
            "https://live.staticflickr.com/65535/54120123332_5e2356c26b_c.jpg"
          }
          alt={`logo-${title}`}
          width={100}
          height={100}
        />
        <h1 className="m-0 text-2xl">{title}</h1>
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
        <a
          className="text-blue-100 decoration-none hover:text-blue-500 p-1 m-0.5"
          href="/contact"
        >
          Contato
        </a>
      </nav>
    </>
  );
}
