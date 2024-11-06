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
import { Star } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Edit, Trash } from "lucide-react";

type Pagination = {
  page: number;
  perPage: number;
  totalPage: number;
  total: number;
};

interface TableWithPaginationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contents: Array<Record<string, any>>;
  pagination?: Pagination | null;
  headers: Array<Record<string, string>>;
  setPagination?: (pagination: Pagination) => void | null;
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
  isActions: boolean;
  starred: boolean;
  handleStarred?: (id: string) => void;
  isLoading: boolean;
  isPagination?: boolean;
  isActionActive?: boolean;
  handleActive?: (id: string) => void;
}

export default function TableWithPagination({
  contents,
  headers,
  handleDelete,
  handleEdit,
  isLoading,
  pagination,
  setPagination,
  starred,
  handleStarred,
  isActions,
  isPagination = true,

  isActionActive = false,
  handleActive,
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
                {headers.map(({ key }) => {
                  return <TableCell key={key}> {content[key]} </TableCell>;
                })}

                {starred && (
                  <TableCell>
                    <span>
                      {content.starred ? (
                        <Star
                          size={26}
                          color="#a0a21a"
                          className="cursor-pointer"
                          weight="fill"
                          onClick={() => handleStarred?.(content.id)}
                        />
                      ) : (
                        <Star
                          size={26}
                          className="cursor-pointer"
                          onClick={() => handleStarred?.(content.id)}
                        />
                      )}
                    </span>
                  </TableCell>
                )}

                {isActions && (
                  <TableCell>
                    {isActionActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleActive?.(content.id)}
                      >
                        {content.isActive ? "Desativar" : "Ativar"}
                      </Button>
                    )}

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
                            Tem certeza que deseja deletar este registro?
                          </DialogTitle>
                          <DialogDescription>
                            <p>
                              Ao Clicar em Sim, o registro com o título
                              {content.name} será deletado permanentemente.
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
                value={pagination?.perPage.toString()}
                onValueChange={(value) => {
                  if (pagination) {
                    setPagination?.({
                      ...pagination,
                      perPage: parseInt(value),
                      page:
                        pagination.totalPage &&
                        pagination.totalPage >= parseInt(value)
                          ? 1
                          : pagination.page,
                    });
                  }
                }}
              >
                <SelectTrigger className="col-span-3"></SelectTrigger>
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
                  if (pagination) {
                    if (pagination.page > 1) {
                      setPagination?.({
                        ...pagination,
                        page: pagination.page - 1,
                      });
                    }
                  }
                }}
              />
            </PaginationItem>

            {Array.from({ length: pagination?.totalPage ?? 0 }).map(
              (_, index) => (
                <PaginationItem key={index} className="cursor-pointer">
                  <PaginationLink
                    onClick={() => {
                      if (pagination) {
                        setPagination?.({
                          ...pagination,
                          page: index + 1,
                        });
                      }
                    }}
                    isActive={pagination?.page === index + 1}
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
                  if (pagination) {
                    if (pagination.page < pagination.totalPage) {
                      setPagination?.({
                        ...pagination,
                        page: pagination.page + 1,
                      });
                    }
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
