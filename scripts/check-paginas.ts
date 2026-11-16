/**
 * Auditoría «ningún dato inventado» sobre las PÁGINAS RENDERIZADAS (requiere `npm run build`).
 * Extrae el texto visible de cada HTML estático de .next/server/app (sin <script>, <style>,
 * atributos ni JSON-LD) y comprueba que toda cifra exista en docs/fuente/contenido.json.
 *
 *   npm run build && npm run check:paginas
 *
 * Excepciones explícitas (no son datos del negocio): numeración editorial 01–15 («Paso 01»,
 * «Plan 03 / 05»), el año del © del footer, los ejemplos de formato de placa («ABC-123»), las fechas
 * en formato «16 de noviembre de 2026» (fechas de artículos —auditadas aparte contra el JSON— y
 * «Actualizado») y el número de orden de las fichas del blog (`data-num-editorial`).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = join(process.cwd(), ".next/server/app");
if (!existsSync(RAIZ)) {
  console.error("✗ No hay build: ejecuta `npm run build` primero.");
  process.exit(1);
}
const fuente = readFileSync(join(process.cwd(), "docs/fuente/contenido.json"), "utf8");
const fuenteSinComas = fuente.replace(/,/g, "");

const BLOG = join(RAIZ, "blog");
const articulosHtml = existsSync(BLOG)
  ? readdirSync(BLOG)
      .filter((f) => f.endsWith(".html"))
      .map((f) => `blog/${f}`)
  : [];

// Páginas del sitio público (Fases 2–4).
const PAGINAS = [
  "index.html",
  "servicios.html",
  "servicios/antecedentes-basico.html",
  "servicios/antecedentes-completo.html",
  "servicios/diagnostico-basico.html",
  "servicios/diagnosticar.html",
  "servicios/diagnosticar-plus.html",
  "servicios/asesoria-precompra-online.html",
  "vende-tu-auto.html",
  "como-funciona.html",
  "cobertura.html",
  "informe-de-ejemplo.html",
  "contacto.html",
  "tecnologia.html",
  "guia.html",
  "guia/checklist.html",
  "guia/problemas-comunes.html",
  "guia/consulta-placa-gratis.html",
  "blog.html",
  ...articulosHtml,
  "nosotros.html",
  "preguntas-frecuentes.html",
  "legal/terminos-y-condiciones.html",
  "legal/privacidad.html",
  "legal/cookies.html",
  "libro-de-reclamaciones.html",
];

function textoVisible(html: string): string {
  return (
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<span[^>]*data-num-editorial[^>]*>\d+<\/span>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&#160;/g, " ")
      .replace(/&[a-z#0-9]+;/gi, " ")
      // Ejemplos de formato de placa en ayudas de formulario (ABC-123, A1B-234): no son datos.
      .replace(/\b[A-Z][A-Z0-9]{2}-\d{3}\b/g, " ")
      // Fechas largas en español (artículos: auditadas contra el JSON en scripts aparte; «Actualizado»).
      .replace(/\b\d{1,2} de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre) de \d{4}\b/gi, " ")
  );
}

function existe(n: string): boolean {
  const limpio = n.replace(/,/g, "");
  if (fuente.includes(n) || fuenteSinComas.includes(limpio)) return true;
  const v = Number(limpio);
  if (Number.isInteger(v) && v >= 1 && v <= 15) return true; // numeración editorial 01–15
  if (v === new Date().getFullYear()) return true; // © del footer
  return v >= 1000 && v % 1000 === 0 && fuente.includes(`${v / 1000}k`);
}

let fallos = 0;
for (const rel of PAGINAS) {
  const ruta = join(RAIZ, rel);
  if (!existsSync(ruta) || !statSync(ruta).isFile()) {
    console.log(`✗ falta ${rel}`);
    fallos++;
    continue;
  }
  const texto = textoVisible(readFileSync(ruta, "utf8"));
  const numeros = new Set(
    (texto.match(/\d[\d.,]*\d|\d/g) ?? []).map((n) => n.replace(/[.,]$/, "")),
  );
  const faltan = [...numeros].filter((n) => !existe(n.replace(/^0+(?=\d)/, "")) && !existe(n));
  fallos += faltan.length;
  console.log(
    `${faltan.length ? "✗" : "✓"} /${relative(RAIZ, ruta)
      .replace(/index\.html$/, "")
      .replace(
        /\.html$/,
        "",
      )}: ${numeros.size} cifras${faltan.length ? ` · NO están en la fuente: ${faltan.join(", ")}` : ""}`,
  );
}
if (fallos) process.exit(1);

/* ---------- Precios idénticos: JSON ↔ Home ↔ /servicios ↔ fichas ↔ JSON-LD ---------- */
type ServJson = { nombre: string; precio: string };
const servJson = (JSON.parse(fuente) as { servicios: ServJson[] }).servicios;
const precioJson = (nombre: string) =>
  Number(servJson.find((s) => s.nombre === nombre)?.precio.match(/^S\/ (\d+)/)?.[1]);
const fichas: Record<string, string> = {
  "antecedentes-basico": "Antecedentes Básico",
  "antecedentes-completo": "Antecedentes Completo",
  "diagnostico-basico": "Diagnóstico Básico",
  diagnosticar: "DiagnostiCAR",
  "diagnosticar-plus": "DiagnostiCAR Plus",
};
const leer = (rel: string) => readFileSync(join(RAIZ, rel), "utf8");
const ld = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]!),
  );
let errPrecio = 0;
const home = textoVisible(leer("index.html"));
const servicios = textoVisible(leer("servicios.html"));
const catalogo = ld(leer("servicios.html")).find((x) => x["@type"] === "OfferCatalog");
for (const [slug, nombre] of Object.entries(fichas)) {
  const p = precioJson(nombre);
  const html = leer(`servicios/${slug}.html`);
  const servicioLd = ld(html).find((x) => x["@type"] === "Service");
  const enCatalogo = catalogo?.itemListElement?.find(
    (o: { itemOffered: { name: string } }) => o.itemOffered.name === nombre,
  );
  const checks = {
    home:
      home.includes(`S/ ${p}`) ||
      home.includes(`S/  ${p}`) ||
      new RegExp(`S/\\s*${p}\\b`).test(home),
    servicios: new RegExp(`S/\\s*${p}\\b`).test(servicios),
    ficha: new RegExp(`S/\\s*${p}\\b`).test(textoVisible(html)),
    ldServicio: servicioLd?.offers?.price === p,
    ldCatalogo: enCatalogo?.price === p,
  };
  const malos = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([k]) => k);
  errPrecio += malos.length;
  console.log(
    `${malos.length ? "✗" : "✓"} precio ${nombre} = S/ ${p}${malos.length ? ` · distinto en: ${malos.join(", ")}` : " (JSON, Home, /servicios, ficha, JSON-LD)"}`,
  );
}
if (errPrecio) process.exit(1);
