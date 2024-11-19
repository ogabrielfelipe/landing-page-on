interface CardProps {
  contents: Array<Record<string, string | number>>;
  isLink?: boolean;
  url?: string;
}

export default function Card({ contents, isLink, url }: CardProps) {
  return (
    <>
      {contents.map((content) => {
        return (
          <div
            key={content.id}
            className="bg-blue-50 bg-opacity-50 p-4 shadow-md m-3 rounded-lg flex flex-col gap-2 cursor-pointer hover:translate-y-[-0.25rem] hover:bg-opacity-70 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-black">{content.name}</h3>
            <p className="text-black">
              Duração: {content.duration} meses | Nível:{" "}
              {content.level == "INITIAL" ? (
                <>Iniciante</>
              ) : content.level == "INTERMEDIARY" ? (
                <>Intermediário</>
              ) : content.level == "ADVANCED" ? (
                <>Avançado</>
              ) : (
                <></>
              )}{" "}
              | Instrutor: Prof. {content.instructor}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: content.shortDescription }}
            ></div>

            {isLink ? (
              <a
                href={`${url}/${content.id}`}
                className="inline-block bg-[#ff9800] text-white p-2 m-1 text-center decoration-none rounded-md transition hover:bg-orange-500 hover:translate-y-1"
              >
                Detalhes do curso
              </a>
            ) : (
              <></>
            )}
          </div>
        );
      })}
    </>
  );
}
