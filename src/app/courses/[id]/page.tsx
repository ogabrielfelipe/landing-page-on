"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { URLBase } from "@/http/config";
import Image from "next/image";
import { useParams } from "next/navigation";
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

type Course = {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  level: string;
  instructor: string;
  category: {
    id: string;
    name: string;
  };
};

export default function CourseDetails() {
  const params = useParams();
  const id = params.id;

  const [courses, setCourses] = useState<Course | null>();
  const [company, setCompany] = useState<Company | null>(null);

  const fetchCompany = async () => {
    const res = await fetch(`${URLBase}/api/web/company?page=1&perPage=1`, {
      method: "GET",
      cache: "no-store",
    });
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

  const fetchCourse = async (id: string) => {
    try {
      const res = await fetch(`${URLBase}/api/web/courses/${id}/details`, {
        method: "GET",
        cache: "no-store",
      });
      const { courses } = await res.json();
      setCourses(courses);
    } catch (error) {
      console.error("Erro ao buscar dados no client:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchCompany(), fetchCourse(id as string)]);
  }, [id]);

  return (
    <>
      <Header company={company} />
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
            Curso: {courses?.name}
          </h2>

          <div className="py-10 flex flex-row gap-5 flex-wrap">
            <div className=" flex flex-col gap-5">
              <div className="h-96 w-96 max-md:w-80">
                {courses?.image ? (
                  <Image
                    src={
                      "https://live.staticflickr.com/65535/54120123332_bcb606e023_o.jpg"
                    }
                    alt={courses?.name}
                    width={400}
                    height={400}
                  />
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </div>
              <div className="h-5 w-96">
                {courses?.instructor ? (
                  <p>
                    <span className="font-bold">Instrutor:</span>{" "}
                    {courses?.instructor}
                  </p>
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </div>
              <div className="h-5 w-96">
                {courses?.duration ? (
                  <p className="h-auto w-full">
                    <span className="font-bold">Duração: </span>{" "}
                    {courses?.duration} meses
                  </p>
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </div>
              <div className="h-5 w-96">
                {courses?.level ? (
                  <p className="h-auto w-full">
                    <span className="font-bold">Nível: </span>{" "}
                    {courses.level == "INITIAL" ? (
                      <>Iniciante</>
                    ) : courses.level == "INTERMEDIARY" ? (
                      <>Intermediário</>
                    ) : courses.level == "ADVANCED" ? (
                      <>Avançado</>
                    ) : (
                      <></>
                    )}
                  </p>
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </div>
              <div className="h-5 w-96">
                {courses?.category.name ? (
                  <p className="h-auto w-full">
                    <span className="font-bold">Categoria: </span>{" "}
                    {courses?.category.name}
                  </p>
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </div>
            </div>

            <div className="h-auto md:w-[calc(100vw-30rem)] max-md:mt-2 max-md:border-t-2 max-md:pt-4 max-md:border-[#ff9800]">
              {courses?.description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: courses?.description || "",
                  }}
                ></div>
              ) : (
                <Skeleton className="h-screen w-full" />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer company={company} />
    </>
  );
}
