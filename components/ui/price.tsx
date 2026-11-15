import type { Precio } from "@/content/schema";
import { cn, formatPEN } from "@/lib/utils";
import { Pendiente } from "./pendiente";

/** Precio en mono: anterior tachado + vigente. Si no hay precio, muestra el pendiente. */
export function Price({
  precio,
  size = "md",
  className,
}: {
  precio: Precio;
  size?: "md" | "lg";
  className?: string;
}) {
  if (precio.actual === null) {
    return (
      <p className={cn("font-mono", className)}>
        <span className="sr-only">Precio: </span>
        <Pendiente />
      </p>
    );
  }
  return (
    <p className={cn("flex items-baseline gap-2.5 font-mono font-medium", className)}>
      {precio.antes !== null && (
        <s className="text-sm text-fg-muted decoration-1">
          <span className="sr-only">Antes </span>
          {formatPEN(precio.antes)}
        </s>
      )}
      <span
        className={cn(
          "tracking-tight text-fg",
          size === "lg" ? "text-5xl" : "text-[2.25rem] leading-none",
        )}
      >
        {precio.antes !== null && <span className="sr-only">Ahora </span>}
        <span className="mr-1.5 text-[0.55em] text-fg-muted">S/</span>
        {precio.actual.toLocaleString("en-US")}
      </span>
    </p>
  );
}
