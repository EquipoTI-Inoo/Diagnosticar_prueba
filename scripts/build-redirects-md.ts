/**
 * Genera docs/REDIRECTS.md desde lib/redirecciones.ts + artículos del blog.
 *   npm run docs:redirects
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ELIMINADAS, REDIRECCIONES } from "../lib/redirecciones";
import { redireccionesBlog } from "../lib/redirecciones-blog";

const fuente = JSON.parse(
  readFileSync(join(process.cwd(), "docs/fuente/contenido.json"), "utf8"),
) as {
  paginas: { url: string }[];
};
const enJson = new Set(fuente.paginas.map((p) => decodeURI(new URL(p.url).pathname)));
const marca = (o: string) => (enJson.has(o) ? "sí" : "no (§4)");
const fila = (c: string[]) => `| ${c.join(" | ")} |`;

const blog = redireccionesBlog();
const md = [
  "# Redirecciones del sitio actual al nuevo",
  "",
  "Generado con `npm run docs:redirects` desde `lib/redirecciones.ts` y el frontmatter `urlOriginal` de `content/blog/*.mdx`. No editar a mano.",
  "",
  "- **301** en `next.config.ts` (`redirects()`), registradas con y sin barra final: cada URL antigua responde con **un solo salto** al destino.",
  "- **410 Gone** en `middleware.ts`, con página mínima y `X-Robots-Tag: noindex`.",
  "- Cualquier otra ruta con barra final recibe un 301 a la misma ruta sin barra (`skipTrailingSlashRedirect` + middleware). Por eso `/servicios/`, `/nosotros/`, etc., responden con 301 y no con el 308 por defecto de Next.",
  "- Verificación: `BASE=http://localhost:3000 npm run check:redirecciones` contra `next start`. Prueba **todas** las URLs únicas de `contenido.json → paginas[].url` y que cada destino responda 200.",
  "",
  `Totales: ${REDIRECCIONES.length + blog.length} redirecciones 301 (${blog.length} de artículos) · ${ELIMINADAS.length} rutas 410 · la home \`/\` responde 200.`,
  "",
  "## 301 · Páginas",
  "",
  fila(["Origen (sitio actual)", "Destino", "Motivo", "¿En contenido.json?"]),
  fila(["---", "---", "---", "---"]),
  ...REDIRECCIONES.map((x) =>
    fila([`\`${x.origen}\``, `\`${x.destino}\``, x.motivo, marca(x.origen)]),
  ),
  "",
  "## 301 · Artículos del blog (/AAAA/MM/DD/slug/ → /blog/slug sin emojis)",
  "",
  fila(["Origen", "Destino"]),
  fila(["---", "---"]),
  ...blog.map((x) => fila([`\`${x.origen}\``, `\`${x.destino}\``])),
  "",
  "## 410 · Eliminadas",
  "",
  fila(["Origen", "Motivo"]),
  fila(["---", "---"]),
  ...ELIMINADAS.map((x) => fila([`\`${x.origen}\``, x.motivo])),
  "",
  "## Decisiones a confirmar con el cliente",
  "",
  "- Área de usuarios de WordPress (`/login/`, `/register/`, `/mis-reportes/`, `/panel-tecnico/`…): **410**. Si los clientes descargan informes ahí, hay que definir dónde quedará esa función antes de publicar.",
  "- Landings de campaña (`/campana/`, `/landing-campana/`, `/landing-pre-compra/`, `/revision-pre-compra-boost/`): **301 a `/servicios`**, por si algún anuncio antiguo sigue enlazándolas.",
  "- `/gracias-revision-antecedentes/`: 301 a la ficha de Antecedentes Completo. Si se usaba como conversión en Ads o Meta, hay que reconfigurarla con los eventos nuevos.",
  "",
].join("\n");
writeFileSync(join(process.cwd(), "docs/REDIRECTS.md"), md);
console.log(
  `✓ docs/REDIRECTS.md (${REDIRECCIONES.length + blog.length} × 301, ${ELIMINADAS.length} × 410)`,
);
