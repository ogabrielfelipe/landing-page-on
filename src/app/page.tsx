"use client";

import { useEffect, useState } from "react";

import Card from "@/components/card";
import { getCoursesStarred } from "@/http/web/get-courses-starred";
import { getTestimonials } from "@/http/web/get-testimonials";
import { Button } from "@/components/ui/button";

const Header = dynamic(() => import("@/components/header"), {
  ssr: true,
});

const Footer = dynamic(() => import("@/components/footer"), {
  ssr: true,
});

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { getCompany } from "@/http/web/get-company";

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

export default function Home() {
  const [courses, setCourses] = useState<Array<Course> | null>();
  const [testimonials, setTestimonials] = useState<Array<Testimonial> | null>();
  const [company, setCompany] = useState<Company | null>(null);
  const [testimonialsPaginated, setTestimonialsPaginated] =
    useState<Array<Testimonial> | null>();

  const [blockLoadingTestimonials, setBlockLoadingTestimonials] =
    useState<boolean>(false);

  const TOTAL_TESTIMONIALS = 5;

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

  const fetchCourses = async () => {
    const coursesFn = await getCoursesStarred();

    const data = await coursesFn.json();

    if (coursesFn.status === 200) {
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

  useEffect(() => {
    const fetchData = () => {
      Promise.all([fetchCourses(), fetchTestimonials(), fetchCompany()]).catch(
        (error) => {
          console.error("Error fetching data:", error);
        }
      );
    };

    fetchData();
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
      <Header company={company} />

      <main>
        <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
          <section
            id="intro"
            className="flex flex-col items-center justify-center flex-wrap text-center gap-4"
          >
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
              <Card contents={courses} isLink={true} url="/courses" />
            ) : (
              <>
                <div className="bg-blue-50/50 bg-opacity-50 p-4 shadow-md m-3 rounded-lg flex flex-col gap-2 cursor-pointer hover:translate-y-[-0.25rem] hover:bg-opacity-70 transition-all duration-300">
                  <Skeleton className="w-[250px] h-10" />
                  <Skeleton className="w-1/3 h-8" />
                  <Skeleton className="w-full h-20" />
                </div>
              </>
            )}
          </section>
        </div>

        {/*bg-blue-800  text-blue-100*/}

        <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
          <section id="testimonials" aria-labelledby="testimonials-titulo">
            <h2
              id="testimonials-titulo"
              className="text-3xl font-bold text-blue-900 border-b-2 border-[#ff9800] pb-2 mb-3"
            >
              Depoimentos de Alunos
            </h2>
            <div className="flex flex-wrap flex-row">
              {testimonialsPaginated ? (
                testimonialsPaginated?.map((testimonial) => {
                  return (
                    <blockquote
                      key={testimonial.student}
                      className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-700 m-10 max-w-80"
                    >
                      <div
                        className="text-blue-700"
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
                })
              ) : (
                <>
                  <blockquote className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-50 m-10 max-w-80">
                    <Skeleton className="h-[250px] w-52" />

                    <footer className=" text-blue-50 p-2 mt-8 rounded-md font-bold text-center">
                      <Skeleton className="h-12 w-full" />
                    </footer>
                  </blockquote>

                  <blockquote className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-50 m-10 max-w-80">
                    <Skeleton className="h-[250px] w-52" />

                    <footer className=" text-blue-50 p-2 mt-8 rounded-md font-bold text-center">
                      <Skeleton className="h-12 w-full" />
                    </footer>
                  </blockquote>

                  <blockquote className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-50 m-10 max-w-80">
                    <Skeleton className="h-[250px] w-48" />

                    <footer className=" text-blue-50 p-2 mt-8 rounded-md font-bold text-center">
                      <Skeleton className="h-12 w-full" />
                    </footer>
                  </blockquote>

                  <blockquote className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-50 m-10 max-w-80">
                    <Skeleton className="h-[250px] w-52" />

                    <footer className=" text-blue-50 p-2 mt-8 rounded-md font-bold text-center">
                      <Skeleton className="h-12 w-full" />
                    </footer>
                  </blockquote>
                </>
              )}
            </div>

            <div className="w-full flex justify-center">
              <Button
                onClick={loadingTestimonials}
                className="bg-[#ff9800] text-white disabled:cursor-not-allowed"
                disabled={blockLoadingTestimonials || !testimonialsPaginated}
              >
                Carregar mais
              </Button>
            </div>
          </section>
        </div>

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

      <Footer company={company} />
    </>
  );
}
