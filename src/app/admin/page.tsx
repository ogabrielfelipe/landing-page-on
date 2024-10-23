"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Users, BarChart, Layers } from "lucide-react";
import SideBar from "./_components/sideBar";
import { useSession } from "next-auth/react";
import Loading from "./_components/loading";
import HeaderAdmin from "./_components/header";
import { useCallback, useEffect, useState } from "react";
import { getCourses } from "@/http/courses/get-courses";
import TableWithPagination from "./_components/table-with-pagination";
import Link from "next/link";

type Course = {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  starred: boolean;
  instructor: string;
};

export default function AdminDashboard() {
  const { status } = useSession({
    required: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = useCallback(async () => {
    const coursesFn = await getCourses({
      page: 1,
      perPage: 5,
    });

    const data = await coursesFn.json();

    const courses = data.courses;

    setCourses(courses);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading") return <Loading />;

  const handleDeleteCourse = async (id: string) => {
    console.log(id);
  };

  const handleSelectCourseForEdit = async (id: string) => {
    console.log(id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderAdmin title="Dashboard" />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Informações Gerais
            </h2>
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Total de Cursos"
                value="6,389"
                icon={<Layers className="h-8 w-8 text-blue-600" />}
              />
              <StatCard
                title="Novos Cursos"
                value="120"
                icon={<Layers className="h-8 w-8 text-green-600" />}
              />
              <StatCard
                title="Total de usuários"
                value="1,437"
                icon={<Users className="h-8 w-8 text-yellow-600" />}
              />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Cursos Recentes
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Button>
                    <Link href="/admin/courses">Ver todos</Link>
                  </Button>
                </div>
                <TableWithPagination
                  contents={filteredCourses}
                  headers={[
                    { key: "name", value: "Nome" },
                    { key: "description", value: "Descrição" },
                    { key: "instructor", value: "Instrutor" },
                  ]}
                  handleDelete={handleDeleteCourse}
                  handleEdit={handleSelectCourseForEdit}
                  isLoading={isLoading}
                  isActions={false}
                  starred={false}
                  isPagination={false}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor" },
];
