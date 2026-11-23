import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/BookCover";
import { ShelfButton } from "@/components/ShelfButton";
import { getBook } from "@/lib/openLibrary";

// Ruta 3: "/libros/OL45804W"  (la carpeta [id] hace que esta parte sea variable)
// Server Component ASÍNCRONO: puede hacer `await` directo para traer datos.
// Nota de arquitectura: aquí llamamos a la función getBook() directamente,
// NO a nuestro propio /api/libros/[id]. Dar la vuelta por HTTP al propio
// servidor sería un paso extra innecesario.

type Props = { params: Promise<{ id: string }> };

// Título dinámico para la pestaña del navegador.
// getBook se llama aquí y en la página, pero fetch recuerda la respuesta
// durante la misma petición, así que no se pide dos veces.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const book = await getBook(id);
    return { title: book ? book.title : "Libro no encontrado" };
  } catch {
    return { title: "Libro" };
  }
}

export default async function LibroPage({ params }: Props) {
  const { id } = await params;
  const book = await getBook(id); // si la API falla, lanza error y entra error.tsx

  if (!book) notFound(); // muestra la página 404 (app/not-found.tsx)

  const description =
    book.description && book.description.length > 1200
      ? `${book.description.slice(0, 1200)}…`
      : book.description;

  return (
    <article className="space-y-8">
      <Link
        href="/libros"
        className="inline-block text-sm font-bold text-berry underline decoration-petal decoration-2 underline-offset-4 hover:decoration-rose"
      >
        ← Volver a la búsqueda
      </Link>

      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <BookCover
          title={book.title}
          url={book.coverUrl}
          className="mx-auto w-48 md:w-full"
        />

        <div className="space-y-5">
          <header>
            <h1 className="text-4xl font-bold leading-tight text-berry sm:text-5xl">
              {book.title}
            </h1>
            <p className="mt-2 text-lg">
              {book.authors.length > 0 ? book.authors.join(", ") : "Autoría desconocida"}
              {book.year ? ` · ${book.year}` : ""}
            </p>
          </header>

          {book.subjects.length > 0 && (
            <ul aria-label="Temas" className="flex flex-wrap gap-2">
              {book.subjects.map((subject) => (
                <li key={subject} className="chip">
                  {subject}
                </li>
              ))}
            </ul>
          )}

          <section aria-labelledby="sinopsis">
            <h2 id="sinopsis" className="text-3xl font-bold italic text-berry">
              Sinopsis
            </h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed">
              {description ?? "Este libro todavía no tiene sinopsis en Open Library."}
            </p>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            {/* Client Component dentro de una página de servidor: se "hidrata" solo él */}
            <ShelfButton book={book} />
            <a
              href={`https://openlibrary.org/works/${book.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Ver en Open Library ↗
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
