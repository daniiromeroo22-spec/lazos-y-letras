# 🎀 Lazos & Letras

Diario de lecturas: busca libros en el catálogo de Open Library, guárdalos en tu estante y marca si quieres leerlos, los estás leyendo o ya los terminaste.

Proyecto de la actividad **«Implementación de Aplicación Next.js mediante Vibe Coding»**: la IA actuó como copiloto y yo dirigí, validé y corregí cada paso. El registro completo del proceso está en [`VIBE_CODING.md`](./VIBE_CODING.md).

🔗 **Demo en producción:** https://lazos-y-letras.vercel.app/

---

## ✨ Funcionalidades

- Búsqueda de libros por título, autora o tema (con _debounce_ y cancelación de peticiones).
- Detalle de cada libro: portada, autoría, año, temas y sinopsis.
- «Mi estante»: guardar/quitar libros y cambiar su estado (Quiero leerlo · Leyendo · Leído), con filtros por estado.
- Estados de **carga** (skeletons) y de **error** (con botón de reintento) en búsqueda y detalle.
- Diseño **responsive** (menú tipo hamburguesa en móvil) y accesible (enlace «saltar al contenido», `aria-*`, foco visible, `prefers-reduced-motion`).

## ✅ Requisitos de la actividad y dónde se cumplen

| Requisito | Dónde |
| --- | --- |
| Next.js 16+ con App Router | `app/` · `package.json` |
| TypeScript | Todo el proyecto (`.ts` / `.tsx`) |
| Tailwind CSS | `app/globals.css` + clases en componentes |
| ≥ 4 rutas distintas | `/`, `/libros`, `/libros/[id]`, `/mi-estante`, `/sobre` |
| API interna (Route Handlers) + API externa | `app/api/libros/route.ts`, `app/api/libros/[id]/route.ts` → Open Library |
| Server + Client Components | Server: páginas y `Footer`. Client: `Navbar`, `SearchBox`, `ShelfView`, `ShelfButton` |
| `useState` y `useEffect` | `SearchBox.tsx` (estado, efecto con debounce), `Navbar.tsx`, `ShelfView.tsx` |
| Responsive | Rejillas y menú adaptables (clases `sm:` `md:` `lg:`) |
| Loading UI y Error UI | `app/loading.tsx`, `app/libros/[id]/loading.tsx`, `app/error.tsx`, `app/libros/[id]/error.tsx`, `app/not-found.tsx` |
| Variables de entorno | `.env.local` (ver `.env.example`) |
| Documento de proceso | [`VIBE_CODING.md`](./VIBE_CODING.md) |

## 🧰 Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · [Open Library API](https://openlibrary.org/developers/api) (gratuita, sin clave) · `localStorage` para el estante.

## 🚀 Instalación y uso

Requisitos: **Node.js 20.9 o superior** y npm.

```bash
# 1. Instala dependencias
npm install

# 2. Crea tu archivo de variables de entorno
cp .env.example .env.local
#    (edita APP_CONTACT_EMAIL con tu correo)

# 3. Arranca en modo desarrollo
npm run dev
#    abre http://localhost:3000
```

Otros comandos:

```bash
npm run lint    # revisa el código con ESLint
npm run build   # compila para producción
npm start       # sirve la build de producción
```

## 🔐 Variables de entorno

| Variable | ¿Dónde se usa? | Para qué |
| --- | --- | --- |
| `APP_CONTACT_EMAIL` | Solo servidor | Va en el `User-Agent` hacia Open Library (su API pide identificarse). |
| `NEXT_PUBLIC_SITE_URL` | Servidor y cliente | URL pública, para metadatos y vistas previas al compartir. |

`.env.local` está en `.gitignore`; solo se sube `.env.example`.

## 🗂️ Estructura

```
app/
  layout.tsx            Layout global (tipografías, navbar, footer)
  page.tsx              /               Inicio
  libros/page.tsx       /libros         Búsqueda (lee ?q= de la URL)
  libros/[id]/          /libros/OL…W    Detalle + loading.tsx + error.tsx
  mi-estante/page.tsx   /mi-estante     Estante guardado
  sobre/page.tsx        /sobre          Sobre el proyecto
  api/libros/…          Route Handlers (búsqueda y detalle)
components/             Navbar, Footer, Bow, BookCard, BookCover, SearchBox, ShelfView, ShelfButton
lib/
  openLibrary.ts        Acceso a la API externa (tipos + fetch + validaciones)
  shelf.ts              Estante en localStorage (useSyncExternalStore)
```

## ☁️ Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new) importa el repo (Vercel detecta Next.js solo).
3. En **Environment Variables** agrega `APP_CONTACT_EMAIL` y `NEXT_PUBLIC_SITE_URL` (con la URL que te asigne Vercel).
4. Deploy. Pega el enlace arriba, en «Demo en producción».

## ⚠️ Limitaciones conocidas

- El estante vive en el `localStorage` de cada navegador: no se sincroniza entre dispositivos ni sobrevive si se borran los datos del sitio.
- Depende de la disponibilidad y los datos de Open Library (algunos libros no tienen portada o sinopsis).

## 🙏 Créditos

Datos y portadas: [Open Library](https://openlibrary.org). Tipografías: Cormorant Garamond y Nunito (Google Fonts).
