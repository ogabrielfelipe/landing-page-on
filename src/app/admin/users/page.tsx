"use client";

import { useCallback, useEffect, useState } from "react";
import Head from "next/head";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";

import { PlusCircle } from "lucide-react";
import SideBar from "../_components/sideBar";
import Loading from "../_components/loading";
import { useSession } from "next-auth/react";
import HeaderAdmin from "../_components/header";

import { toast } from "@/hooks/use-toast";
import TableWithPagination from "../_components/table-with-pagination";
import FormDrawer from "../_components/formDrawer";
import { getUsers } from "@/http/users/get-users";
import { editUser } from "@/http/users/edit-users";
import { createUser } from "@/http/users/create-users";
import { deleteUser } from "@/http/users/delete-users";

type UserProps = {
  id?: string;
  name: string;
  email: string;
  password?: string;
};

export default function UsersManager() {
  const { status } = useSession({
    required: true,
  });

  const [users, setUsers] = useState<UserProps[]>([]);

  const [newUser, setNewUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    password: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    const UsersFn = await getUsers();

    const data = await UsersFn.json();

    const usersQueue: UserProps[] = data.users;

    if (UsersFn.status === 200) {
      setUsers(usersQueue);
      setIsLoading(false);

      return;
    } else {
      toast({
        title: "Erro ao buscar Usuários",
        description: "Ocorreu um erro ao buscar os usuários",
      });
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchUsers()]);
  }, [fetchUsers]);

  if (status === "loading") return <Loading />;

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let response;
    if (newUser.id) {
      const editedUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      };
      response = await editUser(editedUser);

      if (response.status === 200) {
        toast({
          title: "Usuário atualizado com sucesso",
          description: "A usuário foi atualizado com sucesso",
        });
      }
    } else {
      if (!newUser.password) {
        toast({
          title: "Senha é obrigatória",
          description: "A senha é obrigatória para criar um usuário",
        });
        return;
      }

      response = await createUser({
        ...newUser,
        password: newUser.password as string,
      });

      if (response.status === 201) {
        toast({
          title: "Usuário criado com sucesso",
          description: "O usuário foi criado com sucesso",
        });
      }
    }

    await fetchUsers();

    setIsLoading(false);
    setDrawerOpen(false);

    setNewUser({
      id: "",
      name: "",
      email: "",
      password: "",
    });
  };

  const selectUserForEdit = async (id: string) => {
    const userFound = users.find((user) => user.id === id);

    if (userFound) {
      setNewUser(userFound);
    }

    setDrawerOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    setIsLoading(true);

    const response = await deleteUser({ id });

    setDrawerOpen(false);
    if (response.status === 200) {
      toast({
        title: "Usuário deletado com sucesso",
        description: "A usuário foi deletado com sucesso",
      });
    }

    await fetchUsers();

    setIsLoading(false);
  };

  const handleClickNewUser = () => {
    setNewUser({
      id: "",
      name: "",
      email: "",
      password: "",
    });
    setDrawerOpen(true);
  };

  return (
    <>
      <Head>
        <title>Users - LandingPage.On</title>
      </Head>

      <div className="flex h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden gap-4">
          <HeaderAdmin title="Cadastro de Usuários" />

          <div className="flex justify-between items-center mb-4 mx-5">
            <Button onClick={handleClickNewUser}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo usuário
            </Button>

            <FormDrawer
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              title="Adicionar Novo Usuário"
              description="Informe os dados da novo usuário."
            >
              <form onSubmit={handleAddUser} className="px-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome:
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          name: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email:
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          email: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Senha:
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          password: e.target.value,
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
            contents={users}
            headers={[
              { key: "name", value: "Nome" },
              { key: "email", value: "E-mail" },
            ]}
            handleDelete={handleDeleteUser}
            handleEdit={selectUserForEdit}
            isLoading={isLoading}
            isActions={true}
            starred={false}
            isActionActive={false}
          />
        </div>
      </div>

      {isLoading && <Loading />}
    </>
  );
}
