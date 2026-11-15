/**
 * Auditoría «ningún dato inventado»: toda cifra que aparece en /content debe existir
 * en docs/fuente/contenido.json (se ignoran rutas y dimensiones de imágenes).
 *
 *   npm run check:datos
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const fuente = readFileSync(join(process.cwd(), "docs/fuente/contenido.json"), "utf8");
const fuenteSinComas = fuente.replace(/,/g, "");

function existe(n: string): boolean {
  if (fuente.includes(n) || fuenteSinComas.includes(n.replace(/,/g, ""))) return true;
  const v = Number(n.replace(/,/g, ""));
  return v >= 1000 && v % 1000 === 0 && fuente.includes(`${v / 1000}k`); // 100000 ↔ «100k»
}

let fallos = 0;
for (const archivo of readdirSync("content").filter(
  (f) => f.endsWith(".ts") && f !== "schema.ts",
)) {
  const lineas = readFileSync(join("content", archivo), "utf8").split("\n");
  const numeros = new Set<string>();
  for (const l of lineas) {
    if (/^\s*(ancho|alto):/.test(l) || /^\s*(\/\/|\*|\/\*)/.test(l)) continue;
    for (const s of l.match(/"(?:[^"\\]|\\.)*"/g) ?? []) {
      if (s.startsWith('"/')) continue;
      for (const n of s.match(/\d[\d.,]*\d|\d/g) ?? []) numeros.add(n.replace(/[.,]$/, ""));
    }
    const lit = l.match(/^\s*\w+:\s*(-?\d[\d.]*),?\s*$/);
    if (lit) numeros.add(lit[1]!.replace(/^-/, ""));
  }
  const faltan = [...numeros].filter((n) => !existe(n));
  if (faltan.length) fallos += faltan.length;
  console.log(
    `${faltan.length ? "✗" : "✓"} content/${archivo}: ${numeros.size} cifras${faltan.length ? ` · NO están en la fuente: ${faltan.join(", ")}` : ""}`,
  );
}
if (fallos) process.exit(1);
