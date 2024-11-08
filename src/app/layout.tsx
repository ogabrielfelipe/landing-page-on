import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Instituto de Ensino Eduardo Meotte",
  description:
    "escubra seu potencial musical no Instituto de Ensino Eduardo Meotte. Oferecemos cursos de violão, piano, e produção musical com instrutores experientes.",
  keywords: "violão, piano, produção musical, ensino de música, Eduardo Meotte",
  openGraph: {
    type: "website",
    title: "Instituto de Ensino Eduardo Meotte",
    description:
      "escubra seu potencial musical no Instituto de Ensino Eduardo Meotte. Oferecemos cursos de violão, piano, e produção musical com instrutores experientes.",
    images: [
      {
        url: "https://www.institutoemeotte.com/logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  authors: [
    {
      name: "ogabrielfelipe",
      url: "https://portfolio-ogabrielfelipe.netlify.app/",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-v2.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <NextTopLoader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
