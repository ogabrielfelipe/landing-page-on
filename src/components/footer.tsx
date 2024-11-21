import {
  InstagramLogo,
  WhatsappLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
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

type FooterProps = {
  company: Company | null;
};

const Footer = ({ company }: FooterProps) => {
  return (
    <footer className="bg-blue-900 text-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Demais links</h3>
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
              <span className="text-sm font-bold">Endereço: </span>
              {company?.street ? (
                <>
                  {company?.street +
                    ", Número: " +
                    company?.number +
                    ", " +
                    company?.city +
                    " - " +
                    company?.state +
                    ", CEP: " +
                    company?.zipCode +
                    "."}
                </>
              ) : (
                <Skeleton className="h-8 w-60" />
              )}
            </p>
            <p className="text-sm">
              {company?.contacts?.find(
                (contact: Contacts) => contact.type === "mail"
              )?.content ? (
                <>
                  <span className="text-sm font-bold">E-mail: </span>
                  {
                    company.contacts?.find(
                      (contact: Contacts) => contact.type === "mail"
                    )?.content
                  }
                </>
              ) : (
                "E-mail não cadastrado"
              )}
            </p>
            <p className="text-sm">
              {company?.contacts?.find(
                (contact: Contacts) => contact.type === "phone"
              )?.content ? (
                <>
                  <span className="text-sm font-bold">Telefone: </span>
                  {
                    company.contacts?.find(
                      (contact: Contacts) => contact.type === "phone"
                    )?.content
                  }
                </>
              ) : (
                "Telefone não cadastrado"
              )}
            </p>
          </div>
          <div className="space-y-4 ">
            <h3 className="text-lg font-semibold">Redes Sociais</h3>
            <div className="">
              <div className="flex flex-col align-middle gap-1">
                {company?.contacts?.find(
                  (contact: Contacts) => contact.type === "instagram"
                )?.content ? (
                  company.contacts
                    ?.filter(
                      (contact: Contacts) => contact.type === "instagram"
                    )
                    .map((contacts) => {
                      return (
                        <a
                          key={contacts.id}
                          href={`https://www.instagram.com/${contacts.content}`}
                          className="hover:text-white transition-colors flex text-left items-center gap-1"
                        >
                          <InstagramLogo size={32} />
                          <span className="text-sm min-w-32">
                            {contacts.content}
                          </span>
                        </a>
                      );
                    })
                ) : (
                  <></>
                )}
              </div>
              <div className="flex flex-col align-middle gap-1">
                {company?.contacts?.find(
                  (contact: Contacts) => contact.type === "whatsapp"
                )?.content ? (
                  company.contacts
                    ?.filter((contact: Contacts) => contact.type === "whatsapp")
                    .map((contacts) => {
                      return (
                        <a
                          key={contacts.id}
                          href={`https://wa.me/+55${contacts.content}`}
                          className="hover:text-white transition-colors flex text-left items-center gap-1"
                        >
                          <WhatsappLogo size={32} />
                          <span className="text-sm min-w-32">
                            {contacts.content.replace(
                              /^(\d{2})(\d{5})(\d{4})$/,
                              "($1) $2-$3"
                            )}
                          </span>
                        </a>
                      );
                    })
                ) : (
                  <></>
                )}
              </div>

              <a
                href="#"
                className="text-blue-300 hover:text-white transition-colors"
              >
                {company?.contacts?.find(
                  (contact: Contacts) => contact.type === "youtube"
                )?.content ? (
                  company.contacts
                    ?.filter((contact: Contacts) => contact.type === "youtube")
                    .map((contacts) => {
                      return (
                        <a
                          key={contacts.id}
                          href={`https://www.youtube.com/@${contacts.content}`}
                          className="hover:text-white transition-colors flex text-left items-center gap-1"
                        >
                          <YoutubeLogo size={32} />
                          <span className="text-sm min-w-32">
                            {contacts.content.split(/(?=[A-Z])/)}
                          </span>
                        </a>
                      );
                    })
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
              href="https://gafvi.com.br/"
              target="_blank"
              className="text-blue-100 hover:underline"
            >
              Gabriel Felipe
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
