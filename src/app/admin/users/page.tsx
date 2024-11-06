"use client";

import { useState } from "react";
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
import { PlusCircle, Search } from "lucide-react";
import SideBar from "../_components/sideBar";
import Loading from "../_components/loading";
import { useSession } from "next-auth/react";
import HeaderAdmin from "../_components/header";

// Mock data for users
const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor" },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
    setNewUser({ name: "", email: "", role: "" });
    setDrawerOpen(false);
  };

  const { status } = useSession({
    required: true,
  });

  if (status === "loading") return <Loading />;

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden gap-4">
        <HeaderAdmin title="User Management" />

        <div className="flex justify-between items-center mb-4 mx-5">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
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
                Novo Usuário
              </Button>
            </DrawerTrigger>
            <DrawerContent className="min-h-screen w-[480px]">
              <DrawerHeader>
                <DrawerTitle>Adicionar Novo Usuário</DrawerTitle>
                <DrawerDescription>
                  Informe os dados de um novo usuário.
                </DrawerDescription>
              </DrawerHeader>
              <form onSubmit={handleAddUser} className="px-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  {/* <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </div>
                <DrawerFooter>
                  <Button type="submit">Salvar</Button>
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
              <TableHead>Email</TableHead>
              {/* <TableHead>Role</TableHead> */}
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                {/* <TableCell>{user.role}</TableCell> */}
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
