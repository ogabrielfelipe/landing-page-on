"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { getCompany } from "@/http/web/get-company";
import { useEffect, useState } from "react";

interface company {
  name: string;
  document: string;
  about: string;
  contacts: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
}

export default function About() {
  const [company, setCompany] = useState<company>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCompany();
        const { company } = await res.json();
        setCompany(company);
      } catch (error) {
        console.error("Erro ao buscar dados no cliente:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />

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
            Sobre nossa escola
          </h2>

          <div
            className="m-3 text-black opacity-90"
            dangerouslySetInnerHTML={{ __html: company?.about || "" }}
          ></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
