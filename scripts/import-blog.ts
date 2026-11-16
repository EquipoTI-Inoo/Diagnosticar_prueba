/**
 * Migra los 21 artículos de `contenido.json → paginas[grupo=blog_articulo]` a MDX en
 * `content/blog/<slug>.mdx` (§5.10).
 *
 *   npm run import:blog
 *
 * Reglas:
 * - Texto FIEL: no se reescribe. Solo limpieza de maquetación: espacios antes de signos de
 *   puntuación, emojis en titulares, viñetas perdidas en el scrape y subtítulos cortos sin marca.
 * - Slug limpio (sin emojis ni %); fecha original de la URL; autor «Equipo DiagnostiCAR».
 * - Categoría según las páginas de categoría del sitio original.
 * - Sin imágenes: la portada es tipográfica (las del blog son generadas con IA).
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readFileSync } from "node:fs";

type Pagina = {
  slug: string;
  url: string;
  grupo: string;
  texto: string[];
  seo: { og_description?: string | null };
};
const ROOT = process.cwd();
const fuente = JSON.parse(readFileSync(join(ROOT, "docs/fuente/contenido.json"), "utf8")) as { paginas: Pagina[] };
const OUT = join(ROOT, "content/blog");

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu;
const norm = (s: string) =>
  s
    .replace(EMOJI, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function slugify(s: string): string {
  return norm(s).replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/** Limpieza de maquetación (no de redacción). */
function limpiar(l: string): string {
  return l
    .replace(/\s+([,.;:!?)»”])/g, "$1")
    .replace(/([(«“])\s+/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}
const sinEmoji = (s: string) => s.replace(EMOJI, "").replace(/\s{2,}/g, " ").trim();

// Categorías: títulos listados en /category/<x>/ del sitio original.
const CATEGORIAS: Record<string, string> = {
  category__diagnosticos: "Diagnósticos",
  "category__tip-mecanicos": "Tips mecánicos",
  category__novedades: "Novedades",
};
const tituloCategoria = new Map<string, string>();
for (const [slug, nombre] of Object.entries(CATEGORIAS)) {
  const p = fuente.paginas.find((x) => x.slug === slug);
  if (!p) throw new Error(`Falta ${slug}`);
  for (const t of p.texto.filter((l) => l.startsWith("## "))) tituloCategoria.set(norm(t.slice(3)).slice(0, 40), nombre);
}

// Servicio relacionado (enlace interno §8): por tema del artículo.
function servicioRelacionado(titulo: string): string {
  const t = norm(titulo);
  if (/antecedentes|estafas|informe/.test(t)) return "antecedentes-completo";
  if (/asesoria|primerizo|consultas virtuales|primer coche/.test(t)) return "asesoria-precompra-online";
  if (/kilometraje|esconder|prueba de manejo|herramientas|checklist|vendedor|potencia/.test(t)) return "diagnosticar";
  return "diagnostico-basico";
}

const yaml = (s: string) => JSON.stringify(s);

function cuerpo(lineas: string[]): string {
  const out: string[] = [];
  let enLista = false;
  for (const bruta of lineas) {
    const l = limpiar(bruta);
    if (!l) continue;
    let bloque: string;
    if (/^#{2,6} /.test(l)) {
      const texto = sinEmoji(l.replace(/^#{2,6} /, ""));
      // Citas marcadas como encabezado en el sitio original → blockquote.
      bloque = /^["“]/.test(texto) ? `> ${texto}` : `## ${texto}`;
      enLista = false;
    } else if (l.startsWith("- ")) {
      bloque = l;
      enLista = true;
    } else if (enLista && /^[A-ZÁÉÍÓÚÑ¿][^.:]{1,60}:\s/.test(l)) {
      // Viñeta perdida en el scrape («Estado de los neumáticos: …» tras otras viñetas).
      bloque = `- ${l}`;
    } else if (/^[“"].+[”"]\.?$/.test(l)) {
      bloque = `> ${l}`;
      enLista = false;
    } else if (l.length <= 40 && !/[.!?]$/.test(l)) {
      // Subtítulo corto sin marca en el scrape («Videoscopía Automotriz», «Presión Baja:»).
      bloque = `### ${l.replace(/:$/, "")}`;
      enLista = false;
    } else {
      bloque = l;
      enLista = false;
    }
    out.push(bloque);
  }
  // Las viñetas consecutivas van juntas; el resto, separado por línea en blanco.
  return out
    .map((b, i) => (b.startsWith("- ") && out[i - 1]?.startsWith("- ") ? `\n${b}` : `\n\n${b}`))
    .join("")
    .trim();
}

const articulos = fuente.paginas.filter((p) => p.grupo === "blog_articulo");
if (articulos.length !== 21) throw new Error(`Esperaba 21 artículos (hay ${articulos.length})`);

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT).filter((x) => x.endsWith(".mdx"))) rmSync(join(OUT, f));

const slugs = new Set<string>();
for (const a of articulos) {
  const m = a.url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/);
  if (!m) throw new Error(`URL sin fecha: ${a.url}`);
  const [, y, mo, d, original] = m;
  const titulo = sinEmoji(limpiar(a.texto[0]!.slice(3)));
  const resumen = sinEmoji(limpiar(a.texto[1]!.slice(3)));
  let slug = slugify(decodeURIComponent(original!));
  if (/^entrada-\d+$/.test(slug)) slug = slugify(titulo); // «entrada-1» no describe el artículo
  if (slugs.has(slug)) throw new Error(`Slug duplicado: ${slug}`);
  slugs.add(slug);
  const categoria = tituloCategoria.get(norm(titulo).slice(0, 40));
  if (!categoria) throw new Error(`Sin categoría: ${titulo}`);
  const mdx = `---
titulo: ${yaml(titulo)}
slug: ${yaml(slug)}
fecha: ${yaml(`${y}-${mo}-${d}`)}
categoria: ${yaml(categoria)}
resumen: ${yaml(resumen)}
autor: "Equipo DiagnostiCAR"
servicio: ${yaml(servicioRelacionado(titulo))}
urlOriginal: ${yaml(a.url)}
---

${cuerpo(a.texto.slice(2))}
`;
  writeFileSync(join(OUT, `${slug}.mdx`), mdx);
  console.log(`✓ content/blog/${slug}.mdx · ${y}-${mo}-${d} · ${categoria}`);
}
