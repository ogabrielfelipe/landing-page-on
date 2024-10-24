import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Outros links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/admin"
                  className="text-sm hover:text-white transition-colors"
                >
                  Administração
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contatos</h3>
            <p className="text-sm">123 Tech Street, Silicon Valley, CA 94000</p>
            <p className="text-sm">Email: info@example.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-300 hover:text-white transition-colors"
              >
                <InstagramLogo size={32} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-blue-300 hover:text-white transition-colors"
              >
                <WhatsappLogo size={32} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-800 text-center">
          <p className="text-sm text-blue-400">
            &copy; {new Date().getFullYear()} Instituto de Ensino Eduardo
            Meotte. Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido por:{" "}
            <a
              href="https://portfolio-ogabrielfelipe.netlify.app/"
              target="_blank"
              className="text-blue-100"
            >
              ogabrielfelipe
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
