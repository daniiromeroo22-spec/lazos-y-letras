import { NextResponse, type NextRequest } from "next/server";
import { getBook, isValidWorkId } from "@/lib/openLibrary";

/**
 * Route Handler:  GET /api/libros/OL45804W
 * Devuelve el detalle de un libro en JSON.
 *
 * Los corchetes en la carpeta [id] significan "esta parte de la URL es variable".
 * En Next 16, `params` llega como una Promesa, por eso hacemos `await`.
 */
export async function GET(
  _request: NextRequest, // el guion bajo indica "no lo uso"
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!isValidWorkId(id)) {
    return NextResponse.json({ error: "Identificador de libro inválido." }, { status: 400 });
  }

  try {
    const book = await getBook(id);
    if (!book) {
      return NextResponse.json({ error: "Libro no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ book });
  } catch (error) {
    console.error("[api/libros/:id] Falló la consulta:", error);
    return NextResponse.json(
      { error: "No pudimos consultar Open Library." },
      { status: 502 },
    );
  }
}
