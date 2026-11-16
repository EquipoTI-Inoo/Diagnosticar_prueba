/**
 * 301 de los artículos de WordPress (/AAAA/MM/DD/slug/) a /blog/slug, desde el frontmatter
 * `urlOriginal` de content/blog/*.mdx. Solo Node (usa fs): lo usan next.config.ts y los scripts.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Redireccion } from "./redirecciones";

export function redireccionesBlog(raiz = process.cwd()): Redireccion[] {
  const dir = join(raiz, "content/blog");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((f) => {
      const src = readFileSync(join(dir, f), "utf8");
      const campo = (k: string) => src.match(new RegExp(`^${k}: "(.*)"$`, "m"))?.[1] ?? "";
      const origen = new URL(campo("urlOriginal")).pathname; // ya viene codificado (%E2%9C%85…)
      return {
        origen: decodeURI(origen),
        destino: `/blog/${campo("slug")}`,
        motivo: "Artículo del blog",
      };
    });
}
