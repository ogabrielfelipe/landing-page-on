"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import { useEffect } from "react";
import Header from "@/components/header";
import Card from "@/components/card";
import { getCourses } from "@/http/web/get-courses";
import { getCompany } from "@/http/web/get-company";
import { Skeleton } from "@/components/ui/skeleton";

type Course = {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  level: string;
  instructor: string;
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

export default function Courses() {
  const [courses, setCourses] = useState<Array<Course> | null>();
  const [company, setCompany] = useState<Company | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      const { courses } = await res.json();
      setCourses(courses);
    } catch (error) {
      console.error("Erro ao buscar dados no client:", error);
    }
  };

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
    Promise.all([fetchCourses(), fetchCompany()]);
  }, []);

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
            Nossos Cursos
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

              <div className="bg-blue-50/50 bg-opacity-50 p-4 shadow-md m-3 rounded-lg flex flex-col gap-2 cursor-pointer hover:translate-y-[-0.25rem] hover:bg-opacity-70 transition-all duration-300">
                <Skeleton className="w-[250px] h-10" />
                <Skeleton className="w-1/3 h-8" />
                <Skeleton className="w-full h-20" />
              </div>

              <div className="bg-blue-50/50 bg-opacity-50 p-4 shadow-md m-3 rounded-lg flex flex-col gap-2 cursor-pointer hover:translate-y-[-0.25rem] hover:bg-opacity-70 transition-all duration-300">
                <Skeleton className="w-[250px] h-10" />
                <Skeleton className="w-1/3 h-8" />
                <Skeleton className="w-full h-20" />
              </div>
            </>
          )}
        </section>
      </main>
      <Footer company={company} />
    </>
  );
}
