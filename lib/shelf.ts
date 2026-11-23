/**
 * "Mi estante": los libros que la persona guarda.
 *
 * Se guardan en el localStorage del navegador (una mini-libreta que vive en
 * tu propio dispositivo). Ventaja: no necesitamos base de datos ni cuentas.
 * Limitación: los datos no viajan entre dispositivos (lo documentamos en el README).
 *
 * Para que VARIOS componentes (la barra, las tarjetas, la página del estante)
 * vean siempre la misma lista al instante, usamos `useSyncExternalStore`:
 * es el hook de React para "suscribirse" a algo que vive FUERA de React,
 * como el localStorage. Piensa en una suscripción a un canal: cuando el
 * canal publica algo nuevo, todos los suscriptores se enteran.
 */
import { useSyncExternalStore } from "react";
import type { BookSummary } from "./openLibrary";

export type ShelfStatus = "quiero" | "leyendo" | "leido";

export type ShelfItem = BookSummary & {
  status: ShelfStatus;
  addedAt: number; // fecha de guardado (milisegundos), sirve para ordenar
};

export const STATUS_LABELS: Record<ShelfStatus, string> = {
  quiero: "Quiero leerlo",
  leyendo: "Leyendo",
  leido: "Leído ♡",
};

const STORAGE_KEY = "lazos-y-letras:estante";
const CHANGE_EVENT = "estante-cambio"; // evento propio para avisar cambios en ESTA pestaña
const EMPTY: ShelfItem[] = []; // constante: misma referencia siempre (importante para React)

const VALID_STATUS: ShelfStatus[] = ["quiero", "leyendo", "leido"];

// Revisa que lo guardado tenga la forma esperada (alguien pudo editarlo a mano).
function isShelfItem(value: unknown): value is ShelfItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    Array.isArray(item.authors) &&
    VALID_STATUS.includes(item.status as ShelfStatus)
  );
}

// ── Lectura con caché ──────────────────────────────────────────────────────
// useSyncExternalStore exige que, si nada cambió, devolvamos EXACTAMENTE el
// mismo objeto. Por eso recordamos el texto crudo y su resultado ya parseado.
let cachedRaw: string | null = null;
let cachedItems: ShelfItem[] = EMPTY;

function getSnapshot(): ShelfItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY; // localStorage bloqueado (modo privado, etc.)
  }

  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed) ? parsed.filter(isShelfItem) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange); // cambios desde OTRA pestaña
  window.addEventListener(CHANGE_EVENT, onChange); // cambios desde ESTA pestaña
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function save(items: ShelfItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Si no se puede guardar (almacenamiento lleno/bloqueado), la app sigue funcionando.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT)); // "¡hubo cambios, suscriptores!"
}

// ── Hooks públicos ─────────────────────────────────────────────────────────

export function useShelf() {
  // El 3er argumento es lo que se usa en el SERVIDOR (donde no existe localStorage).
  const items = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  return {
    items,
    hasBook: (id: string) => items.some((item) => item.id === id),

    addBook: (book: BookSummary) => {
      const current = getSnapshot();
      if (current.some((item) => item.id === book.id)) return; // evita duplicados
      save([{ ...book, status: "quiero", addedAt: Date.now() }, ...current]);
    },

    removeBook: (id: string) => {
      save(getSnapshot().filter((item) => item.id !== id));
    },

    changeStatus: (id: string, status: ShelfStatus) => {
      save(
        getSnapshot().map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
      );
    },
  };
}

/**
 * ¿Ya estamos en el navegador? Sirve para no mostrar "estante vacío"
 * por un instante mientras la página termina de cargar.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {}, // no hay nada a lo que suscribirse
    () => true, // en el navegador: sí
    () => false, // en el servidor: no
  );
}
