"use client";

import Head from "next/head";
import SideBar from "../_components/sideBar";
import HeaderAdmin from "../_components/header";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WYSIWYGEditor from "../_components/wysiwyg-editor";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type AboutProps = {
  name: string;
  description: string;
};

export default function SettingsManager() {
  const [about, setAbout] = useState<AboutProps>({
    name: "",
    description: "",
  });

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
                    <Input id="name" className="" />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="document" className="text-right">
                      Documento:
                    </Label>
                    <Input id="document" />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="contacts" className="text-right">
                      Contatos:
                    </Label>
                    <Input id="contacts" />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="email" className=" text-right">
                      Descrição:
                    </Label>
                    <div className="flex w-auto min-h-64 mb-12">
                      <WYSIWYGEditor
                        content={about.description}
                        handleEditorContent={(e) => {
                          setAbout({
                            ...about,
                            description: e,
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
              className="bg-white rounded-md mx-2 h-screen p-4"
            >
              <div className="flex flex-row justify-around gap-4 h-auto w-full">
                <div className="flex flex-col gap-4 min-w-96">
                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="street" className="text-right">
                      Rua:
                    </Label>
                    <Input id="street" className="" />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="number" className="text-right">
                      Número:
                    </Label>
                    <Input id="number" className="" />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="neighborhood" className="text-right">
                      Bairro:
                    </Label>
                    <Input id="neighborhood" className="" />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="city" className="text-right">
                      Cidade:
                    </Label>
                    <Input id="city" className="" />
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-96">
                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="state" className="text-right">
                      Estado:
                    </Label>
                    <Input id="state" className="" />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="zipCode" className="text-right">
                      CEP:
                    </Label>
                    <Input id="zipCode" className="" />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="latitude" className="text-right">
                      Latitude:
                    </Label>
                    <Input id="latitude" className="" />
                  </div>

                  <div className="flex flex-col mb-3 items-start gap-4">
                    <Label htmlFor="longitude" className="text-right">
                      Longitude:
                    </Label>
                    <Input id="longitude" className="" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mx-4 mb-4 flex flex-row justify-end gap-4">
            <Button variant={"outline"}>Cancelar</Button>
            <Button>Salvar</Button>
          </div>
        </div>
      </div>
    </>
  );
}
