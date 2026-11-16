/**
 * Verifica la metadata de las páginas RENDERIZADAS (requiere `npm run build`):
 * title ≤ 60 con el patrón «{Tema} | DiagnostiCAR Lima», description ≤ 155, ambos ÚNICOS;
 * canonical absoluto en https://diagnosticarperu.com igual a la ruta; OG/Twitter completos con
 * imagen 1200×630; un solo H1; migas visibles (salvo la home); y que el sitemap tenga
 * exactamente las páginas indexables.
 *
 *   npm run build && npm run check:seo
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = join(process.cwd(), ".next/server/app");
if (!existsSync(RAIZ)) {
  console.error("✗ No hay build: ejecuta `npm run build` primero.");
  process.exit(1);
}
const SITIO = "https://diagnosticarperu.com";
const SUFIJO = " | DiagnostiCAR Lima";

function htmls(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return htmls(p);
    return f.endsWith(".html") ? [p] : [];
  });
}
const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const meta = (html: string, attr: "name" | "property", k: string) =>
  decode(html.match(new RegExp(`<meta ${attr}="${k}" content="([^"]*)"`))?.[1] ?? "");

const paginas = htmls(RAIZ)
  .filter((p) => !/_not-found|design-system|\/404\.html|\/500\.html/.test(p))
  .sort();
const sitemap = existsSync(join(RAIZ, "sitemap.xml.body"))
  ? readFileSync(join(RAIZ, "sitemap.xml.body"), "utf8")
  : "";
const enSitemap = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!));

const titulos = new Map<string, string[]>();
const descripciones = new Map<string, string[]>();
const filas: string[] = [];
const aeo: string[] = [];
let errores = 0;

for (const archivo of paginas) {
  const ruta = "/" + relative(RAIZ, archivo).replace(/index\.html$|\.html$/g, "");
  const html = readFileSync(archivo, "utf8");
  const e: string[] = [];
  const titulo = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = meta(html, "name", "description");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
  const esperado = ruta === "/" ? `${SITIO}/` : `${SITIO}${ruta}`;
  // En la raíz, «https://dominio» y «https://dominio/» son la misma URL (Next quita la barra).
  const igual = (a: string) => a === esperado || (ruta === "/" && a === SITIO);

  if (!titulo.endsWith(SUFIJO)) e.push(`title sin «${SUFIJO.trim()}»`);
  if (titulo.length > 60) e.push(`title ${titulo.length} > 60`);
  if (!desc) e.push("sin description");
  if (desc.length > 155) e.push(`description ${desc.length} > 155`);
  if (!igual(canonical)) e.push(`canonical «${canonical}» ≠ «${esperado}»`);
  for (const k of [
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "og:type",
    "og:locale",
    "og:site_name",
  ])
    if (!meta(html, "property", k)) e.push(`sin ${k}`);
  if (!igual(meta(html, "property", "og:url"))) e.push("og:url ≠ canonical");
  if (
    meta(html, "property", "og:image:width") !== "1200" ||
    meta(html, "property", "og:image:height") !== "630"
  )
    e.push("og:image no es 1200×630");
  for (const k of ["twitter:card", "twitter:title", "twitter:image"])
    if (!meta(html, "name", k)) e.push(`sin ${k}`);
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) e.push(`${h1} H1`);
  if (ruta !== "/" && !html.includes('aria-label="Migas de pan"')) e.push("sin migas visibles");
  if (sitemap && !enSitemap.has(esperado)) e.push("no está en sitemap.xml");
  // AEO (§8): servicios y guía abren con un resumen-respuesta de 40–60 palabras bajo el H1.
  const tras = html.split(/<\/h1>/)[1] ?? "";
  const resumenAeo = decode(
    (tras.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "").replace(/<[^>]+>/g, ""),
  ).trim();
  const palabras = resumenAeo ? resumenAeo.split(/\s+/).length : 0;
  const preguntas = (
    html.match(/<h[23][^>]*>(?:(?!<\/h[23]>)[\s\S])*?\?\s*(?:<!-- -->)?<\/h[23]>/g) ?? []
  ).length;
  if (/^\/(servicios|guia)(\/|$)/.test(ruta)) {
    if (palabras < 40 || palabras > 60)
      e.push(`resumen-respuesta bajo el H1 con ${palabras} palabras (40–60)`);
    aeo.push(`${ruta}: resumen ${palabras} palabras · ${preguntas} encabezados-pregunta`);
  }

  titulos.set(titulo, [...(titulos.get(titulo) ?? []), ruta]);
  descripciones.set(desc, [...(descripciones.get(desc) ?? []), ruta]);
  errores += e.length;
  filas.push(
    `${e.length ? "✗" : "✓"} ${String(titulo.length).padStart(2)} · ${String(desc.length).padStart(3)} · ${ruta} — ${titulo}`,
  );
  for (const x of e) filas.push(`    ✗ ${x}`);
}
const dupT = [...titulos].filter(([, r]) => r.length > 1);
const dupD = [...descripciones].filter(([, r]) => r.length > 1);
for (const [t, r] of dupT) filas.push(`✗ title duplicado «${t}»: ${r.join(", ")}`);
for (const [d, r] of dupD)
  filas.push(`✗ description duplicada «${d.slice(0, 60)}…»: ${r.join(", ")}`);
const rutas = new Set(
  paginas.map((p) => {
    const r = "/" + relative(RAIZ, p).replace(/index\.html$|\.html$/g, "");
    return r === "/" ? `${SITIO}/` : `${SITIO}${r}`;
  }),
);
const sobran = [...enSitemap].filter((u) => !rutas.has(u));
for (const u of sobran) filas.push(`✗ sitemap.xml lista una URL sin página: ${u}`);
errores += dupT.length + dupD.length + sobran.length;

console.log("   T ·   D · ruta — title");
console.log(filas.join("\n"));
console.log(`\nAEO\n${aeo.join("\n")}`);
console.log(
  `\n${paginas.length} páginas · ${titulos.size} titles únicos · ${descripciones.size} descriptions únicas · sitemap: ${enSitemap.size} URLs · ${dupT.length + dupD.length} duplicados · ${errores} errores`,
);
if (errores) process.exit(1);
