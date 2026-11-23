// loading.tsx: Next lo muestra AUTOMÁTICAMENTE mientras la página
// de este segmento espera sus datos (el `await getBook()`).
// Son bloques grises que pulsan, imitando el diseño final ("skeleton").
export default function LibroLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando libro"
      className="grid animate-pulse gap-8 md:grid-cols-[260px_1fr]"
    >
      <div className="mx-auto aspect-[2/3] w-48 rounded-xl bg-petal/60 md:w-full" />
      <div className="space-y-4">
        <div className="h-12 w-3/4 rounded-xl bg-petal/60" />
        <div className="h-5 w-1/3 rounded-full bg-petal/60" />
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-petal/60" />
          <div className="h-6 w-24 rounded-full bg-petal/60" />
          <div className="h-6 w-16 rounded-full bg-petal/60" />
        </div>
        <div className="h-32 rounded-xl bg-petal/40" />
      </div>
    </div>
  );
}
