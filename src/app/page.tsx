"use client";

import { useEffect, useState } from "react";
import Loading from "./admin/_components/loading";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Card from "@/components/card";
import { getCoursesStarred } from "@/http/web/get-courses-starred";
import { getTestimonials } from "@/http/web/get-testimonials";
import { getCompany } from "@/http/web/get-company";
import { Button } from "@/components/ui/button";

type Course = {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  level: string;
  instructor: string;
};

type Testimonial = {
  student: string;
  description: string;
  course: {
    name: string;
    instructor: string;
  };
  createdAt: string;
};

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

export default function Home() {
  const [courses, setCourses] = useState<Array<Course> | null>();
  const [testimonials, setTestimonials] = useState<Array<Testimonial> | null>();
  const [testimonialsPaginated, setTestimonialsPaginated] =
    useState<Array<Testimonial> | null>();
  const [company, setCompany] = useState<Company>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [blockLoadingTestimonials, setBlockLoadingTestimonials] =
    useState<boolean>(false);

  const TOTAL_TESTIMONIALS = 5;

  const fetchCourses = async () => {
    const coursesFn = await getCoursesStarred();

    const data = await coursesFn.json();

    if (coursesFn.status === 200) {
      console.log(data.courses);

      setCourses(data.courses);
      return;
    } else {
      return;
    }
  };

  const fetchTestimonials = async () => {
    const testimonialsFn = await getTestimonials();

    const data = await testimonialsFn.json();

    if (testimonialsFn.status === 200) {
      const testimonialOrder = data.testimonials.sort(
        (a: Testimonial, b: Testimonial) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setTestimonials(testimonialOrder);
      setTestimonialsPaginated(testimonialOrder.slice(0, TOTAL_TESTIMONIALS));
      return;
    } else {
      return;
    }
  };

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
    setIsLoading(true);

    Promise.all([fetchCourses(), fetchTestimonials(), fetchCompany()]);

    setIsLoading(false);
  }, []);

  function abbreviateSecondName(fullName: string) {
    const names = fullName.split(" ");

    if (names.length < 2) {
      return fullName;
    }

    names[1] = names[1][0] + ".";

    return names.join(" ");
  }

  function loadingTestimonials() {
    const totalTestimonials = testimonialsPaginated?.length;

    if (totalTestimonials === undefined) {
      return;
    }

    let totalNextTestimonials = totalTestimonials + TOTAL_TESTIMONIALS;

    if (testimonials === undefined) {
      return;
    }

    if (totalNextTestimonials > (testimonials?.length ?? 0)) {
      totalNextTestimonials = testimonials?.length ?? 0;
      setBlockLoadingTestimonials(true);
    }

    if (testimonials && Array.isArray(testimonials)) {
      setTestimonialsPaginated([
        ...(testimonialsPaginated ?? []),
        ...testimonials.slice(
          totalTestimonials,
          totalTestimonials + TOTAL_TESTIMONIALS
        ),
      ]);
    }
  }

  return (
    <>
      <Header title={company?.name} image="" />

      <main>
        <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
          <section
            id="intro"
            className="flex flex-col items-center justify-center flex-wrap text-center gap-4"
          >
            <h2 className="text-4xl font-bold text-blue-900">
              Bem-vindo à {company?.name}
            </h2>
            <p>
              Descubra seu potencial tanto musical quanto profissional com
              instrutores experientes e instalações de ponta.
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
            <div className="flex flex-wrap flex-row">
              {testimonialsPaginated?.map((testimonial) => {
                return (
                  <blockquote
                    key={testimonial.student}
                    className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-50 m-10 max-w-80"
                  >
                    <div
                      className="text-blue-50"
                      dangerouslySetInnerHTML={{
                        __html: testimonial.description,
                      }}
                    ></div>

                    <footer className="bg-blue-900 text-blue-50 p-2 mt-8 rounded-md font-bold text-center">
                      -{" "}
                      {abbreviateSecondName(testimonial.student) +
                        ", " +
                        testimonial.course.name}
                    </footer>
                  </blockquote>
                );
              })}
            </div>

            <div className="w-full flex justify-center">
              <Button
                onClick={loadingTestimonials}
                className="bg-[#ff9800] text-white"
                disabled={blockLoadingTestimonials}
              >
                Carregar mais
              </Button>
            </div>
          </div>
        </section>

        {/* <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
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
        </div> */}
      </main>

      <Footer />

      {isLoading && <Loading />}
    </>
  );
}
