import type { Muestra } from "@/lib/contrast";
import { tokens, type Token } from "@/lib/tokens";

/**
 * Muestra de una combinación de color tal como se usa de verdad:
 * - `texto`: «Aa» en el color de primer plano (solo para pares que cumplen 4.5:1).
 * - `foco`: anillo de 2 px; `borde`: borde de input; `celda`: celdas de medidor;
 * - `franja`: swatch neutro para combinaciones prohibidas (sin texto en el color que falla).
 * Las muestras gráficas son aria-hidden: el rótulo legible va al lado, en ink sobre blanco.
 */
export function ContrastSample({
  fg,
  bg,
  muestra,
}: {
  fg: Token;
  bg: Token;
  muestra: Muestra | "franja";
}) {
  const c = tokens[fg];
  const caja = "grid h-10 w-16 shrink-0 place-items-center rounded-sm";
  const fondo = { background: tokens[bg], boxShadow: `inset 0 0 0 1px ${tokens.line}` };
  let interior: React.ReactNode = null;
  if (muestra === "texto")
    interior = (
      <span className="font-display text-xl font-extrabold" style={{ color: c }}>
        Aa
      </span>
    );
  if (muestra === "foco")
    interior = (
      <span
        className="h-4 w-9 rounded-pill"
        style={{ outline: `2px solid ${c}`, outlineOffset: 2, background: tokens[bg] }}
      />
    );
  if (muestra === "borde")
    interior = <span className="h-5 w-11 rounded-[3px]" style={{ border: `1.5px solid ${c}` }} />;
  if (muestra === "celda")
    interior = (
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2.5 w-3 rounded-[2px]" style={{ background: c }} />
        ))}
      </span>
    );
  if (muestra === "franja")
    interior = <span className="h-3 w-10 rounded-[2px]" style={{ background: c }} />;

  return (
    <span className="flex items-center gap-3">
      {/* La muestra «texto» sí cumple 4.5:1, así que puede exponerse; el resto es decorativo. */}
      <span className={caja} style={fondo} aria-hidden={muestra !== "texto" ? true : undefined}>
        {interior}
      </span>
      <span className="font-mono text-xs text-ink">
        {fg} / {bg}
      </span>
    </span>
  );
}
