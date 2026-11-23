import { NextResponse, type NextRequest } from "next/server";
import { searchBooks } from "@/lib/openLibrary";

/**
 * Route Handler:  GET /api/libros?q=jane+austen
 *
 * Es una mini-API DENTRO de nuestro proyecto. El navegador le habla a ella
 * y ella le habla a Open Library. ¿Por qué no llamar a Open Library directo
 * desde el navegador?
 *  1. Podemos validar lo que escribe la persona antes de gastar una petición.
 *  2. Mandamos nuestro User-Agent/correo sin exponerlo en el navegador.
 *  3. Si mañana cambiamos de proveedor, el frontend ni se entera.
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  // 400 = "Bad Request": la petición vino mal armada.
  if (query.length < 2 || query.length > 100) {
    return NextResponse.json(
      { error: "Escribe entre 2 y 100 caracteres para buscar." },
      { status: 400 },
    );
  }

  try {
    const books = await searchBooks(query);
    return NextResponse.json({ books });
  } catch (error) {
    console.error("[api/libros] Falló la búsqueda:", error);
    // 502 = "Bad Gateway": el problema está en el servicio externo, no en nosotras.
    return NextResponse.json(
      { error: "No pudimos consultar Open Library. Intenta de nuevo en un momento." },
      { status: 502 },
    );
  }
}
