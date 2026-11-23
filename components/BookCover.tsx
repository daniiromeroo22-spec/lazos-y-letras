import Image from "next/image";
import { Bow } from "./Bow";

type BookCoverProps = {
  title: string;
  url: string | null;
  className?: string;
};

// Portada de libro con "plan B": si no hay imagen, mostramos un lacito.
export function BookCover({ title, url, className = "" }: BookCoverProps) {
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-xl border-2 border-petal bg-blush shadow-sm ${className}`}
    >
      {url ? (
        <Image
          src={url}
          alt={`Portada de ${title}`}
          fill
          sizes="(min-width: 640px) 220px, 45vw"
          // "unoptimized": el navegador pide la imagen directo a Open Library
          // (su servidor de portadas ya las entrega optimizadas y redirige).
          unoptimized
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center text-berry">
          <Bow className="h-8 w-12 text-rose" />
          <span className="font-display text-base italic">Sin portada</span>
        </div>
      )}
    </div>
  );
}
