"use client";

import { useEffect, useState } from "react";
import type { BookSummary } from "@/lib/openLibrary";
import { Bow } from "./Bow";
import { BookCard } from "./BookCard";

type Status = "idle" | "loading" | "done" | "error";

const SUGGESTIONS = [
  "Jane Austen",
  "Cien años de soledad",
  "poesía romántica",
  "Mujercitas",
  "jardines",
];

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  // ── Estado: la "memoria" del componente ───────────────────────────────
  const [query, setQuery] = useState(initialQuery); // lo que escribe la persona
  const [books, setBooks] = useState<BookSummary[]>([]); // resultados
  const [status, setStatus] = useState<Status>("idle"); // en qué etapa estamos
  const [attempt, setAttempt] = useState(0); // sube +1 cuando pulsa "Intentar otra vez"

  const trimmed = query.trim();
  const canSearch = trimmed.length >= 2;
  // Si hay muy poco texto, mostramos el estado inicial sin importar lo anterior.
  const view: Status = canSearch ? status : "idle";

  // ── Efecto: se ejecuta cuando cambian trimmed / attempt ────────────────
  useEffect(() => {
    if (!canSearch) return;

    const controller = new AbortController(); // nos permite cancelar una petición en vuelo

    // "Debounce": esperamos 450 ms después de la última tecla para buscar.
    // Sin esto, escribir "austen" dispararía 6 peticiones, una por letra.
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const res = await fetch(`/api/libros?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Estado ${res.status}`);
        const data = (await res.json()) as { books: BookSummary[] };
        setBooks(data.books);
        setStatus("done");
      } catch (error) {
        // Cancelar a propósito NO es un error real.
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      }
    }, 450);

    // Función de limpieza: React la llama antes de repetir el efecto.
    // Cancela el temporizador y la petición vieja para evitar resultados "fantasma".
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, canSearch, attempt]);

  return (
    <div className="space-y-8">
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()} // evita recargar la página al dar Enter
        className="card flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label htmlFor="busqueda" className="sr-only">
          Buscar un libro o autora
        </label>
        <input
          id="busqueda"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          maxLength={100}
          placeholder="Busca por título, autora o tema…"
          autoComplete="off"
          className="w-full rounded-full border-2 border-petal bg-cream px-5 py-3 text-base placeholder:text-cocoa/60 focus:border-rose"
        />
      </form>

      {view === "idle" && (
        <div className="text-center">
          <Bow className="float mx-auto h-12 w-16 text-rose" />
          <p className="mt-3 font-display text-2xl italic text-berry">
            ¿Qué te gustaría leer hoy?
          </p>
          <p className="mt-1 text-sm">Escribe al menos 2 letras o prueba con una idea:</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  className="chip transition hover:bg-petal"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Estado de carga: "esqueletos" que imitan las tarjetas mientras llegan los datos */}
      {view === "loading" && (
        <ul
          aria-busy="true"
          aria-label="Cargando resultados"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <li
              key={index}
              className="card h-72 animate-pulse !bg-blush/70"
            />
          ))}
        </ul>
      )}

      {/* Estado de error con opción de reintentar */}
      {view === "error" && (
        <div role="alert" className="card mx-auto max-w-md text-center">
          <p className="font-display text-2xl font-bold text-berry">
            Ay, se nos enredó el lazo
          </p>
          <p className="mt-2 text-sm">
            No pudimos traer los libros. Revisa tu conexión e inténtalo otra vez.
          </p>
          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Intentar otra vez
          </button>
        </div>
      )}

      {view === "done" && books.length === 0 && (
        <p className="text-center font-display text-2xl italic text-berry">
          No encontramos nada con «{trimmed}». Prueba con otra palabra ♡
        </p>
      )}

      {view === "done" && books.length > 0 && (
        <section aria-live="polite">
          <p className="mb-4 text-sm">
            {books.length} resultados para <strong>{trimmed}</strong>
          </p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
