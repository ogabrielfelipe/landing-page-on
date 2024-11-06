"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";

export default function About() {
  return (
    <>
      <Header />

      <main>
        <section
          id="abouts"
          aria-labelledby="about-titulo"
          className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4"
        >
          <h2
            id="about-titulo"
            className="text-3xl font-bold text-blue-900 border-b-2 border-[#ff9800] pb-2 mb-3"
          >
            Sobre nossa escola
          </h2>

          <p className="m-3 text-black opacity-90">
            O Instituto de Ensino Eduardo Meotte é dedicado a nutrir talentos
            musicais há mais de 20 anos. Nossa missão é proporcionar educação
            musical de alta qualidade em um ambiente inspirador e colaborativo.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
