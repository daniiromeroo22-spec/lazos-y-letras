// 🎀 El lacito, dibujado como SVG (gráfico vectorial: nunca se pixela).
// Usa "currentColor": toma el color del texto donde lo pongas,
// por ejemplo <Bow className="text-rose" />.

type BowProps = {
  className?: string;
  /** Si lo pasas, el lazo se anuncia a lectores de pantalla; si no, es decorativo. */
  title?: string;
};

export function Bow({ className = "", title }: BowProps) {
  return (
    <svg
      viewBox="0 0 64 44"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      {/* Colitas del lazo */}
      <path
        d="M30 24 C26 33 22 38 17 42 L25 40 L29 35 Z"
        fill="currentColor"
        opacity=".8"
      />
      <path
        d="M34 24 C38 33 42 38 47 42 L39 40 L35 35 Z"
        fill="currentColor"
        opacity=".8"
      />
      {/* Los dos lazos grandes */}
      <path
        d="M32 21 C22 4 3 5 4 20 C5 35 22 37 32 21Z"
        fill="currentColor"
        opacity=".9"
      />
      <path
        d="M32 21 C42 4 61 5 60 20 C59 35 42 37 32 21Z"
        fill="currentColor"
        opacity=".9"
      />
      {/* Brillitos */}
      <path
        d="M26 20 C20 12 11 12 10 19"
        stroke="#fff"
        strokeOpacity=".55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M38 20 C44 12 53 12 54 19"
        stroke="#fff"
        strokeOpacity=".55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* El nudo central */}
      <ellipse cx="32" cy="22" rx="5.5" ry="6.5" fill="currentColor" />
      <ellipse
        cx="32"
        cy="22"
        rx="5.5"
        ry="6.5"
        stroke="#fff"
        strokeOpacity=".5"
        strokeWidth="1.2"
      />
    </svg>
  );
}
