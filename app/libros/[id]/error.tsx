"use client"; // Los error boundaries SIEMPRE son Client Components

import Link from "next/link";
import { useEffect } from "react";
import { Bow } from "@/components/Bow";

// error.tsx: si algo lanza un error mientras se arma esta página
// (por ejemplo, Open Library no responde), Next muestra esto en lugar de romper toda la app.
export default function LibroError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void; // vuelve a pedir los datos y a dibujar el segmento
}) {
  useEffect(() => {
    // Aquí normalmente enviarías el error a un servicio de monitoreo.
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="card mx-auto max-w-md text-center">
      <Bow className="mx-auto h-10 w-14 text-rose" />
      <h1 className="mt-3 text-3xl font-bold text-berry">
        No pudimos abrir este libro
      </h1>
      <p className="mt-2 text-sm">
        Open Library no respondió a tiempo. Inténtalo de nuevo en un momento ♡
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn btn-primary" onClick={() => retry()}>
          Intentar otra vez
        </button>
        <Link href="/libros" className="btn btn-secondary">
          Volver a buscar
        </Link>
      </div>
    </div>
  );
}
