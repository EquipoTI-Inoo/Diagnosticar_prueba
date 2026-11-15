import { cn } from "@/lib/utils";

/** Sección con superficie clara u oscura (ritmo alterno) y padding vertical fluido. */
export function Section({
  surface = "light",
  grid = false,
  id,
  className,
  children,
  ...rest
}: {
  surface?: "light" | "dark";
  /** Cuadrícula sutil de hoja de inspección. */
  grid?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      id={id}
      className={cn(
        surface === "dark" ? "surface-dark" : "surface-light",
        grid && "bg-inspeccion",
        "py-(--spacing-section)",
        className,
      )}
      {...rest}
    >
      <div className="container-site">{children}</div>
    </section>
  );
}
