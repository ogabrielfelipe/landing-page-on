import type { Metadata } from "next";
import localFont from "next/font/local";
import "./adminStyles.css";
import { NextAuthProvider } from "./NextAuthProvider";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LandingPage.on",
  description:
    "Sistema dedicado para criar e gerenciar sites web de acordo com as informaçẽos das instituições",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/landingpage-on-icon.ico" />
        <title>LandingPage.On</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>{children}</NextAuthProvider>

        <footer className="fixed bottom-0 w-full bg-blue-900 text-blue-100">
          <div className="border-blue-800 text-center flex justify-center">
            <p className="text-sm text-blue-400 p-1">
              © {new Date().getFullYear()}{" "}
              <a
                href="https://portfolio-ogabrielfelipe.netlify.app/"
                target="_blank"
                className="text-blue-100"
              >
                ogabrielfelipe
              </a>
              . All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
