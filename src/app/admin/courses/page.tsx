"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { URLBase } from "../page";
import { Star } from "@phosphor-icons/react";
import { toast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Course = {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  starred: boolean;
  instructor: string;
};

export default function CourseManagement() {
  const { status } = useSession({
    required: true,
  });

  const [courses, setCourses] = useState<Course[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newCourse, setNewCourse] = useState<Course>({
    id: "",
    name: "",
    description: "",
    image: "",
    duration: 0,
    starred: false,
    instructor: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCourses = async () => {
    const coursesFn = await getCourses({ page: 1 });
    if (coursesFn) {
      setCourses(coursesFn.data);
    }
    setCourses(coursesFn.courses);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);

    async function coursesFetch() {
      await fetchCourses();
    }
    coursesFetch();
  }, []);

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
      response = await fetch(`${URLBase}/courses/${newCourse.id}`, {
        method: "PUT",
        body: JSON.stringify(newCourse),
      });

      if (response.status === 200) {
        toast({
          title: "Curso atualizado com sucesso",
          description: "O curso foi atualizado com sucesso",
        });
      }
    } else {
      response = await fetch(`${URLBase}/courses`, {
        method: "POST",
        body: JSON.stringify(newCourse),
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
      description: "",
      image: "",
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

    const response = await fetch(`${URLBase}/courses/${id}`, {
      method: "DELETE",
    });

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
    const response = await fetch(`${URLBase}/courses/${id}/starred`, {
      method: "PATCH",
    });

    const courseSelected = courses.find((course) => course.id === id);

    if (response.status === 200) {
      toast({
        title: "Curso atualizado!",
        description: `O curso foi ${
          courseSelected?.starred ? "retirado o destaque" : "destacado"
        } com sucesso`,
      });
    }

    await fetchCourses();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden gap-4">
        <HeaderAdmin title="Cadastro de Cursos" />

        <div className="flex justify-between items-center mb-4 mx-5">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Drawer
            open={drawerOpen}
            direction="right"
            onOpenChange={setDrawerOpen}
          >
            <DrawerTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Curso
              </Button>
            </DrawerTrigger>
            <DrawerContent className="min-h-screen w-[480px]">
              <DrawerHeader>
                <DrawerTitle>Adicionar Novo Usuário</DrawerTitle>
                <DrawerDescription>
                  Informe os dados de um novo usuário.
                </DrawerDescription>
              </DrawerHeader>
              <form onSubmit={handleAddCourse} className="px-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome
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
                    <Label htmlFor="email" className="text-right">
                      Descrição
                    </Label>
                    <Input
                      id="description"
                      type="text"
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
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
                          duration: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
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
            </DrawerContent>
          </Drawer>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Instrutor</TableHead>
              <TableHead>Em Destaque</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell className="text-center">
                  {course.instructor}
                </TableCell>
                <TableCell>
                  {course.starred ? (
                    <Star
                      size={26}
                      color="#a0a21a"
                      className="cursor-pointer"
                      weight="fill"
                      onClick={() => handleStarCourse(course.id)}
                    />
                  ) : (
                    <Star
                      size={26}
                      className="cursor-pointer"
                      onClick={() => handleStarCourse(course.id)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => selectCourseForEdit(course.id)}
                  >
                    Edit
                  </Button>
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Tem certeza que deseja deletar este curso?
                        </DialogTitle>
                        <DialogDescription>
                          <p>
                            Ao Clicar em Sim, o curso com o título "
                            {course.name}" será deletado permanentemente.
                          </p>
                          <div className="flex gap-4 justify-center">
                            <DialogClose>
                              <Button
                                variant="outline"
                                disabled={isLoading}
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                {isLoading ? "Deletando..." : "Sim"}
                              </Button>
                            </DialogClose>
                            <DialogClose>
                              <Button variant="destructive">Não</Button>
                            </DialogClose>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
