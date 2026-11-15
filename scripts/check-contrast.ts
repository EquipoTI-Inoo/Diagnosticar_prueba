/**
 * Verifica el contraste WCAG 2.2 de las combinaciones de tokens que usa el sistema de diseño.
 *
 *   npm run check:contrast            → tabla en consola
 *   npm run check:contrast -- --md    → tabla Markdown (se pega en docs/DECISIONES.md)
 *
 * Sale con código 1 si alguna combinación no cumple su mínimo o si globals.css
 * no coincide con lib/tokens.ts.
 */
import { readFileSync } from "node:fs";
import { PARES, PROHIBIDOS, ratio } from "../lib/contrast";
import { tokens } from "../lib/tokens";

const md = process.argv.includes("--md");
let fallos = 0;
const filas = PARES.map((p) => {
  const r = ratio(tokens[p.fg], tokens[p.bg]);
  const ok = r >= p.minimo;
  if (!ok) fallos++;
  return { ...p, r, ok };
});

if (md) {
  console.log("| Uso | Primer plano | Fondo | Ratio | Mínimo | Resultado |");
  console.log("|---|---|---|---|---|---|");
  for (const f of filas) {
    console.log(
      `| ${f.uso} | \`${f.fg}\` ${tokens[f.fg]} | \`${f.bg}\` ${tokens[f.bg]} | ${f.r.toFixed(2)}:1 | ${f.minimo}:1 | ${f.ok ? "✅ Cumple" : "❌ No cumple"} |`,
    );
  }
  console.log("\n**Combinaciones prohibidas** (no cumplen AA para texto):\n");
  console.log("| Combinación | Ratio | Regla |");
  console.log("|---|---|---|");
  for (const p of PROHIBIDOS) {
    console.log(
      `| \`${p.fg}\` sobre \`${p.bg}\` | ${ratio(tokens[p.fg], tokens[p.bg]).toFixed(2)}:1 | ${p.uso} |`,
    );
  }
} else {
  for (const f of filas) {
    console.log(
      `${f.ok ? "✓" : "✗"} ${f.r.toFixed(2).padStart(5)}:1 (mín ${f.minimo}) ${f.fg} / ${f.bg} — ${f.uso}`,
    );
  }
  console.log("\nProhibidos:");
  for (const p of PROHIBIDOS) {
    console.log(
      `  ${ratio(tokens[p.fg], tokens[p.bg]).toFixed(2).padStart(5)}:1 ${p.fg} / ${p.bg} — ${p.uso}`,
    );
  }
}

// Sincronía con app/globals.css
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
for (const [nombre, hex] of Object.entries(tokens)) {
  const m = css.match(new RegExp(`--color-${nombre}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m || m[1]!.toUpperCase() !== hex.toUpperCase()) {
    console.error(`✗ --color-${nombre} en globals.css no coincide con lib/tokens.ts (${hex})`);
    process.exit(1);
  }
}
if (!md) console.log("\n✓ globals.css sincronizado con lib/tokens.ts");

if (fallos) {
  console.error(`\n${fallos} combinación(es) no cumplen.`);
  process.exit(1);
}
