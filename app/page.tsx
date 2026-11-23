import Link from "next/link";
import { Bow } from "@/components/Bow";

// Ruta 1: "/"  ·  Server Component (no lleva "use client").
// Se genera en el servidor y llega al navegador como HTML listo: carga rapidísimo.

const STEPS = [
  {
    emoji: "🔍",
    title: "Busca",
    text: "Encuentra cualquier libro por título, autora o tema en el catálogo de Open Library.",
  },
  {
    emoji: "🎀",
    title: "Guarda",
    text: "Átalo a tu estante con un lazo. Se queda guardado en tu propio dispositivo.",
  },
  {
    emoji: "📖",
    title: "Sigue tu lectura",
    text: "Marca si quieres leerlo, lo estás leyendo o ya lo terminaste.",
  },
];

const IDEAS = ["Jane Austen", "Mujercitas", "poesía romántica", "jardines"];

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="text-center">
        <Bow className="float mx-auto h-16 w-24 text-rose sm:h-20 sm:w-28" />
        <h1 className="mt-4 text-5xl font-bold italic text-berry sm:text-7xl">
          Lazos &amp; Letras
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg">
          Tu diario de lecturas, atado con un lazo. Descubre libros, guárdalos y
          lleva el cuento de todo lo que lees ♡
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/libros" className="btn btn-primary">
            Buscar un libro
          </Link>
          <Link href="/mi-estante" className="btn btn-secondary">
            Ver mi estante
          </Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section aria-labelledby="como-funciona">
        <h2
          id="como-funciona"
          className="text-center text-4xl font-bold italic text-berry"
        >
          Así de fácil
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="card text-center">
              <span aria-hidden="true" className="text-3xl">
                {step.emoji}
              </span>
              <h3 className="mt-2 text-2xl font-bold text-berry">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Ideas para empezar: enlaces que llevan la búsqueda en la URL (?q=...) */}
      <section
        aria-labelledby="ideas"
        className="rounded-3xl border-2 border-dashed border-rose bg-blush/70 p-8 text-center"
      >
        <h2 id="ideas" className="text-3xl font-bold italic text-berry">
          ¿No sabes por dónde empezar?
        </h2>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {IDEAS.map((idea) => (
            <li key={idea}>
              <Link
                href={`/libros?q=${encodeURIComponent(idea)}`}
                className="chip px-4 py-2 text-sm transition hover:bg-petal"
              >
                {idea}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
