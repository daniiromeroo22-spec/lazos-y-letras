import type { NextConfig } from "next";

/**
 * Configuración de Next.js.
 *
 * Decisión técnica: el proyecto base venía con `cacheComponents` y
 * `partialPrefetching` activados (son funciones nuevas de Next 16 que
 * obligan a envolver casi todo dato dinámico en <Suspense>).
 * Para este proyecto usamos el modelo clásico del App Router
 * (loading.tsx + error.tsx), que es más fácil de entender y de explicar.
 * Esto se documenta en VIBE_CODING.md como una decisión tomada.
 */
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
