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

import { getCourses } from "@/http/courses/get-courses";
import { toast } from "@/hooks/use-toast";

import { createCourse } from "@/http/courses/create-courses";
import { editCourse } from "@/http/courses/edit-courses";
import { starredCourse } from "@/http/courses/starred-courses";
import { deleteCourse } from "@/http/courses/delete-courses";
import TableWithPagination from "../_components/table-with-pagination";
import FormDrawer from "../_components/formDrawer";
import WYSIWYGEditor from "../_components/wysiwyg-editor";
import { getCategories } from "@/http/categories/get-categories";

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

type PaginationCourses = {
  page: number;
  perPage: number;
  totalPage: number;
  total: number;
};

type Category = {
  id: string;
  name: string;
  isActive: boolean;
};

export default function CourseManagement() {
  const { status } = useSession({
    required: true,
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [paginationCourses, setPaginationCourses] = useState<PaginationCourses>(
    {
      page: 1,
      perPage: 10,
      totalPage: 1,
      total: 0,
    }
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [newCourse, setNewCourse] = useState<Course>({
    id: "",
    name: "",
    resume: "",
    description: "",
    category: "",
    image: "",
    duration: 0,
    level: "INITIAL",
    starred: false,
    instructor: "",
  });
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    const coursesFn = await getCourses({
      page: paginationCourses.page,
      perPage: paginationCourses.perPage,
    });

    const data = await coursesFn.json();

    const courses = data.courses;
    const pagination = {
      page: data.page,
      perPage: data.perPage,
      totalPage: data.totalPage,
      total: data.total,
    };

    if (coursesFn.status === 200) {
      setCourses(courses);
      setPaginationCourses(pagination);
      setIsLoading(false);
      return;
    } else {
      toast({
        title: "Erro ao buscar cursos",
        description: "Ocorreu um erro ao buscar os cursos",
      });
      setIsLoading(false);
    }
  }, [paginationCourses.page, paginationCourses.perPage]);

  const fetchCategories = async () => {
    const categoriesFn = await getCategories({
      isActive: true,
      page: 1,
      perPage: 100,
    });
    const data = await categoriesFn.json();

    console.log(data);

    if (categoriesFn.status === 200) {
      setCategories(data.categories);
      return;
    } else {
      return;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchCategories(), fetchCourses()]);
  }, [fetchCourses]);

  if (status === "loading") return <Loading />;

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let response;

    if (newCourse.id) {
      response = await editCourse(newCourse);

      if (response.status === 200) {
        toast({
          title: "Curso atualizado com sucesso",
          description: "O curso foi atualizado com sucesso",
        });
      }
    } else {
      response = await createCourse({
        shortDescription: newCourse.resume,
        categoryId: newCourse.category,
        description: newCourse.description,
        duration: newCourse.duration,
        instructor: newCourse.instructor,
        image: newCourse.image,
        level: newCourse.level,
        name: newCourse.name,
        starred: newCourse.starred,
      });

      if (response.status === 201) {
        toast({
          title: "Curso criado com sucesso",
          description: "O curso foi criado com sucesso",
        });
      }
    }

    await fetchCourses();

    setIsLoading(false);
    setDrawerOpen(false);

    setNewCourse({
      id: "",
      name: "",
      resume: "",
      description: "",
      category: "",
      image: "",
      level: "INITIAL",
      duration: 0,
      starred: false,
      instructor: "",
    });
  };

  const selectCourseForEdit = async (id: string) => {
    const course = courses.find((course) => course.id === id);

    if (course) {
      setNewCourse(course);
    }

    setDrawerOpen(true);
  };

  const handleDeleteCourse = async (id: string) => {
    setIsLoading(true);

    const response = await deleteCourse({ id });

    setDrawerOpen(false);
    if (response.status === 200) {
      toast({
        title: "Curso deletado com sucesso",
        description: "O curso foi deletado com sucesso",
      });
    }

    await fetchCourses();

    setIsLoading(false);
  };

  const handleStarCourse = async (id: string) => {
    setIsLoading(true);
    const response = await starredCourse({ id });

    console.log(response);

    const courseSelected = courses.find((course) => course.id === id);
    if (response.status === 200) {
      setIsLoading(false);

      toast({
        title: "Curso atualizado!",
        description: `O curso foi ${
          courseSelected?.starred ? "retirado o destaque" : "destacado"
        } com sucesso`,
      });
    } else {
      setIsLoading(false);

      toast({
        title: "Ops!",
        description: `Não foi possível ${
          courseSelected?.starred ? "retirar o destaque" : "destacar"
        } o curso.`,
      });
    }

    await fetchCourses();
  };

  const handleClickNewCourse = () => {
    setNewCourse({
      id: "",
      name: "",
      resume: "",
      description: "",
      category: "",
      image: "",
      level: "INITIAL",
      duration: 0,
      starred: false,
      instructor: "",
    });
    setDrawerOpen(true);
  };

  return (
    <>
      <Head>
        <title>Cursos - LandingPage.On</title>
      </Head>

      <div className="flex h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          <HeaderAdmin title="Cadastro de Cursos" />

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

            <Button onClick={handleClickNewCourse}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Curso
            </Button>

            <FormDrawer
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              description="Informe os dados do novo curso."
              title="Adicionar Novo Curso"
            >
              <form onSubmit={handleAddCourse} className="px-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome:
                    </Label>
                    <Input
                      id="name"
                      value={newCourse.name}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Resumo:
                    </Label>
                    <Input
                      id="name"
                      value={newCourse.resume}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, resume: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 mb-3 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Descrição:
                    </Label>
                    <div className="flex w-full min-h-52 mb-12 col-span-3">
                      <WYSIWYGEditor
                        content={newCourse.description}
                        handleEditorContent={(text) =>
                          setNewCourse({
                            ...newCourse,
                            description: text,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 mt-8 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Tempo de curso (em meses):
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newCourse.duration}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          duration: parseInt(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Categoria:
                    </Label>
                    <Select
                      value={
                        newCourse.category.length === 0
                          ? "0"
                          : newCourse.category
                      }
                      onValueChange={(value) =>
                        setNewCourse({
                          ...newCourse,
                          category: value,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Selecione um curso</SelectItem>
                        {categories ? (
                          categories?.map((category) => {
                            return (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Em Destaque:
                    </Label>
                    <Select
                      value={newCourse.starred ? "1" : "0"}
                      onValueChange={(value) =>
                        setNewCourse({
                          ...newCourse,
                          starred: value === "1",
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Sim</SelectItem>
                        <SelectItem value="0">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Nível:
                    </Label>
                    <Select
                      value={newCourse.level}
                      onValueChange={(value) =>
                        setNewCourse({
                          ...newCourse,
                          level: value,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INITIAL">Iniciante</SelectItem>
                        <SelectItem value="INTERMEDIARY">
                          Intermediário
                        </SelectItem>
                        <SelectItem value="ADVANCED">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Nome do Instrutor:
                    </Label>
                    <Input
                      id="instructor"
                      type="text"
                      value={newCourse.instructor}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          instructor: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
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
            contents={filteredCourses}
            headers={[
              { key: "name", value: "Nome" },
              { key: "shortDescription", value: "Resumo" },
              { key: "instructor", value: "Instrutor" },
            ]}
            handleDelete={handleDeleteCourse}
            handleEdit={selectCourseForEdit}
            isLoading={isLoading}
            paginationCourses={paginationCourses}
            setPaginationCourses={setPaginationCourses}
            isActions={true}
            starred={true}
            handleStarred={handleStarCourse}
          />
        </div>
      </div>

      {isLoading && <Loading />}
    </>
  );
}
