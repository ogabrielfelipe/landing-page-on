import { getCompany } from "@/http/web/get-company";
import {
  InstagramLogo,
  WhatsappLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type Contacts = {
  id: string;
  type: string;
  content: string;
};

type Company = {
  about: string;
  city: string;
  contacts: Contacts[];
  document: string;
  latitude: string;
  longitude: string;
  name: string;
  neighborhood: string;
  number: string;
  state: string;
  street: string;
  zipCode: string;
};

export default function Footer() {
  const [company, setCompany] = useState<Company>();

  const fetchCompany = async () => {
    const companyFn = await getCompany();

    const data = await companyFn.json();

    if (companyFn.status === 200) {
      const contacts = JSON.parse(data.company.contacts);
      setCompany({ ...data.company, contacts });
      return;
    } else {
      return;
    }
  };

  useEffect(() => {
    Promise.all([fetchCompany()]);
  }, []);

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
            <p className="text-sm">
              {" "}
              {company?.number +
                " " +
                company?.street +
                ", " +
                company?.city +
                ", " +
                company?.state +
                " " +
                company?.zipCode}
            </p>
            <p className="text-sm">
              {company?.contacts.find((contact) => contact.type === "mail")
                ?.content
                ? `E-mail: ${
                    company.contacts.find((contact) => contact.type === "mail")
                      ?.content
                  }`
                : "E-mail não cadastrado"}
            </p>
            <p className="text-sm">
              {company?.contacts.find((contact) => contact.type === "phone")
                ?.content
                ? `Telefone: ${
                    company.contacts.find((contact) => contact.type === "phone")
                      ?.content
                  }`
                : "Telefone não cadastrado"}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-300 hover:text-white transition-colors"
              >
                {company?.contacts.find(
                  (contact) => contact.type === "instagram"
                )?.content ? (
                  <a
                    href={`https://www.instagram.com/${
                      company.contacts.find(
                        (contact) => contact.type === "instagram"
                      )?.content
                    }`}
                  >
                    <InstagramLogo size={32} />
                    <span className="sr-only">Instagram</span>
                  </a>
                ) : (
                  <></>
                )}
              </a>
              <a
                href="#"
                className="text-blue-300 hover:text-white transition-colors"
              >
                {company?.contacts.find(
                  (contact) => contact.type === "whatsapp"
                )?.content ? (
                  <a
                    href={`https://wa.me/+55${
                      company.contacts.find(
                        (contact) => contact.type === "whatsapp"
                      )?.content
                    }`}
                  >
                    <WhatsappLogo size={32} />
                    <span className="sr-only">Whatsapp</span>
                  </a>
                ) : (
                  <></>
                )}
              </a>

              <a
                href="#"
                className="text-blue-300 hover:text-white transition-colors"
              >
                {company?.contacts.find((contact) => contact.type === "youtube")
                  ?.content ? (
                  <a
                    href={`https://www.youtube.com/${
                      company.contacts.find(
                        (contact) => contact.type === "youtube"
                      )?.content
                    }`}
                  >
                    <YoutubeLogo size={32} />
                    <span className="sr-only">Whatsapp</span>
                  </a>
                ) : (
                  <></>
                )}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-800 text-center">
          <p className="text-sm text-blue-400">
            &copy; {new Date().getFullYear()} {company?.name}. Todos os direitos
            reservados.
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
