/**
 * Capa de acceso a la API de Open Library (https://openlibrary.org/developers/api).
 *
 * ¿Por qué un archivo aparte?  Piensa en un restaurante:
 *  - las páginas son el "salón" (lo que ve el cliente),
 *  - este archivo es la "cocina" (sabe cómo pedir los datos).
 * Así, si mañana cambia la API, solo tocamos la cocina y no cada página.
 *
 * Lo usan DOS "meseros" distintos: los Route Handlers (app/api/...) y la
 * página de detalle (Server Component). Ambos llaman a estas funciones.
 */

const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org";

// ── Tipos: describen la FORMA de los datos que maneja nuestra app ──────────

export type BookSummary = {
  id: string; // ej. "OL45804W" (id de una "obra" en Open Library)
  title: string;
  authors: string[];
  year: number | null; // año de primera publicación
  coverUrl: string | null; // URL de la portada, o null si no tiene
};

export type BookDetail = BookSummary & {
  description: string | null;
  subjects: string[];
};

// ── Validación del id ──────────────────────────────────────────────────────
// Nunca metas texto que viene del usuario directo en una URL sin revisarlo.
// Un id válido es "OL" + números + "W". Cualquier otra cosa se rechaza.
const WORK_ID_PATTERN = /^OL\d{1,12}W$/;

export function isValidWorkId(id: string): boolean {
  return WORK_ID_PATTERN.test(id);
}

// ── Utilidades internas ────────────────────────────────────────────────────

function requestHeaders(): HeadersInit {
  // Open Library pide identificarse con un User-Agent y un contacto.
  // El correo vive en una variable de entorno (.env.local), no en el código.
  const contact = process.env.APP_CONTACT_EMAIL ?? "contacto@example.com";
  return {
    "User-Agent": `LazosYLetras/1.0 (${contact})`,
    Accept: "application/json",
  };
}

function buildCoverUrl(
  coverId: number | null | undefined,
  size: "S" | "M" | "L" = "M",
): string | null {
  // Open Library a veces devuelve -1 cuando no hay portada.
  return coverId && coverId > 0
    ? `${COVERS_URL}/b/id/${coverId}-${size}.jpg`
    : null;
}

// ── Búsqueda ───────────────────────────────────────────────────────────────

// Forma "cruda" de lo que devuelve la API (solo los campos que pedimos).
type RawSearchDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

export async function searchBooks(
  query: string,
  limit = 12,
): Promise<BookSummary[]> {
  const url = new URL(`${BASE_URL}/search.json`);
  url.searchParams.set("q", query); // URLSearchParams se encarga de escapar caracteres raros
  url.searchParams.set("limit", String(limit));
  url.searchParams.set(
    "fields",
    "key,title,author_name,first_publish_year,cover_i",
  );

  const res = await fetch(url, {
    headers: requestHeaders(),
    // Guardamos la respuesta 1 hora: si alguien busca lo mismo, es instantáneo
    // y además no saturamos la API gratuita.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Open Library respondió con estado ${res.status}`);
  }

  const data = (await res.json()) as { docs?: RawSearchDoc[] };

  return (data.docs ?? [])
    .filter((doc) => doc.key?.startsWith("/works/"))
    .map((doc) => ({
      id: (doc.key as string).replace("/works/", ""),
      title: doc.title ?? "Sin título",
      authors: doc.author_name?.slice(0, 3) ?? [],
      year: doc.first_publish_year ?? null,
      coverUrl: buildCoverUrl(doc.cover_i),
    }));
}

// ── Detalle de un libro ────────────────────────────────────────────────────

type RawWork = {
  title?: string;
  description?: string | { value?: string };
  subjects?: string[];
  covers?: number[];
  first_publish_date?: string;
  authors?: { author?: { key?: string } }[];
};

async function fetchAuthorName(authorKey: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}${authorKey}.json`, {
      headers: requestHeaders(),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { name?: string };
    return data.name ?? null;
  } catch {
    // Si falla el nombre de UNA autora no tiramos toda la página.
    return null;
  }
}

function cleanDescription(raw: RawWork["description"]): string | null {
  // La API a veces manda un texto y a veces un objeto { value: "..." }.
  const text = typeof raw === "string" ? raw : raw?.value;
  if (!text) return null;
  // Muchas descripciones traen una línea "-----" y fuentes al final: las quitamos.
  const firstBlock = text.split(/\r?\n-{5,}/)[0].trim();
  return firstBlock.length > 0 ? firstBlock : null;
}

/** Devuelve el libro, o `null` si no existe (404). Lanza error si la API falla. */
export async function getBook(id: string): Promise<BookDetail | null> {
  if (!isValidWorkId(id)) return null;

  const res = await fetch(`${BASE_URL}/works/${id}.json`, {
    headers: requestHeaders(),
    next: { revalidate: 86400 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Open Library respondió con estado ${res.status}`);
  }

  const work = (await res.json()) as RawWork;

  // Pedimos los nombres de autoras en paralelo (más rápido que uno por uno).
  const authorKeys = (work.authors ?? [])
    .map((entry) => entry.author?.key)
    .filter(
      (key): key is string =>
        typeof key === "string" && /^\/authors\/OL\d+A$/.test(key),
    )
    .slice(0, 3);

  const authorNames = (await Promise.all(authorKeys.map(fetchAuthorName))).filter(
    (name): name is string => name !== null,
  );

  const yearMatch = work.first_publish_date?.match(/\b(1\d{3}|20\d{2})\b/);

  return {
    id,
    title: work.title ?? "Sin título",
    authors: authorNames,
    year: yearMatch ? Number(yearMatch[1]) : null,
    coverUrl: buildCoverUrl(work.covers?.find((c) => c > 0), "L"),
    description: cleanDescription(work.description),
    subjects: (work.subjects ?? [])
      .filter((s): s is string => typeof s === "string")
      .slice(0, 8),
  };
}
