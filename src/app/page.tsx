'use client'

import { WhatsappLogo, InstagramLogo } from "@phosphor-icons/react";
import Link from "next/link";


export default function Home() {
  return (
    <>
     <header className="bg-blue-900 text-blue-100 text-center p-8">
        <h1 className="m-0 text-2xl">Instituto de Ensino Eduardo Meotte</h1>
        <p className="m-0 text-sm">Excelência em Educação Musical</p>
    </header>

    <nav className="bg-blue-800 text-blue-900 text-center p-4" aria-label="Navegação principal">
        <a className="text-blue-100 decoration-none hover:text-blue-500 p-1 m-0.5" href="#cursos">Cursos</a>
        <a className="text-blue-100 decoration-none hover:text-blue-500 p-1 m-0.5" href="#sobre">Sobre</a>
        <a className="text-blue-100 decoration-none hover:text-blue-500 p-1 m-0.5" href="#contato">Contato</a>
    </nav>

    <main>
        <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
            <section id="intro" className="flex flex-col items-center justify-center flex-wrap text-center gap-4">
                <h2 className="text-4xl font-bold text-blue-900">Bem-vindo à Excelência em Educação Musical</h2>
                <p>Descubra seu potencial musical com instrutores experientes e instalações de ponta.</p>
                <a href="#cursos" className="inline-block bg-[#ff9800] text-white p-4 m-2 decoration-none rounded-md transition hover:bg-orange-500 hover:translate-y-1">Explorar Cursos</a>
            </section>

            <section id="cursos" aria-labelledby="cursos-titulo">
                <h2 id="cursos-titulo" className="text-3xl font-bold text-blue-900 border-b-2 border-[#ff9800] pb-2 mb-3">Nossos Cursos em Destaque</h2>
                <div className="bg-blue-50 bg-opacity-50 p-4 shadow-md m-3 rounded-lg flex flex-col gap-2 cursor-pointer hover:translate-y-[-0.25rem] hover:bg-opacity-70 transition-all duration-300">
                    <h3 className="text-xl font-bold text-black">Violão para Iniciantes</h3>
                    <p className="text-black">Duração: 8 semanas | Nível: Iniciante | Instrutor: Prof. Eduardo Meotte</p>
                    <p className="text-black">Aprenda os fundamentos do violão e comece a tocar suas músicas favoritas!</p>
                </div>
                <div className="bg-blue-50 bg-opacity-50 p-4 shadow-md m-3 rounded-lg flex flex-col gap-2 cursor-pointer hover:translate-y-[-0.25rem] hover:bg-opacity-70 transition-all duration-300">
                    <h3 className="text-xl font-bold text-black">Piano Avançado</h3>
                    <p className="text-black">Duração: 12 semanas | Nível: Avançado | Instrutor: Profa. Maria Silva</p>
                    <p className="text-black">Aperfeiçoe suas habilidades e domine técnicas avançadas de piano.</p>
                </div>
            </section>
        </div>

        <section id="testimonials" aria-labelledby="testimonials-titulo" className="bg-blue-800 text-blue-100 px-10 w-full max-w-screen min-h-[50vh]  p-4 overflow-hidden">
            <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
                <h2 id="testimonials-titulo" className="text-3xl font-bold text-blue-100 border-b-2 border-[#ff9800] pb-2 mb-3" >Depoimentos de Alunos</h2>
                <blockquote className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-50 m-10">
                    <p className="text-blue-50">"O Instituto Eduardo Meotte transformou minha paixão pela música em uma carreira próspera. Os instrutores são incríveis!"</p>
                    <footer className="bg-blue-900 text-blue-50 p-2 mt-8 rounded-md font-bold text-center" >- Ana L., Aluna de Violão</footer>
                </blockquote>
                <blockquote className="border-l-2 flex flex-col justify-center border-[#ff9800] pl-4 font-light text-blue-50 m-10">
                    <p className="text-blue-50">"O Instituto Eduardo Meotte transformou minha paixão pela música em uma carreira próspera. Os instrutores são incríveis!"</p>
                    <footer className="bg-blue-900 text-blue-50 p-2 mt-8 rounded-md font-bold text-center" >- Ana L., Aluna de Violão</footer>
                </blockquote>

            </div>

            
        </section>

        <div className="m-2/3 max-m-screen m-auto overflow-hidden px-8 py-4">
            <section id="sobre" aria-labelledby="sobre-titulo">
                <h2 id="sobre-titulo" className="text-3xl font-bold text-blue-900 border-b-2 border-[#ff9800] pb-2 mb-3">Sobre Nós</h2>
                <p className="m-3 text-black opacity-90">O Instituto de Ensino Eduardo Meotte é dedicado a nutrir talentos musicais há mais de 20 anos. Nossa missão é proporcionar educação musical de alta qualidade em um ambiente inspirador e colaborativo.</p>
            </section>            
        </div>
    </main>

    
    <footer className="bg-blue-900 text-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center"> 

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Outros links</h3>
            <ul className="space-y-2">
              <li><Link href="/admin" className="text-sm hover:text-white transition-colors">Administração</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contatos</h3>
            <p className="text-sm">123 Tech Street, Silicon Valley, CA 94000</p>
            <p className="text-sm">Email: info@example.com</p>
            <p className="text-sm">Phone: (123) 456-7890</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <InstagramLogo size={32} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <WhatsappLogo size={32} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-800 text-center">
          <p className="text-sm text-blue-400">
            &copy; {new Date().getFullYear()} Instituto de Ensino Eduardo Meotte. Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido por: <a href="https://portfolio-ogabrielfelipe.netlify.app/" target="_blank" className="text-blue-100">ogabrielfelipe</a>.
          </p>
        </div>
      </div>
    </footer> 

    </>
  );
}
