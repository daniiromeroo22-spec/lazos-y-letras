"use client";
// "use client" = este componente corre en el NAVEGADOR.
// Lo necesitamos porque usa estado (useState) y la ruta actual (usePathname).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useShelf } from "@/lib/shelf";
import { Bow } from "./Bow";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/libros", label: "Buscar libros" },
  { href: "/mi-estante", label: "Mi estante" },
  { href: "/sobre", label: "Sobre el proyecto" },
];

export function Navbar() {
  const pathname = usePathname(); // ej. "/libros"
  const [menuOpen, setMenuOpen] = useState(false); // ¿está abierto el menú del celular?
  const { items } = useShelf(); // para mostrar cuántos libros hay en el estante

  // "Inicio" solo se marca si estamos EXACTAMENTE en "/"; las demás, si la ruta empieza igual.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClasses = (href: string) =>
    `rounded-full px-4 py-2 text-sm font-bold transition-colors ${
      isActive(href)
        ? "bg-berry text-cream"
        : "text-berry hover:bg-petal/50"
    }`;

  return (
    <header className="lace relative z-40 border-b-2 border-petal bg-blush">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl font-bold italic text-berry"
          onClick={() => setMenuOpen(false)}
        >
          <Bow className="h-6 w-9 text-rose" />
          Lazos &amp; Letras
        </Link>

        {/* Menú de escritorio (se oculta en pantallas pequeñas) */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={linkClasses(link.href)}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
                {link.href === "/mi-estante" && items.length > 0 && (
                  <span className="ml-2 rounded-full bg-cream px-2 py-0.5 text-xs text-berry">
                    {items.length}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón hamburguesa (solo en celular) */}
        <button
          type="button"
          className="rounded-full border-2 border-rose px-3 py-1.5 text-sm font-bold text-berry md:hidden"
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Cerrar ✕" : "Menú ♡"}
        </button>
      </nav>

      {/* Menú de celular: solo existe en el HTML cuando menuOpen es true */}
      {menuOpen && (
        <ul
          id="menu-movil"
          className="flex flex-col gap-1 border-t border-petal px-4 pb-4 pt-3 md:hidden"
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block ${linkClasses(link.href)}`}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                {link.href === "/mi-estante" && items.length > 0 && (
                  <span className="ml-2 rounded-full bg-cream px-2 py-0.5 text-xs text-berry">
                    {items.length}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
