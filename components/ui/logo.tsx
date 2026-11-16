import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logo DiagnostiCAR.
 * - `on="dark"` sin `wordmark`: PNG original (su «CAR» es blanco, solo sirve sobre oscuro).
 * - `wordmark`: logotipo tipográfico provisional (Archivo) para tamaños chicos —header, footer—
 *   y para fondos claros, hasta recibir el SVG ([PENDIENTE CLIENTE]).
 */
export function Logo({
  on = "light",
  wordmark = false,
  className,
}: {
  on?: "light" | "dark";
  wordmark?: boolean;
  className?: string;
}) {
  if (on === "dark" && !wordmark) {
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
      <span className={on === "dark" ? "text-paper" : "text-ink"}>Diagnosti</span>
      <span className={on === "dark" ? "text-brand" : "text-brand-deep"}>CAR</span>
    </span>
  );
}
