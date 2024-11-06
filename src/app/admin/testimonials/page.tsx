"use client";

import { useCallback, useEffect, useState } from "react";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search } from "lucide-react";
import SideBar from "../_components/sideBar";
import Loading from "../_components/loading";
import { useSession } from "next-auth/react";
import HeaderAdmin from "../_components/header";

import { getTestimonials } from "@/http/testimonials/get-testimonials";
import { toast } from "@/hooks/use-toast";

import { createTestimonial } from "@/http/testimonials/create-testimonials";
import { editTestimonial } from "@/http/testimonials/edit-testimonials";
import { deleteTestimonial } from "@/http/testimonials/delete-testimonials";
import FormDrawer from "../_components/formDrawer";
import { getCourses } from "@/http/courses/get-courses";
import dynamic from "next/dynamic";

const WYSIWYGEditor = dynamic(() => import("../_components/wysiwyg-editor"), {
  ssr: false,
});

const TableWithPagination = dynamic(
  () => import("../_components/table-with-pagination"),
  {
    ssr: false,
  }
);

type Course = {
  id: string;
  name: string;
  resume: string;
  description: string;
  category: string;
  image: string;
  level: "INITIAL" | "INTERMEDIARY" | "ADVANCED";
  duration: number;
  starred: boolean;
  instructor: string;
};

type Testimonial = {
  id?: string;
  student: string;
  description: string;
  courseId: string;
  courseName?: string;
};

type TestimonialQuery = {
  id: string;
  student: string;
  description: string;
  courseId: string;
  course: Course;
};

type PaginationTestimonials = {
  page: number;
  perPage: number;
  totalPage: number;
  total: number;
};

export default function TestimonialsManager() {
  const { status } = useSession({
    required: true,
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [paginationTestimonials, setPaginationTestimonials] =
    useState<PaginationTestimonials>({
      page: 1,
      perPage: 10,
      totalPage: 1,
      total: 0,
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({
    id: "",
    student: "",
    description: "",
    courseId: "",
  });
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = useCallback(async () => {
    const testimonialsFn = await getTestimonials({
      page: paginationTestimonials.page,
      perPage: paginationTestimonials.perPage,
    });

    const data = await testimonialsFn.json();

    const testimonialsQueue: TestimonialQuery[] = data.testimonials;
    const pagination = {
      page: data.page,
      perPage: data.perPage,
      totalPage: data.totalPage,
      total: data.total,
    };

    const testimonialsWithCourseName: Testimonial[] = testimonialsQueue.map(
      (testimonial) => {
        return {
          id: testimonial.id,
          student: testimonial.student,
          description: testimonial.description,
          courseId: testimonial.course.id,
          courseName: testimonial.course.name,
        };
      }
    );

    if (testimonialsFn.status === 200) {
      setTestimonials(testimonialsWithCourseName);
      setPaginationTestimonials(pagination);
      setIsLoading(false);

      return;
    } else {
      toast({
        title: "Erro ao buscar testemunhos",
        description: "Ocorreu um erro ao buscar os testemunhos",
      });
      setIsLoading(false);
    }
  }, [paginationTestimonials.page, paginationTestimonials.perPage]);

  const fetchCourses = async () => {
    const coursesFn = await getCourses({
      page: 1,
      perPage: 100,
    });
    const data = await coursesFn.json();

    if (coursesFn.status === 200) {
      setCourses(data.courses);
      return;
    } else {
      return;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchCourses(), fetchTestimonials()]);
  }, [fetchTestimonials]);

  if (status === "loading") return <Loading />;

  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let response;

    if (newTestimonial.id) {
      response = await editTestimonial({
        id: newTestimonial.id,
        description: newTestimonial.description,
      });

      if (response.status === 200) {
        toast({
          title: "Testemunho atualizado com sucesso",
          description: "O Testemunho foi atualizado com sucesso",
        });
      }
    } else {
      response = await createTestimonial(newTestimonial);

      if (response.status === 201) {
        toast({
          title: "Testemunho criado com sucesso",
          description: "O testemunho foi criado com sucesso",
        });
      }
    }

    await fetchTestimonials();

    setIsLoading(false);
    setDrawerOpen(false);

    setNewTestimonial({
      id: "",
      student: "",
      courseId: "",
      courseName: "",
      description: "",
    });
  };

  const selectTestimonialForEdit = async (id: string) => {
    const testimonial = testimonials.find(
      (testimonial) => testimonial.id === id
    );

    if (testimonial) {
      setNewTestimonial(testimonial);
    }

    setDrawerOpen(true);
  };

  const handleDeleteTestimonial = async (id: string) => {
    setIsLoading(true);

    const response = await deleteTestimonial({ id });

    setDrawerOpen(false);
    if (response.status === 200) {
      toast({
        title: "Testemunho deletado com sucesso",
        description: "O testemunho foi deletado com sucesso",
      });
    }

    await fetchTestimonials();

    setIsLoading(false);
  };

  const handleClickNewTestimonial = () => {
    setNewTestimonial({
      id: "",
      description: "",
      courseName: "",
      courseId: "",
      student: "",
    });
    setDrawerOpen(true);
  };

  return (
    <>
      <Head>
        <title>Testemunhos - LandingPage.On</title>
      </Head>

      <div className="flex h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          <HeaderAdmin title="Cadastro de Testemunhos" />

          <div className="flex justify-between items-center mb-4 mx-5">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquise por nome, descrição ou instrutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>

            <Button onClick={handleClickNewTestimonial}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Testemunho
            </Button>

            <FormDrawer
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              title="Adicionar Novo Testemunho"
              description="Informe os dados do novo testemunho."
            >
              <form onSubmit={handleAddTestimonial} className="px-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Estudante:
                    </Label>
                    <Input
                      id="name"
                      value={newTestimonial.student}
                      onChange={(e) =>
                        setNewTestimonial({
                          ...newTestimonial,
                          student: e.target.value,
                        })
                      }
                      className="col-span-3"
                      disabled={newTestimonial.id?.length === 0 ? false : true}
                    />
                  </div>

                  <div className="grid grid-cols-4 mb-3 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Descrição:
                    </Label>
                    <div className="flex w-full min-h-52 mb-12 col-span-3">
                      <WYSIWYGEditor
                        content={newTestimonial.description}
                        handleEditorContent={(text) =>
                          setNewTestimonial({
                            ...newTestimonial,
                            description: text,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center mt-8 gap-4">
                    <Label htmlFor="role" className="text-right">
                      Testemunho:
                    </Label>
                    <Select
                      disabled={newTestimonial.id?.length === 0 ? false : true}
                      value={
                        newTestimonial.courseId == ""
                          ? "0"
                          : newTestimonial.courseId
                      }
                      onValueChange={(value) =>
                        setNewTestimonial({
                          ...newTestimonial,
                          courseId: value,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">
                          Selecione o testemunho
                        </SelectItem>
                        {courses &&
                          courses.map((course) => {
                            return (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name} | {course.instructor}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DrawerFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar"}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </FormDrawer>
          </div>
          <TableWithPagination
            contents={filteredTestimonials}
            headers={[
              { key: "student", value: "Aluno" },
              { key: "description", value: "Descrição" },
              { key: "courseName", value: "Testemunho" },
            ]}
            handleDelete={handleDeleteTestimonial}
            handleEdit={selectTestimonialForEdit}
            isLoading={isLoading}
            pagination={paginationTestimonials}
            setPagination={setPaginationTestimonials}
            isActions={true}
            starred={false}
          />
        </div>
      </div>

      {isLoading && <Loading />}
    </>
  );
}
