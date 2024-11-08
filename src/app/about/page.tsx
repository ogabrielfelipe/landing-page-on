import Footer from "@/components/footer";
import Header from "@/components/header";
import { getCompany } from "@/http/web/get-company";

async function getData() {
  const res = await getCompany();
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function About() {
  const { company } = await getData();

  return (
    <>
      <Header />

      <main>
        <section
          id="abouts"
          aria-labelledby="about-titulo"
          className="m-2/3 h-screen max-m-screen m-auto overflow-hidden px-8 py-4"
        >
          <h2
            id="about-titulo"
            className="text-3xl font-bold text-blue-900 border-b-2 border-[#ff9800] pb-2 mb-3"
          >
            Sobre nossa escola
          </h2>

          <div
            className="m-3 text-black opacity-90"
            dangerouslySetInnerHTML={{ __html: company?.about || "" }}
          ></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
