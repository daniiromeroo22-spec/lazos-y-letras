import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

// next/font descarga la tipografía en el build y la sirve desde nuestro
// propio dominio (más rápido y sin saltos visuales al cargar).
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant", // nombre de la variable CSS que usa globals.css
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

// "metadata" = lo que ve el navegador/Google: título, descripción, etc.
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Lazos & Letras ♡",
    template: "%s · Lazos & Letras",
  },
  description:
    "Tu diario de lecturas con estética coquette: busca libros, guárdalos en tu estante y sigue tu progreso.",
};

// El layout envuelve TODAS las páginas: lo que pongas aquí (barra, pie)
// aparece en cada ruta, y {children} es la página actual.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${cormorant.variable} ${nunito.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        {/* Enlace oculto para quien navega con teclado o lector de pantalla */}
        <a
          href="#contenido"
          className="sr-only rounded-full bg-berry px-4 py-2 text-cream focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <main
          id="contenido"
          className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
