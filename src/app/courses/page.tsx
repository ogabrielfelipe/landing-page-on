"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import { useEffect } from "react";
import Header from "@/components/header";
import Card from "@/components/card";
import { getCourses } from "@/http/web/get-courses";

export default function Courses() {
  const [courses, setCourses] = useState<Record<string, string | number>[]>(
    Array<Record<string, string | number>>()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCourses();
        const { courses } = await res.json();
        setCourses(courses);
      } catch (error) {
        console.error("Erro ao buscar dados no client:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />

      <main>
        <section
          id="cursos"
          aria-labelledby="cursos-titulo"
          className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4"
        >
          <h2
            id="cursos-titulo"
            className="text-3xl font-bold text-blue-900 border-b-2 border-[#ff9800] pb-2 mb-3"
          >
            Nossos Cursos em Destaque
          </h2>

          {courses.length > 0 ? (
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
      </main>
      <Footer />
    </>
  );
}
