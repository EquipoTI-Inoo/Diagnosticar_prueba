import { Star } from "lucide-react";
import type { Testimonio } from "@/content/schema";
import { cn } from "@/lib/utils";

/** Tarjeta de reseña: estrellas, cita literal, nombre y fuente. */
export function ReviewCard({
  testimonio,
  className,
}: {
  testimonio: Testimonio;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-card border border-border bg-card p-6",
        className,
      )}
    >
      <div className="flex gap-0.5 text-accent" role="img" aria-label="5 de 5 estrellas">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} aria-hidden className="size-4 fill-current" strokeWidth={0} />
        ))}
      </div>
      <blockquote className="mt-4 flex-1">
        <p>«{testimonio.texto}»</p>
      </blockquote>
      <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
        <span className="font-medium">{testimonio.autor ?? "Cliente de DiagnostiCAR"}</span>
        <span className="font-mono text-xs text-fg-muted uppercase">
          {testimonio.fuente === "google" ? "Reseña en Google" : "Sitio anterior"}
        </span>
      </figcaption>
    </figure>
  );
}
