"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { getCompany } from "@/http/web/get-company";
import { useEffect, useState } from "react";

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

export default function About() {
  const [company, setCompany] = useState<Company | null>(null);

  const fetchCompany = async () => {
    const res = await getCompany();
    const companyData = await res.json();

    let company: Company | null = null;

    if (!companyData.company || typeof companyData.company !== "object") {
      company = null;
    }

    company = {
      ...companyData.company,
      contacts:
        typeof companyData.company.contacts === "string"
          ? JSON.parse(companyData.company.contacts)
          : companyData.company.contacts,
    };

    setCompany(company);
  };

  useEffect(() => {
    Promise.all([fetchCompany()]);
  }, []);

  return (
    <>
      <Header company={company} />

      <main>
        <section
          id="abouts"
          aria-labelledby="about-titulo"
          className="m-2/3 h-screen max-m-screen m-auto overflow-hidden px-8 py-4"
        >
          <h2
            id="about-titulo"
            className="text-3xl font-bold text-blue-900 border-b-2 border-[#ff9800] pb-2 mb-3"
          >
            Sobre nossa Instituição
          </h2>

          <div
            className="m-3 text-black opacity-90"
            dangerouslySetInnerHTML={{ __html: company?.about || "" }}
          ></div>
        </section>
      </main>
      <Footer company={company} />
    </>
  );
}
