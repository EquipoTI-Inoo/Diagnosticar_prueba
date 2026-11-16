/**
 * Comprueba que TODAS las URLs antiguas de docs/fuente/contenido.json → paginas[].url responden
 * según la tabla de lib/redirecciones.ts (+ artículos del blog): 301 directo (un solo salto) al
 * destino, 410 para las eliminadas y 200 para la home. Además pide cada destino y exige 200.
 *
 *   npm run build && npm run start  (otra terminal)
 *   BASE=http://localhost:3000 npm run check:redirecciones
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ELIMINADAS, REDIRECCIONES } from "../lib/redirecciones";
import { redireccionesBlog } from "../lib/redirecciones-blog";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const fuente = JSON.parse(
  readFileSync(join(process.cwd(), "docs/fuente/contenido.json"), "utf8"),
) as {
  paginas: { url: string }[];
};

const tabla = new Map<string, { codigo: 301 | 410 | 200; destino?: string }>();
for (const x of [...REDIRECCIONES, ...redireccionesBlog()])
  tabla.set(x.origen, { codigo: 301, destino: x.destino });
for (const x of ELIMINADAS) tabla.set(x.origen, { codigo: 410 });
tabla.set("/", { codigo: 200 });

const antiguas = [...new Set(fuente.paginas.map((p) => decodeURI(new URL(p.url).pathname)))].sort();

let ok = 0;
const fallos: string[] = [];
const destinos = new Set<string>();
for (const ruta of antiguas) {
  const esperado = tabla.get(ruta);
  const res = await fetch(BASE + encodeURI(ruta), { redirect: "manual" });
  const loc = res.headers.get("location");
  const destino = loc ? new URL(loc, BASE).pathname + new URL(loc, BASE).hash : undefined;
  let bien = false;
  if (!esperado) fallos.push(`✗ ${ruta} no está en la tabla (respondió ${res.status})`);
  else if (res.status !== esperado.codigo)
    fallos.push(`✗ ${ruta} → ${res.status}${loc ? ` ${loc}` : ""} (esperado ${esperado.codigo})`);
  else if (esperado.codigo === 301 && destino !== esperado.destino)
    fallos.push(`✗ ${ruta} → 301 ${destino} (esperado ${esperado.destino})`);
  else bien = true;
  if (bien) {
    ok++;
    if (esperado?.destino) destinos.add(esperado.destino.replace(/#.*/, ""));
    console.log(`✓ ${res.status} ${ruta}${esperado?.destino ? ` → ${esperado.destino}` : ""}`);
  }
}
for (const d of destinos) {
  const res = await fetch(BASE + d, { redirect: "manual" });
  if (res.status !== 200) fallos.push(`✗ destino ${d} responde ${res.status}`);
}
// Las entradas de la tabla que no están en el JSON (variantes de la §4) también se prueban.
const extra = [...tabla.keys()].filter((k) => !antiguas.includes(k));
for (const ruta of extra) {
  const e = tabla.get(ruta)!;
  const res = await fetch(BASE + encodeURI(ruta), { redirect: "manual" });
  if (res.status !== e.codigo)
    fallos.push(`✗ (tabla, fuera del JSON) ${ruta} → ${res.status} (esperado ${e.codigo})`);
}

const c = (n: number) => antiguas.filter((r) => tabla.get(r)?.codigo === n).length;
console.log(
  `\n${ok}/${antiguas.length} URLs antiguas únicas del JSON correctas · 301: ${c(301)} · 410: ${c(410)} · 200: ${c(200)} · ${destinos.size} destinos con 200 · ${extra.length} entradas extra de la tabla probadas`,
);
if (fallos.length) {
  console.log(fallos.join("\n"));
  process.exit(1);
}
