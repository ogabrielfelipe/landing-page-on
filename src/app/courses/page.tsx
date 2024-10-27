"use client";

import { fetchCourses } from "@/actions/fetch-courses";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import Loading from "../admin/_components/loading";
import Card from "@/components/card";

type Course = {
  id: string;
  name: string;
  description: string;
  image: string;
  level: string;
  duration: number;
  instructor: string;
};

export default function Courses() {
  const [courses, setCourses] = useState<Array<Course> | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCourse = async () => {
    const { courses } = await fetchCourses();
    setCourses(courses);
  };

  useEffect(() => {
    setIsLoading(true);

    fetchCourse();

    setIsLoading(false);
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
      </main>
      <Footer />

      {isLoading && <Loading />}
    </>
  );
}
