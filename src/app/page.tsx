"use client";

import { WhatsappLogo, InstagramLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchStarredCourses } from "@/actions/fetch-courses-starred";
import Loading from "./admin/_components/loading";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Card from "@/components/card";

type Course = {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  level: string;
  instructor: string;
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCourses = async () => {
    const { courses } = await fetchStarredCourses();
    setCourses(courses);
  };

  useEffect(() => {
    setIsLoading(true);

    fetchCourses();

    setIsLoading(false);
  }, []);

  return (
    <>
      <Header />

      <main>
        <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
          <section
            id="intro"
            className="flex flex-col items-center justify-center flex-wrap text-center gap-4"
          >
            <h2 className="text-4xl font-bold text-blue-900">
              Bem-vindo à Excelência em Educação Musical
            </h2>
            <p>
              Descubra seu potencial musical com instrutores experientes e
              instalações de ponta.
            </p>
            <a
              href={"/courses"}
              className="inline-block bg-[#ff9800] text-white p-4 m-2 decoration-none rounded-md transition hover:bg-orange-500 hover:translate-y-1"
            >
              Explorar Cursos
            </a>
          </section>

          <section id="cursos" aria-labelledby="cursos-titulo">
            <h2
              id="cursos-titulo"
              className="text-3xl font-bold text-blue-900 border-b-2 border-[#ff9800] pb-2 mb-3"
            >
              Nossos Cursos em Destaque
            </h2>

            {courses ? (
              <Card contents={courses} />
            ) : (
              <div className="text-center m-10">
                <h1 className="text-lg font-bold text-black">
                  Ops... Ainda não há cursos Cadastrados
                </h1>
                <p>Mais não se preocupe, em breve iremos informar os cursos</p>
              </div>
            )}
          </section>
        </div>

        <section
          id="testimonials"
          aria-labelledby="testimonials-titulo"
          className="bg-blue-800 text-blue-100 px-10 w-full max-w-screen min-h-[50vh]  p-4 overflow-hidden"
        >
          <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
            <h2
              id="testimonials-titulo"
              className="text-3xl font-bold text-blue-100 border-b-2 border-[#ff9800] pb-2 mb-3"
            >
              Depoimentos de Alunos
            </h2>
            <blockquote className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-50 m-10">
              <p className="text-blue-50">
                "O Instituto Eduardo Meotte transformou minha paixão pela música
                em uma carreira próspera. Os instrutores são incríveis!"
              </p>
              <footer className="bg-blue-900 text-blue-50 p-2 mt-8 rounded-md font-bold text-center">
                - Ana L., Aluna de Violão
              </footer>
            </blockquote>
            <blockquote className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-50 m-10">
              <p className="text-blue-50">
                "O Instituto Eduardo Meotte transformou minha paixão pela música
                em uma carreira próspera. Os instrutores são incríveis!"
              </p>
              <footer className="bg-blue-900 text-blue-50 p-2 mt-8 rounded-md font-bold text-center">
                - Ana L., Aluna de Violão
              </footer>
            </blockquote>
          </div>
        </section>

        <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
          <section id="sobre" aria-labelledby="sobre-titulo">
            <h2
              id="sobre-titulo"
              className="text-3xl font-bold text-blue-900 border-b-2 border-[#ff9800] pb-2 mb-3"
            >
              Demais informações
            </h2>
            <p className="m-3 text-black opacity-90">
              O Instituto de Ensino Eduardo Meotte é dedicado a nutrir talentos
              musicais há mais de 20 anos. Nossa missão é proporcionar educação
              musical de alta qualidade em um ambiente inspirador e
              colaborativo.
            </p>
          </section>
        </div>
      </main>

      <Footer />

      {isLoading && <Loading />}
    </>
  );
}
