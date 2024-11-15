import { getCompany } from "@/http/web/get-company";
import {
  InstagramLogo,
  WhatsappLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";

type Contacts = {
  id: string;
  type: string;
  content: string;
};

async function getData() {
  if (process.env.NEXT_PUBLIC_SKIP_FETCH_ERRORS) {
    return {
      company: {
        name: "",
        document: "",
        about: "",
        contacts: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
      },
    };
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

export default async function Footer() {
  const company = await getData();

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
              {company?.contacts?.find(
                (contact: Contacts) => contact.type === "mail"
              )?.content
                ? `E-mail: ${
                    company.contacts?.find(
                      (contact: Contacts) => contact.type === "mail"
                    )?.content
                  }`
                : "E-mail não cadastrado"}
            </p>
            <p className="text-sm">
              {company?.contacts?.find(
                (contact: Contacts) => contact.type === "phone"
              )?.content
                ? `Telefone: ${
                    company.contacts?.find(
                      (contact: Contacts) => contact.type === "phone"
                    )?.content
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
                {company?.contacts?.find(
                  (contact: Contacts) => contact.type === "instagram"
                )?.content ? (
                  <a
                    href={`https://www.instagram.com/${
                      company.contacts?.find(
                        (contact: Contacts) => contact.type === "instagram"
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
                {company?.contacts?.find(
                  (contact: Contacts) => contact.type === "whatsapp"
                )?.content ? (
                  <a
                    href={`https://wa.me/+55${
                      company.contacts?.find(
                        (contact: Contacts) => contact.type === "whatsapp"
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
                {company?.contacts?.find(
                  (contact: Contacts) => contact.type === "youtube"
                )?.content ? (
                  <a
                    href={`https://www.youtube.com/${
                      company.contacts?.find(
                        (contact: Contacts) => contact.type === "youtube"
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
