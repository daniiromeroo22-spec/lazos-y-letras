import type { Metadata } from "next";
import { SearchBox } from "@/components/SearchBox";

export const metadata: Metadata = {
  title: "Buscar libros",
  description: "Busca libros por título, autora o tema.",
};

// Ruta 2: "/libros"
// Esta página es un Server Component que lee el parámetro ?q= de la URL
// y se lo pasa como "prop" al SearchBox, que es un Client Component.
// Patrón muy común: el servidor prepara lo inicial y el cliente maneja la interacción.
export default async function LibrosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams; // en Next 16 es una Promesa
  const raw = Array.isArray(q) ? q[0] : q;
  const initialQuery = (raw ?? "").trim().slice(0, 100); // limpiamos lo que viene de la URL

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-5xl font-bold italic text-berry">Buscar libros</h1>
        <p className="mt-2">Encuentra tu próxima lectura favorita ♡</p>
      </header>
      <SearchBox initialQuery={initialQuery} />
    </div>
  );
}
