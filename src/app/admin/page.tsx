"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Layers, LucideProps, MessageSquareText } from "lucide-react";
import SideBar from "./_components/sideBar";
import { useSession } from "next-auth/react";
import Loading from "./_components/loading";
import HeaderAdmin from "./_components/header";
import {
  ForwardRefExoticComponent,
  ReactElement,
  RefAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";
import { getCourses } from "@/http/courses/get-courses";
import TableWithPagination from "./_components/table-with-pagination";
import Link from "next/link";
import { getTotals } from "@/http/dashboard/getTotals";

type Course = {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  starred: boolean;
  instructor: string;
};

type Totals = {
  total: {
    totalCourses: number;
    totalNewCourses: number;
    totalTestimonials: number;
  };
};

export default function AdminDashboard() {
  const { status } = useSession({
    required: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [totals, setTotals] = useState<Totals>();

  const fetchCourses = useCallback(async () => {
    const coursesFn = await getCourses({
      page: 1,
      perPage: 5,
    });

    const data = await coursesFn.json();

    const courses = data.courses;

    setCourses(courses);
  }, []);

  const fetchTotals = async () => {
    const totalsFn = await getTotals();

    const data = await totalsFn.json();

    setTotals(data);
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchTotals(), fetchCourses()]);

    setIsLoading(false);
  }, [fetchCourses]);

  if (status === "loading") return <Loading />;

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderAdmin title="Dashboard" />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Informações Gerais
            </h2>
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Total de Cursos"
                value={String(totals?.total.totalCourses)}
                icon={<Layers className="h-8 w-8 text-blue-600" />}
              />
              <StatCard
                title="Novos Cursos"
                value={String(totals?.total.totalNewCourses)}
                icon={<Layers className="h-8 w-8 text-green-600" />}
              />
              <StatCard
                title="Total de Testemunhos"
                value={String(totals?.total.totalTestimonials)}
                icon={<MessageSquareText className="h-8 w-8 text-yellow-600" />}
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
                  contents={courses}
                  headers={[
                    { key: "name", value: "Nome" },
                    { key: "shortDescription", value: "Resumo" },
                    { key: "instructor", value: "Instrutor" },
                  ]}
                  handleDelete={() => {}}
                  handleEdit={() => {}}
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

type statProps = {
  title: string;
  value: string;
  icon: ReactElement<
    ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >
  >;
};

function StatCard({ title, value, icon }: statProps) {
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
