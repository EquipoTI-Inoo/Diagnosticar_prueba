import Image from "next/image";

/**
 * Logo real de DiagnostiCAR (derivados del PNG original 1894×1074; ver DECISIONES F21).
 * - `mark="full"` + `on="dark"`: original recortado al arte («CAR» blanco), para fondos oscuros.
 * - `mark="full"` + `on="light"`: mismo PNG con solo los píxeles blancos de «CAR» en ink.
 * - `mark="isotipo"`: auto + laptop, para tamaños chicos (sirve en ambos fondos; mejor en oscuro).
 * Tamaño: pasa en `className` alto Y ancho (p. ej. «h-14 w-auto»); por defecto «h-12 w-auto».
 * width/height reales en el <img> → el navegador reserva el espacio (sin CLS).
 * El SVG vectorial sigue [PENDIENTE CLIENTE].
 */
const ARCHIVOS = {
  "full-dark": { src: "/logos/diagnosticar-logo-dark.webp", ancho: 1776, alto: 940 },
  "full-light": { src: "/logos/diagnosticar-logo-light.webp", ancho: 1776, alto: 940 },
  isotipo: { src: "/logos/diagnosticar-isotipo.webp", ancho: 1153, alto: 668 },
} as const;

export function Logo({
  on = "dark",
  mark = "full",
  priority = false,
  eager = false,
  sizes = "160px",
  alt = "DiagnostiCAR",
  className,
}: {
  on?: "dark" | "light";
  mark?: "full" | "isotipo";
  priority?: boolean;
  /** Carga sin lazy-load pero sin preload (logos sobre el pliegue que no son LCP). */
  eager?: boolean;
  /** Ancho aproximado en pantalla, para que next/image elija el tamaño correcto. */
  sizes?: string;
  alt?: string;
  className?: string;
}) {
  const a = mark === "isotipo" ? ARCHIVOS.isotipo : ARCHIVOS[`full-${on}`];
  return (
    <Image
      src={a.src}
      alt={alt}
      width={a.ancho}
      height={a.alto}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : eager ? "eager" : "lazy"}
      className={className ?? "h-12 w-auto"}
    />
  );
}
