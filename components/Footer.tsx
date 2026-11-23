import { Bow } from "./Bow";

// Server Component (no lleva "use client"): no necesita interactividad,
// así que se renderiza en el servidor y no manda JavaScript extra al navegador.
export function Footer() {
  return (
    <footer className="mt-12 border-t-2 border-petal bg-blush/70">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-8 text-center text-sm sm:px-6">
        <Bow className="h-6 w-9 text-rose" />
        <p>
          Hecho con ♡ y mucho té. Los libros vienen de{" "}
          <a
            href="https://openlibrary.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-berry underline decoration-petal decoration-2 underline-offset-4 hover:decoration-rose"
          >
            Open Library
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
