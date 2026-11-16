/**
 * Artículos del blog: archivos MDX en content/blog (generados por scripts/import-blog.ts).
 * Se leen en build (solo servidor). El cuerpo usa un subconjunto de Markdown/MDX —encabezados,
 * listas, citas y párrafos—, así que se renderiza con un parser propio en lugar de añadir
 * @next/mdx o next-mdx-remote (regla «nada de dependencias innecesarias»).
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const DIR = join(process.cwd(), "content/blog");

export const CATEGORIAS = ["Diagnósticos", "Tips mecánicos", "Novedades"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

const metaSchema = z.object({
  titulo: z.string().min(5),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  categoria: z.enum(CATEGORIAS),
  resumen: z.string().min(10),
  autor: z.string(),
  servicio: z.string(),
  urlOriginal: z.url(),
});
export type MetaArticulo = z.infer<typeof metaSchema>;

export type Bloque =
  | { tipo: "h2" | "h3" | "p" | "cita"; texto: string }
  | { tipo: "lista"; items: string[] };

export type Articulo = MetaArticulo & { bloques: Bloque[]; palabras: number };

function frontmatter(src: string): { meta: Record<string, string>; cuerpo: string } {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("MDX sin frontmatter");
  const meta: Record<string, string> = {};
  for (const linea of m[1]!.split("\n")) {
    const kv = linea.match(/^(\w+):\s*(.+)$/);
    if (kv) meta[kv[1]!] = JSON.parse(kv[2]!) as string;
  }
  return { meta, cuerpo: m[2]! };
}

export function parsearCuerpo(cuerpo: string): Bloque[] {
  const bloques: Bloque[] = [];
  for (const parrafo of cuerpo.trim().split(/\n{2,}/)) {
    const lineas = parrafo.split("\n");
    if (lineas.every((l) => l.startsWith("- "))) bloques.push({ tipo: "lista", items: lineas.map((l) => l.slice(2)) });
    else if (parrafo.startsWith("### ")) bloques.push({ tipo: "h3", texto: parrafo.slice(4) });
    else if (parrafo.startsWith("## ")) bloques.push({ tipo: "h2", texto: parrafo.slice(3) });
    else if (parrafo.startsWith("> ")) bloques.push({ tipo: "cita", texto: parrafo.slice(2) });
    else bloques.push({ tipo: "p", texto: parrafo });
  }
  return bloques;
}

let cache: Articulo[] | null = null;

/** Todos los artículos, del más reciente al más antiguo. */
export function articulos(): Articulo[] {
  if (cache) return cache;
  cache = readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { meta, cuerpo } = frontmatter(readFileSync(join(DIR, f), "utf8"));
      const m = metaSchema.parse(meta);
      if (`${m.slug}.mdx` !== f) throw new Error(`El slug de ${f} no coincide con el archivo`);
      return { ...m, bloques: parsearCuerpo(cuerpo), palabras: cuerpo.split(/\s+/).length };
    })
    .sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : a.titulo.localeCompare(b.titulo)));
  return cache;
}

export function articulo(slug: string): Articulo | undefined {
  return articulos().find((a) => a.slug === slug);
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m! - 1]} de ${y}`;
}
