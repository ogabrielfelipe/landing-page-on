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

import { toast } from "@/hooks/use-toast";
import TableWithPagination from "../_components/table-with-pagination";
import FormDrawer from "../_components/formDrawer";
import { getCategories } from "@/http/categories/get-categories";
import { editCategory } from "@/http/categories/edit-categories";
import { createCategory } from "@/http/categories/create-categories";
import { deleteCategory } from "@/http/categories/delete-categories";
import { activeCategory } from "@/http/categories/active-categories";

type CategoryProps = {
  id?: string;
  name: string;
  isActive: boolean;
};

type PaginationCategories = {
  page: number;
  perPage: number;
  totalPage: number;
  total: number;
};

export default function CategoriesManager() {
  const { status } = useSession({
    required: true,
  });

  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [paginationCategories, setPaginationCategories] =
    useState<PaginationCategories>({
      page: 1,
      perPage: 10,
      totalPage: 1,
      total: 0,
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState<CategoryProps>({
    id: "",
    name: "",
    isActive: true,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const CategoriesFn = await getCategories({
      page: paginationCategories.page,
      perPage: paginationCategories.perPage,
    });

    const data = await CategoriesFn.json();

    const categoriesQueue: CategoryProps[] = data.categories;
    const pagination = {
      page: data.page,
      perPage: data.perPage,
      totalPage: data.totalPage,
      total: data.total,
    };

    if (CategoriesFn.status === 200) {
      setCategories(categoriesQueue);
      setPaginationCategories(pagination);
      setIsLoading(false);

      return;
    } else {
      toast({
        title: "Erro ao buscar Categorias",
        description: "Ocorreu um erro ao buscar os categorias",
      });
      setIsLoading(false);
    }
  }, [paginationCategories.page, paginationCategories.perPage]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchCategories()]);
  }, [fetchCategories]);

  if (status === "loading") return <Loading />;

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let response;
    if (newCategory.id) {
      const editedCategory = {
        id: newCategory.id,
        isActive: newCategory.isActive,
        name: newCategory.name,
      };
      response = await editCategory(editedCategory);

      if (response.status === 200) {
        toast({
          title: "Categoria atualizado com sucesso",
          description: "A categoria foi atualizado com sucesso",
        });
      }
    } else {
      response = await createCategory(newCategory);

      if (response.status === 201) {
        toast({
          title: "Categoria criado com sucesso",
          description: "O categoria foi criado com sucesso",
        });
      }
    }

    await fetchCategories();

    setIsLoading(false);
    setDrawerOpen(false);

    setNewCategory({
      id: "",
      name: "",
      isActive: true,
    });
  };

  const selectCategoryForEdit = async (id: string) => {
    const categoryFound = categories.find((category) => category.id === id);

    if (categoryFound) {
      setNewCategory(categoryFound);
    }

    setDrawerOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    setIsLoading(true);

    const response = await deleteCategory({ id });

    setDrawerOpen(false);
    if (response.status === 200) {
      toast({
        title: "Categoria deletado com sucesso",
        description: "A categoria foi deletado com sucesso",
      });
    }

    await fetchCategories();

    setIsLoading(false);
  };

  const handleActiveOrInactiveCategory = async (id: string) => {
    setIsLoading(true);
    const categoryFound = categories.find((category) => category.id === id);

    const response = await activeCategory({ id });

    if (response.status === 200) {
      toast({
        title: `Categoria atualizada com sucesso`,
        description: `A categoria foi ${
          categoryFound?.isActive ? "Desativado" : "Ativado"
        } com sucesso`,
      });
    }

    await fetchCategories();

    setIsLoading(false);
  };

  const handleClickNewCategory = () => {
    setNewCategory({
      id: "",
      name: "",
      isActive: true,
    });
    setDrawerOpen(true);
  };

  return (
    <>
      <Head>
        <title>Categories - LandingPage.On</title>
      </Head>

      <div className="flex h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          <HeaderAdmin title="Cadastro de Categories" />

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

            <Button onClick={handleClickNewCategory}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova categoria
            </Button>

            <FormDrawer
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              title="Adicionar Nova Categoria"
              description="Informe os dados da nova categoria."
            >
              <form onSubmit={handleAddCategory} className="px-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Descrição:
                    </Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          name: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center mt-8 gap-4">
                    <Label htmlFor="role" className="text-right">
                      Ativado:
                    </Label>
                    <Select
                      value={newCategory.isActive ? "Y" : "F"}
                      onValueChange={(value) =>
                        setNewCategory({
                          ...newCategory,
                          isActive: value === "Y" ? true : false,
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">Sim</SelectItem>
                        <SelectItem value="N">Não</SelectItem>
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
            contents={filteredCategories}
            headers={[{ key: "name", value: "Descrição" }]}
            handleDelete={handleDeleteCategory}
            handleEdit={selectCategoryForEdit}
            isLoading={isLoading}
            pagination={paginationCategories}
            setPagination={setPaginationCategories}
            isActions={true}
            starred={false}
            isActionActive={true}
            handleActive={handleActiveOrInactiveCategory}
          />
        </div>
      </div>

      {isLoading && <Loading />}
    </>
  );
}
