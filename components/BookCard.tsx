import Link from "next/link";
import type { BookSummary } from "@/lib/openLibrary";
import { BookCover } from "./BookCover";
import { ShelfButton } from "./ShelfButton";

// Tarjeta de un libro en los resultados de búsqueda.
// Nota: el botón va FUERA del <Link>, porque meter un botón dentro de un
// enlace es HTML inválido y se comporta raro con teclado/lectores de pantalla.
export function BookCard({ book }: { book: BookSummary }) {
  return (
    <li className="card flex flex-col gap-3 !p-3">
      <Link
        href={`/libros/${book.id}`}
        className="group flex flex-1 flex-col gap-3"
      >
        <BookCover
          title={book.title}
          url={book.coverUrl}
          className="transition-transform group-hover:-rotate-1 group-hover:scale-[1.02] motion-reduce:transition-none"
        />
        <div>
          <h3 className="line-clamp-2 text-xl font-bold leading-tight text-berry group-hover:underline">
            {book.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm">
            {book.authors.length > 0 ? book.authors.join(", ") : "Autoría desconocida"}
            {book.year ? ` · ${book.year}` : ""}
          </p>
        </div>
      </Link>
      <ShelfButton book={book} compact />
    </li>
  );
}
