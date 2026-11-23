import type { Metadata } from "next";
import { ShelfView } from "@/components/ShelfView";

export const metadata: Metadata = {
  title: "Mi estante",
  description: "Los libros que guardaste y cómo va tu lectura.",
};

// Ruta 4: "/mi-estante"
// La página es de servidor (solo pone el título); lo interactivo vive en <ShelfView />,
// que es un Client Component porque lee el localStorage del navegador.
export default function MiEstantePage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-5xl font-bold italic text-berry">Mi estante</h1>
        <p className="mt-2">Tus lecturas, bien atadas con un lazo ♡</p>
      </header>
      <ShelfView />
    </div>
  );
}
