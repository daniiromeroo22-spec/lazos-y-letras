"use client";

import Link from "next/link";
import { useState } from "react";
import {
  STATUS_LABELS,
  useHydrated,
  useShelf,
  type ShelfStatus,
} from "@/lib/shelf";
import { Bow } from "./Bow";
import { BookCover } from "./BookCover";

type Filter = "todos" | ShelfStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "quiero", label: STATUS_LABELS.quiero },
  { value: "leyendo", label: STATUS_LABELS.leyendo },
  { value: "leido", label: STATUS_LABELS.leido },
];

export function ShelfView() {
  const { items, removeBook, changeStatus } = useShelf();
  const hydrated = useHydrated();
  const [filter, setFilter] = useState<Filter>("todos");

  // Mientras la página termina de cargar en el navegador mostramos esqueletos
  // (si no, parpadearía el mensaje de "estante vacío" aunque haya libros).
  if (!hydrated) {
    return (
      <ul aria-busy="true" className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((n) => (
          <li key={n} className="card h-44 animate-pulse !bg-blush/70" />
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card mx-auto max-w-md text-center">
        <Bow className="float mx-auto h-12 w-16 text-rose" />
        <p className="mt-3 font-display text-2xl font-bold text-berry">
          Tu estante está esperando
        </p>
        <p className="mt-1 text-sm">
          Aún no guardas ningún libro. Busca uno y atrápalo con un lazo.
        </p>
        <Link href="/libros" className="btn btn-primary mt-4">
          Buscar libros
        </Link>
      </div>
    );
  }

  const visible =
    filter === "todos" ? items : items.filter((item) => item.status === filter);

  const countOf = (value: Filter) =>
    value === "todos"
      ? items.length
      : items.filter((item) => item.status === value).length;

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`btn ${filter === value ? "btn-primary" : "btn-secondary"}`}
          >
            {label} ({countOf(value)})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="font-display text-2xl italic text-berry">
          Nada por aquí todavía ♡
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {visible.map((item) => (
            <li key={item.id} className="card flex gap-4 !p-3">
              <BookCover
                title={item.title}
                url={item.coverUrl}
                className="w-24 shrink-0"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Link
                  href={`/libros/${item.id}`}
                  className="line-clamp-2 font-display text-xl font-bold leading-tight text-berry hover:underline"
                >
                  {item.title}
                </Link>
                <p className="line-clamp-1 text-sm">
                  {item.authors.length > 0 ? item.authors.join(", ") : "Autoría desconocida"}
                </p>

                <label className="text-xs font-bold text-berry">
                  Estado
                  <select
                    value={item.status}
                    onChange={(event) =>
                      changeStatus(item.id, event.target.value as ShelfStatus)
                    }
                    className="mt-1 block w-full rounded-full border-2 border-petal bg-cream px-3 py-1.5 text-sm font-normal text-cocoa"
                  >
                    {(Object.keys(STATUS_LABELS) as ShelfStatus[]).map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => removeBook(item.id)}
                  className="mt-auto self-start text-xs font-bold text-berry underline decoration-petal decoration-2 underline-offset-4 hover:decoration-rose"
                >
                  Quitar del estante
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
