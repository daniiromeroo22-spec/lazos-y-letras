"use client";

import type { BookSummary } from "@/lib/openLibrary";
import { useShelf } from "@/lib/shelf";

type ShelfButtonProps = {
  book: BookSummary;
  /** Versión más chiquita para las tarjetas. */
  compact?: boolean;
};

// Botón que guarda o quita un libro del estante.
export function ShelfButton({ book, compact = false }: ShelfButtonProps) {
  const { hasBook, addBook, removeBook } = useShelf();
  const saved = hasBook(book.id);

  return (
    <button
      type="button"
      // aria-pressed le dice a lectores de pantalla si el botón está "activado"
      aria-pressed={saved}
      onClick={() => (saved ? removeBook(book.id) : addBook(book))}
      className={`btn ${saved ? "btn-secondary" : "btn-primary"} ${
        compact ? "w-full !px-3 !py-2 !text-xs" : ""
      }`}
    >
      {saved ? "En mi estante ✓ (quitar)" : "Guardar en mi estante ♡"}
    </button>
  );
}
