import type { Metadata } from "next";
import { Bow } from "@/components/Bow";

export const metadata: Metadata = {
  title: "Sobre el proyecto",
  description: "Cómo está hecha Lazos & Letras.",
};

const STACK = [
  { name: "Next.js 16 (App Router)", note: "Rutas, Server Components y Route Handlers" },
  { name: "TypeScript", note: "Tipos para atrapar errores antes de ejecutar" },
  { name: "Tailwind CSS 4", note: "Estilos y diseño responsive" },
  { name: "Open Library API", note: "Catálogo de libros, gratuito y sin clave" },
  { name: "localStorage", note: "Guarda tu estante en tu propio dispositivo" },
];

// Ruta 5: "/sobre"
export default function SobrePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header className="text-center">
        <Bow className="mx-auto h-10 w-14 text-rose" />
        <h1 className="mt-3 text-5xl font-bold italic text-berry">
          Sobre el proyecto
        </h1>
        <p className="mt-3">
          Lazos &amp; Letras nació como práctica de <strong>Vibe Coding</strong>:
          construir una app completa dirigiendo a una IA como copiloto, pero
          revisando, corrigiendo y decidiendo cada paso de la arquitectura.
        </p>
      </header>

      <section aria-labelledby="stack" className="card">
        <h2 id="stack" className="text-3xl font-bold italic text-berry">
          Tecnologías
        </h2>
        <ul className="mt-4 space-y-3">
          {STACK.map((item) => (
            <li key={item.name} className="flex flex-col sm:flex-row sm:gap-3">
              <span className="font-bold text-berry">{item.name}</span>
              <span className="text-sm sm:pt-0.5">— {item.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="privacidad" className="card">
        <h2 id="privacidad" className="text-3xl font-bold italic text-berry">
          Tu estante es tuyo
        </h2>
        <p className="mt-2 text-sm">
          No hay cuentas ni base de datos: lo que guardas se almacena solo en
          este navegador. Si borras los datos del sitio o cambias de
          dispositivo, el estante empezará vacío.
        </p>
      </section>
    </div>
  );
}
