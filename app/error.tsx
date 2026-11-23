"use client"; // Los error boundaries SIEMPRE son Client Components

import { useEffect } from "react";
import { Bow } from "@/components/Bow";

// Red de seguridad general: atrapa cualquier error inesperado de la app.
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="card mx-auto max-w-md text-center">
      <Bow className="mx-auto h-10 w-14 text-rose" />
      <h1 className="mt-3 text-3xl font-bold text-berry">
        Ups, algo salió mal
      </h1>
      <p className="mt-2 text-sm">
        Tuvimos un tropiezo inesperado. Intenta de nuevo; si sigue pasando,
        vuelve en un ratito ♡
      </p>
      <button type="button" className="btn btn-primary mt-5" onClick={() => retry()}>
        Intentar otra vez
      </button>
    </div>
  );
}
