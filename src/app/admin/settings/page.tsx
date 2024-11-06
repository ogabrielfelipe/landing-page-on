"use client";

import Head from "next/head";
import SideBar from "../_components/sideBar";
import HeaderAdmin from "../_components/header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CirclePlus, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { v4 } from "uuid";
import { createCompany } from "@/http/companies/create-companies";
import { getCompanies } from "@/http/companies/get-companies";
import { editCompany } from "@/http/companies/edit-companies";
import Loading from "../_components/loading";
import dynamic from "next/dynamic";

const WYSIWYGEditor = dynamic(() => import("../_components/wysiwyg-editor"), {
  ssr: false,
});

type Contacts = {
  id: string;
  type: string;
  content: string;
};

const typeContacts = {
  phone: "Telefone",
  whatsapp: "Whatsapp",
  instagram: "Instagram",
  youtube: "YouTube",
  mail: "E-mail",
};

type CompanyProps = {
  id?: string;
  name: string;
  document: string;
  about: string;
  contacts: Contacts[];
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;

  latitude?: string | undefined;
  longitude?: string | undefined;
};

export default function SettingsManager() {
  const [company, setCompany] = useState<CompanyProps>({
    id: "",
    name: "",
    about: "",
    document: "",
    contacts: [],
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",
  });

  const [newContact, setNewContact] = useState<Contacts>({
    id: "",
    content: "",
    type: "0",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompany = async () => {
    setIsLoading(true);
    const companyFn = await getCompanies({ page: 1, perPage: 1 });

    const { companies } = await companyFn.json();

    if (companies.length === 0) {
      return;
    }

    const company = companies[0];

    company.contacts = JSON.parse(company.contacts);

    setCompany(company);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleAddContacts = () => {
    if (newContact.type == "0") {
      toast({
        title: "Ops!",
        description:
          "Não foi possível realizar o cadastro, não foi informado o tipo",
      });
      return;
    }

    newContact.id = v4();

    setCompany({
      ...company,
      contacts: [...company.contacts, newContact],
    });
    setNewContact({ id: "", content: "", type: "0" });
  };

  const handleRemoveContacts = (contactId: string) => {
    const contacts = company.contacts;

    const contactsFiltered = contacts.filter((e) => {
      return e.id != contactId;
    });

    const companyWithContactsAltered = {
      ...company,
      contacts: contactsFiltered,
    };

    setCompany(companyWithContactsAltered);
  };

  const handleAddCompany = async () => {
    setIsLoading(true);
    if (company.id?.length === 0 || !company.id) {
      try {
        const result = await createCompany({
          ...company,
          contacts: JSON.stringify(company.contacts),
        });
        if (result.ok) {
          toast({
            title: "Salvo com sucesso",
            description: "O Cadastro da empresa foi salvo com sucesso",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "Opss... Houve um erro",
          description: "Não foi possível realizar o cadastro da empresa.",
        });
        setIsLoading(false);
        return;
      } catch (e) {
        console.log(e);

        toast({
          title: "Opss... Houve um erro",
          description: "Não foi possível realizar o cadastro da empresa.",
        });
        setIsLoading(false);
        return;
      }
    } else {
      try {
        const companyId = company.id;
        delete company.id;

        const result = await editCompany({
          id: companyId,
          data: {
            ...company,
            latitude: company.latitude || "",
            longitude: company.longitude || "",
            contacts: JSON.stringify(company.contacts),
          },
        });

        if (result.ok) {
          toast({
            title: "Salvo com sucesso",
            description: "Cadastro da empresa foi alterado com sucesso",
          });
          setIsLoading(false);
          fetchCompany();
          return;
        }
        toast({
          title: "Opss... Houve um erro",
          description: "Não foi possível atualizar o cadastro da empresa.",
        });
        setIsLoading(false);
        return;
      } catch (e) {
        console.log(e);
        toast({
          title: "Opss... Houve um erro",
          description: "Não foi possível realizar a atualização da empresa.",
        });
        setIsLoading(false);
        return;
      }
    }
  };

  return (
    <>
      <Head>
        <title>Configurações - LandingPage.On</title>
      </Head>

      <div className="flex h-screen bg-gray-100">
        <SideBar />
        <div className="flex-1 flex flex-col overflow-hidden pb-4">
          <HeaderAdmin title="Configurações" />

          <Tabs defaultValue="account" className="h-full m-4 overflow-auto">
            <TabsList className="grid w-52 grid-cols-2 gap-4">
              <TabsTrigger value="account">Sobre</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
            </TabsList>

            <TabsContent
              value="account"
              className="bg-white rounded-md mx-2 h-auto p-4"
            >
              <div className="flex flex-row justify-around gap-4 h-auto w-full">
                <div className="flex flex-col gap-4 min-w-96">
                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome:
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={company.name}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="document" className="text-right">
                      Documento:
                    </Label>
                    <Input
                      id="document"
                      type="text"
                      value={company.document}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          document: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="contacts" className="text-right">
                      Contatos:
                    </Label>
                    <div className="flex gap-2">
                      <div className="w-[120px]">
                        <Select
                          defaultValue="0"
                          value={newContact.type}
                          onValueChange={(e) =>
                            setNewContact({
                              ...newContact,
                              type: e,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Tipo</SelectItem>
                            {Object.keys(typeContacts).map((key) => {
                              return (
                                <SelectItem key={key} value={key}>
                                  {
                                    typeContacts[
                                      key as keyof typeof typeContacts
                                    ]
                                  }
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <Input
                        placeholder="Contato"
                        className="w-[250px]"
                        value={newContact.content}
                        onChange={(e) => {
                          setNewContact({
                            ...newContact,
                            content: e.target.value,
                          });
                        }}
                      />
                      <Button onClick={handleAddContacts} type="button">
                        <CirclePlus />
                      </Button>
                    </div>

                    <div>
                      <Table className="min-w-96">
                        {company.contacts.length === 0 ? (
                          <TableCaption>Sem contatos cadastrados</TableCaption>
                        ) : (
                          <></>
                        )}

                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="w-[250px]">Contato</TableHead>
                            <TableHead>Ação</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {company.contacts &&
                            company.contacts.map((contact) => {
                              return (
                                <TableRow key={contact.id}>
                                  <TableCell>
                                    {
                                      typeContacts[
                                        contact.type as keyof typeof typeContacts
                                      ]
                                    }
                                  </TableCell>
                                  <TableCell>{contact.content}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant={"destructive"}
                                      onClick={() =>
                                        handleRemoveContacts(contact.id)
                                      }
                                    >
                                      <Trash />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label className=" text-right">Descrição:</Label>
                    <div className="flex max-w-xl min-h-64 max-h-screen mb-12">
                      <WYSIWYGEditor
                        content={company.about}
                        handleEditorContent={(e) => {
                          setCompany({
                            ...company,
                            about: e,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="address"
              className="bg-white rounded-md mx-2 h-[calc(100vh-220px)] p-4"
            >
              <div className="flex flex-row flex-wrap justify-around gap-4 h-auto w-full">
                <div className="flex flex-col gap-4 min-w-96">
                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="street" className="text-right">
                      Rua:
                    </Label>
                    <Input
                      id="street"
                      type="text"
                      value={company.street}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          street: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="number" className="text-right">
                      Número:
                    </Label>
                    <Input
                      id="number"
                      type="text"
                      value={company.number}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          number: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="neighborhood" className="text-right">
                      Bairro:
                    </Label>
                    <Input
                      id="neighborhood"
                      type="text"
                      value={company.neighborhood}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          neighborhood: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="city" className="text-right">
                      Cidade:
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={company.city}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-96">
                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="state" className="text-right">
                      Estado:
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      value={company.state}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          state: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="zipCode" className="text-right">
                      CEP:
                    </Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={company.zipCode}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          zipCode: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="latitude" className="text-right">
                      Latitude:
                    </Label>
                    <Input
                      id="latitude"
                      type="text"
                      value={company.latitude}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          latitude: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="longitude" className="text-right">
                      Longitude:
                    </Label>
                    <Input
                      id="longitude"
                      type="text"
                      value={company.longitude}
                      onChange={(e) =>
                        setCompany({
                          ...company,
                          longitude: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mx-4 mb-4 flex flex-row justify-end gap-4">
            <Button onClick={handleAddCompany}>Salvar</Button>
          </div>
        </div>
      </div>

      {isLoading && <Loading />}
    </>
  );
}
