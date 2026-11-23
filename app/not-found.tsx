import Link from "next/link";
import { Bow } from "@/components/Bow";

// Se muestra cuando la ruta no existe o cuando llamamos a notFound().
export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md text-center">
      <Bow className="float mx-auto h-12 w-16 text-rose" />
      <h1 className="mt-3 text-4xl font-bold italic text-berry">
        Esta página se perdió entre los libros
      </h1>
      <p className="mt-2 text-sm">Error 404: no encontramos lo que buscabas.</p>
      <Link href="/" className="btn btn-primary mt-5">
        Volver al inicio
      </Link>
    </div>
  );
}
