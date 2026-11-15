import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo DiagnostiCAR.
 * - `dark`: PNG original (su «CAR» es blanco, solo funciona sobre fondo oscuro).
 * - `light`: logotipo tipográfico provisional hasta recibir el SVG ([PENDIENTE CLIENTE]).
 */
export function Logo({ on = "light", className }: { on?: "light" | "dark"; className?: string }) {
  if (on === "dark") {
    return (
      <Image
        src="/logos/logosaaa-02-2.webp"
        alt="DiagnostiCAR"
        width={1894}
        height={1074}
        sizes="160px"
        className={cn("h-12 w-auto", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-display text-2xl leading-none font-extrabold tracking-[-0.02em] [font-stretch:87.5%]",
        className,
      )}
    >
      <span className="text-ink">Diagnosti</span>
      <span className="text-brand-deep">CAR</span>
    </span>
  );
}
