import { cn } from "@/lib/utils";

/** Muestra un componente en superficie clara y oscura, lado a lado. */
export function Specimen({
  children,
  dark,
  className,
  stack = false,
}: {
  children: React.ReactNode;
  /** Contenido alternativo para la versión oscura (por defecto, el mismo). */
  dark?: React.ReactNode;
  className?: string;
  /** Apila claro/oscuro en vez de ponerlos lado a lado (para componentes anchos). */
  stack?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-card border border-line",
        !stack && "xl:grid-cols-2",
      )}
    >
      {(["light", "dark"] as const).map((s) => (
        <div
          key={s}
          className={cn(
            s === "dark" ? "surface-dark" : "surface-light",
            "relative p-6 sm:p-8",
            className,
          )}
        >
          <p className="mb-5 font-mono text-[0.65rem] tracking-[0.14em] text-fg-muted uppercase">
            {s === "dark" ? "Oscuro · ink" : "Claro · paper"}
          </p>
          {s === "dark" && dark !== undefined ? dark : children}
        </div>
      ))}
    </div>
  );
}

export function DsSection({
  id,
  numero,
  titulo,
  descripcion,
  children,
}: {
  id: string;
  numero: string;
  titulo: string;
  descripcion?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="scroll-mt-8 border-t border-line pt-12 pb-16"
    >
      <p className="font-mono text-sm text-brand-deep">{numero}</p>
      <h2 id={`${id}-h`} className="mt-1 text-[2rem] leading-tight tracking-[-0.02em]">
        {titulo}
      </h2>
      {descripcion && <div className="mt-3 max-w-[70ch] text-muted">{descripcion}</div>}
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  );
}
