// Pantalla de carga global: se muestra al navegar entre rutas
// mientras la nueva página se prepara.
export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className="flex animate-pulse flex-col items-center gap-4 py-20"
    >
      <div className="h-12 w-20 rounded-full bg-petal/70" />
      <div className="h-6 w-48 rounded-full bg-petal/60" />
    </div>
  );
}
