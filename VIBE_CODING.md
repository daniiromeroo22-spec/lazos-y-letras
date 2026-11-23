# 🎀 Proceso de Vibe Coding · Lazos & Letras

Registro de cómo se construyó la aplicación con una IA (Claude) como copiloto: qué se pidió, cómo se iteró, qué decisiones técnicas se tomaron y qué problemas aparecieron.

> **Cómo usar este documento:** las secciones 1–3 escriben lo que ocurrió durante la sesión de generación. 
---



---

## 1 Iteraciones realizadas con la IA

1. **Andamiaje.** Se creó el proyecto con `create-next-app` (TypeScript, Tailwind, App Router, ESLint). Se revisó lo que venía configurado antes de escribir código.
2. **Capa de datos.** `lib/openLibrary.ts` concentra tipos, `fetch` y validaciones. Las páginas y la API interna reutilizan las mismas funciones.
3. **API interna.** Dos Route Handlers (`/api/libros` y `/api/libros/[id]`) con validación de entrada y códigos HTTP correctos (400, 404, 502).
4. **Búsqueda.** `SearchBox` (Client Component) con `useState` + `useEffect`, _debounce_ de 450 ms y `AbortController` para cancelar peticiones obsoletas. Estados: inactivo, cargando, error, sin resultados, resultados.
5. **Estante.** Primero se evaluó `useState` + `useEffect` leyendo `localStorage`; se cambió a `useSyncExternalStore` para que la barra, las tarjetas y la página del estante compartan siempre el mismo dato y no haya desajustes entre servidor y navegador.
6. **Diseño.** Paleta como variables CSS (crema, rosa pétalo, frambuesa, café), tipografía serif cursiva para títulos, lazo SVG propio, borde de encaje en la barra y clases reutilizables (`.card`, `.btn`, `.chip`).
7. **Estados de carga y error.** `loading.tsx` (skeletons), `error.tsx` con reintento y `not-found.tsx`.
8. **Verificación.** `eslint` y `tsc` sin errores, `next build` exitoso y prueba de las rutas contra el servidor de producción local (200 en páginas, 404 en ruta inexistente, 400 en entradas inválidas, 502 cuando la API externa no responde).

---

## 2. Decisiones técnicas

| Decisión | Alternativa | Razón |
| --- | --- | --- |
| **Open Library** como API externa | Supabase, TMDB | Gratuita y sin clave: se puede clonar y correr sin crear cuentas. |
| **Route Handlers** como capa intermedia | Llamar a Open Library desde el navegador | Permite validar la entrada, no exponer el `User-Agent` y cambiar de proveedor sin tocar el frontend. |
| La página de detalle llama a `getBook()` **directo** | Hacer `fetch` a nuestro propio `/api/libros/[id]` | Evita un salto HTTP innecesario; Server Components pueden usar la capa de datos directamente. |
| **Desactivar `cacheComponents`** (venía activo en el scaffold) | Mantenerlo y envolver datos dinámicos en `<Suspense>` / `use cache` | Para un proyecto de aprendizaje, el modelo clásico (`loading.tsx` + `error.tsx`) es más claro y fácil de explicar. Es un cambio de una línea en `next.config.ts`. |
| **`localStorage`** para el estante | Base de datos (Supabase) | El alcance no requería cuentas. Limitación documentada en el README. |
| **`useSyncExternalStore`** para el estante | `useState` + `useEffect` | Es el hook correcto para suscribirse a una fuente externa (el almacenamiento del navegador) y compartirla entre componentes. `useState`/`useEffect` se siguen usando en la búsqueda y el menú. |
| **Validar el id** con `/^OL\d+W$/` | Confiar en la URL | Nunca se interpolan datos del usuario en una URL externa sin validarlos. |
| `next/image` con `unoptimized` para portadas | Configurar `remotePatterns` y el optimizador | Las portadas redirigen entre servidores de Open Library; cargarlas directo evita fallos del optimizador. |
| **Server Components por defecto**, Client solo donde hay interacción | Todo `"use client"` | Menos JavaScript enviado al navegador. Client: `Navbar`, `SearchBox`, `ShelfView`, `ShelfButton`. |
| Texto principal `#5A3A3F` y acentos `#9C3B58` sobre crema | Rosas más claros para el texto | Contraste suficiente para lectura (accesibilidad) sin perder la estética. |

---

## 3. Desafíos encontrados y cómo se resolvieron

1. **El proyecto base traía opciones nuevas de Next 16** (`cacheComponents`, `partialPrefetching`) y un archivo `AGENTS.md` que advierte que esta versión difiere de lo que la IA conoce. → Se leyó la documentación incluida en `node_modules/next/dist/docs/` antes de escribir código y se tomó la decisión de arriba.
2. **`error.tsx` en esta versión recibe `retry`, no `reset`** (que es lo que aparece en la mayoría de tutoriales). → Se detectó leyendo la documentación local de la versión instalada, evitando un botón «reintentar» que no habría funcionado.
3. **Parpadeo de «estante vacío»** al cargar la página, porque el servidor no tiene `localStorage`. → Se añadió `useHydrated()` y esqueletos de carga hasta que el navegador toma el control.
4. **`.gitignore` ocultaba `.env.example`** (la regla `.env*` lo incluía) y el entregable exige subirlo. → Se añadió la excepción `!.env.example`.
5. **Botón dentro de un enlace** en las tarjetas de libros (HTML inválido y problemático para teclado y lectores de pantalla). → El botón de guardar se sacó del `<Link>`.
6. **Descarga de Google Fonts durante el build en un entorno sin acceso a esa red.** → Para validar el resto del proyecto se compiló temporalmente sin tipografías remotas y se restauró el layout. En tu máquina y en Vercel, `next/font` descarga las fuentes con normalidad.
7. **Respuestas heterogéneas de la API** (`description` a veces es texto y a veces un objeto; portadas con id `-1`). → `cleanDescription()` y `buildCoverUrl()` normalizan estos casos.

### Limitación a tener en cuenta

Desde el entorno donde se generó el proyecto no hubo acceso a Open Library, así que **la integración con la API real debe probarse en tu máquina** (`npm run dev` → buscar «Jane Austen»). Lo verificado fue la validación de entradas, el manejo de errores (502 cuando la API no responde) y la compilación.

---

