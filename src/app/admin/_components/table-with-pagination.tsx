"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, StarFour } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash } from "lucide-react";

type PaginationCourses = {
  page: number;
  perPage: number;
  totalPage: number;
  total: number;
};

interface TableWithPaginationProps {
  contents: Array<Record<string, any>>;
  paginationCourses?: PaginationCourses;
  headers: Array<Record<string, string>>;
  setPaginationCourses?: (paginationCourses: PaginationCourses) => void;
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  isActions: boolean;
  starred: boolean;
  handleStarred?: (id: string) => void;
  isLoading: boolean;
  isPagination?: boolean;
}

export default function TableWithPagination({
  contents,
  headers,
  handleDelete,
  handleEdit,
  isLoading,
  paginationCourses,
  setPaginationCourses,
  starred,
  handleStarred,
  isActions,
  isPagination = true,
}: TableWithPaginationProps) {
  return (
    <div className="flex flex-col  m-5 border-gray-200 rounded-lg overflow-auto max-h-[calc(100vh-200px)]">
      <Table>
        <TableHeader className="bg-gray-200/50">
          <TableRow>
            {headers.map(({ key, value }) => (
              <TableHead key={key}>{value}</TableHead>
            ))}
            {starred && <TableHead>Em destaque</TableHead>}
            {isActions && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((content) => {
            return (
              <TableRow key={content.id} className="hover:bg-gray-300/50">
                {headers.map(({ key, value }) => (
                  <TableCell key={key}> {content[key]} </TableCell>
                ))}

                {starred && (
                  <TableCell>
                    <span>
                      {content.starred ? (
                        <Star
                          size={26}
                          color="#a0a21a"
                          className="cursor-pointer"
                          weight="fill"
                          onClick={() => handleStarred(content.id)}
                        />
                      ) : (
                        <Star
                          size={26}
                          className="cursor-pointer"
                          onClick={() => handleStarred(content.id)}
                        />
                      )}
                    </span>
                  </TableCell>
                )}

                {isActions && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(content.id)}
                    >
                      <Edit />
                      Alterar
                    </Button>
                    <Dialog>
                      <DialogTrigger>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                        >
                          <Trash />
                          Excluir
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
                              {content.name}" será deletado permanentemente.
                            </p>
                            <div className="flex gap-4 justify-center">
                              <DialogClose>
                                <Button
                                  variant="outline"
                                  disabled={isLoading}
                                  onClick={() => handleDelete(content.id)}
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
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {isPagination && (
        <Pagination className="bg-gray-200/50 p-1">
          <PaginationContent>
            <PaginationItem>
              <Select
                value={paginationCourses.perPage.toString()}
                onValueChange={(value) =>
                  setPaginationCourses({
                    ...paginationCourses,
                    perPage: parseInt(value),
                    page:
                      paginationCourses.totalPage >= parseInt(value)
                        ? 1
                        : paginationCourses.page,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </PaginationItem>

            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => {
                  if (paginationCourses.page > 1) {
                    setPaginationCourses({
                      ...paginationCourses,
                      page: paginationCourses.page - 1,
                    });
                  }
                }}
              />
            </PaginationItem>

            {Array.from({ length: paginationCourses.totalPage }).map(
              (_, index) => (
                <PaginationItem key={index} className="cursor-pointer">
                  <PaginationLink
                    onClick={() =>
                      setPaginationCourses({
                        ...paginationCourses,
                        page: index + 1,
                      })
                    }
                    isActive={paginationCourses.page === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => {
                  if (paginationCourses.page < paginationCourses.totalPage) {
                    setPaginationCourses({
                      ...paginationCourses,
                      page: paginationCourses.page + 1,
                    });
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
