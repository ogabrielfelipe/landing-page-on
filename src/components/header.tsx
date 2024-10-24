export default function Header() {
  return (
    <>
      <header className="bg-blue-900 text-blue-100 text-center p-8">
        <h1 className="m-0 text-2xl">Instituto de Ensino Eduardo Meotte</h1>
        <p className="m-0 text-sm">Excelência em Educação Musical</p>
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
