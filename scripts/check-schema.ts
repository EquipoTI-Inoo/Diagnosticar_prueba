/**
 * Valida el JSON-LD de las páginas RENDERIZADAS (requiere `npm run build`).
 *
 *   npm run build && npm run check:schema
 *
 * 1. Tipado: lib/schema.ts construye cada nodo con tipos de schema-dts (falla en `npm run typecheck`).
 * 2. Vocabulario: cada @type y propiedad existe en schema.org y la propiedad aplica al tipo
 *    (domainIncludes con herencia) y el tipo del valor encaja en su rangeIncludes. Vocabulario
 *    local en scripts/vendor/schemaorg-vocab.json (derivado del JSON-LD oficial de schema.org).
 * 3. Reglas de Google / §8: FAQPage solo con preguntas visibles; BreadcrumbList 1..n con URLs
 *    absolutas y migas visibles; Article/BlogPosting con headline ≤ 110, fechas ISO y autor;
 *    Offer con precio numérico en PEN; Service con provider → entidad global; HowTo con pasos;
 *    entidad global (AutomotiveBusiness + Organization) una vez por página, con NAP, geo,
 *    areaServed, priceRange y slogan; sin openingHours inventado; sin AggregateRating/Review;
 *    todas las URLs propias en https://diagnosticarperu.com.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = join(process.cwd(), ".next/server/app");
if (!existsSync(RAIZ)) {
  console.error("✗ No hay build: ejecuta `npm run build` primero.");
  process.exit(1);
}
const SITIO = "https://diagnosticarperu.com";
const ORG_ID = `${SITIO}/#organizacion`;
const vocab = JSON.parse(
  readFileSync(join(process.cwd(), "scripts/vendor/schemaorg-vocab.json"), "utf8"),
) as {
  clases: Record<string, string[]>;
  propiedades: Record<string, { d: string[]; r: string[] }>;
  enumeraciones: Record<string, string>;
};

type Nodo = Record<string, unknown>;
const ancestros = (t: string, acc = new Set<string>()): Set<string> => {
  if (acc.has(t)) return acc;
  acc.add(t);
  for (const p of vocab.clases[t] ?? []) ancestros(p, acc);
  return acc;
};
const tipos = (n: Nodo): string[] => {
  const t = n["@type"];
  return t === undefined ? [] : Array.isArray(t) ? (t as string[]) : [t as string];
};
const PRIMITIVOS = new Set([
  "Text",
  "URL",
  "Number",
  "Integer",
  "Float",
  "Date",
  "DateTime",
  "Time",
  "Boolean",
]);

function htmls(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return htmls(p);
    return f.endsWith(".html") ? [p] : [];
  });
}
const paginas = htmls(RAIZ).filter(
  (p) => !/_not-found|design-system|\/404\.html|\/500\.html/.test(p),
);

const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ");

let errores = 0;
let avisos = 0;
const cuenta: Record<string, number> = {};
const resumen: string[] = [];

for (const archivo of paginas.sort()) {
  const ruta = "/" + relative(RAIZ, archivo).replace(/index\.html$|\.html$/g, "");
  const html = readFileSync(archivo, "utf8");
  const texto = visible(html);
  const err: string[] = [];
  const warn: string[] = [];
  const bloques = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]!);
  const raices: Nodo[] = [];
  for (const b of bloques) {
    try {
      const v = JSON.parse(b) as Nodo | Nodo[];
      raices.push(...(Array.isArray(v) ? v : [v]));
    } catch (e) {
      err.push(`JSON-LD inválido: ${(e as Error).message}`);
    }
  }
  // Recorre todos los nodos con su ruta para validar vocabulario.
  const nodos: Nodo[] = [];
  const visitar = (n: Nodo, camino: string) => {
    const ts = tipos(n);
    if (ts.length) nodos.push(n);
    for (const t of ts) {
      if (!vocab.clases[t]) err.push(`${camino}: @type desconocido en schema.org «${t}»`);
      cuenta[t] = (cuenta[t] ?? 0) + 1;
    }
    const anc = new Set(ts.flatMap((t) => [...ancestros(t)]));
    for (const [k, v] of Object.entries(n)) {
      if (k.startsWith("@")) continue;
      const prop = vocab.propiedades[k];
      if (!prop) {
        err.push(`${camino}: propiedad desconocida «${k}»`);
        continue;
      }
      if (ts.length && !prop.d.some((d) => anc.has(d)))
        err.push(`${camino}: «${k}» no aplica a ${ts.join("+")}`);
      for (const item of Array.isArray(v) ? v : [v]) {
        if (item && typeof item === "object") {
          const o = item as Nodo;
          const ot = tipos(o);
          if (ot.length) {
            const oanc = new Set(ot.flatMap((t) => [...ancestros(t)]));
            if (!prop.r.some((r) => oanc.has(r)))
              err.push(
                `${camino}.${k}: un ${ot.join("+")} no encaja en el rango (${prop.r.join(", ")})`,
              );
          } else if (!("@id" in o)) err.push(`${camino}.${k}: objeto sin @type ni @id`);
          visitar(o, `${camino}.${k}`);
        } else if (typeof item === "string" && item.startsWith("https://schema.org/")) {
          const e = item.replace("https://schema.org/", "");
          if (!vocab.enumeraciones[e] && !vocab.clases[e])
            err.push(`${camino}.${k}: enumeración desconocida «${e}»`);
        } else if (typeof item === "string" && /^https?:\/\//.test(item)) {
          // Una URL es una referencia válida a un Thing en JSON-LD.
        } else if (
          !prop.r.some(
            (r) => PRIMITIVOS.has(r) || (vocab.clases[r] && ancestros(r).has("DataType")),
          )
        )
          warn.push(`${camino}.${k}: valor literal donde se espera ${prop.r.join("/")}`);
      }
    }
  };
  raices.forEach((r, i) => {
    if (r["@context"] !== "https://schema.org")
      err.push(`bloque ${i}: @context debe ser https://schema.org`);
    visitar(r, tipos(r).join("+") || `bloque ${i}`);
  });

  // URLs propias absolutas en el dominio.
  const urls =
    JSON.stringify(raices).match(/"(?:url|item|@id|mainEntityOfPage|image)":"([^"]+)"/g) ?? [];
  for (const u of urls) {
    const v = u.replace(/^"[^"]+":"/, "").replace(/"$/, "");
    if (!v.startsWith(SITIO)) err.push(`URL no absoluta en ${SITIO}: ${v}`);
  }
  const de = (t: string) => nodos.filter((n) => tipos(n).includes(t));

  // Entidad global.
  const orgs = raices.filter((r) => r["@id"] === ORG_ID);
  if (orgs.length !== 1) err.push(`entidad global: ${orgs.length} (debe ser 1)`);
  else {
    const o = orgs[0]!;
    for (const t of ["AutomotiveBusiness", "Organization"])
      if (!tipos(o).includes(t)) err.push(`entidad global sin @type ${t}`);
    for (const k of [
      "name",
      "legalName",
      "taxID",
      "url",
      "logo",
      "telephone",
      "address",
      "geo",
      "areaServed",
      "priceRange",
      "slogan",
      "sameAs",
    ])
      if (o[k] === undefined) err.push(`entidad global sin «${k}»`);
    if ("openingHoursSpecification" in o || "openingHours" in o)
      err.push("horario publicado: es [PENDIENTE CLIENTE]");
  }
  if (/AggregateRating|"Review"/.test(JSON.stringify(raices)))
    err.push("AggregateRating/Review propio (prohibido §8)");

  // Migas.
  const migas = de("BreadcrumbList");
  if (ruta !== "/" && migas.length !== 1) err.push(`BreadcrumbList: ${migas.length} (debe ser 1)`);
  for (const m of migas) {
    const items = m.itemListElement as Nodo[];
    items.forEach((it, i) => {
      if (it.position !== i + 1)
        err.push(`BreadcrumbList: posición ${String(it.position)} en lugar ${i + 1}`);
      if (!texto.includes(String(it.name)))
        err.push(`BreadcrumbList: miga «${String(it.name)}» no visible`);
    });
    const ultimo = items.at(-1)?.item as string | undefined;
    const esperado = ruta === "/" ? `${SITIO}/` : `${SITIO}${ruta}`;
    if (ultimo !== esperado) err.push(`BreadcrumbList: última miga ${ultimo} ≠ ${esperado}`);
  }
  // FAQ visibles.
  for (const f of de("FAQPage")) {
    const qs = f.mainEntity as Nodo[];
    if (!qs?.length) err.push("FAQPage vacía");
    for (const q of qs ?? []) {
      const a = (q.acceptedAnswer as Nodo | undefined)?.text as string | undefined;
      if (!q.name || !a) err.push("Question sin name o acceptedAnswer.text");
      if (q.name && !texto.includes(String(q.name)))
        err.push(`FAQ no visible: «${String(q.name)}»`);
      if (a && !texto.includes(a.slice(0, 60)))
        err.push(`Respuesta FAQ no visible: «${a.slice(0, 40)}…»`);
    }
  }
  // Artículos.
  for (const a of [...de("Article"), ...de("BlogPosting")]) {
    if (!a.headline || String(a.headline).length > 110)
      err.push("Article: headline ausente o > 110");
    for (const k of ["datePublished", "dateModified"])
      if (!/^\d{4}-\d{2}-\d{2}/.test(String(a[k] ?? ""))) err.push(`Article: ${k} no ISO`);
    if (!(a.author as Nodo | undefined)?.name) err.push("Article: author sin name");
    if (!a.image) warn.push("Article: sin image (recomendado por Google)");
  }
  // Ofertas y servicios.
  for (const o of de("Offer")) {
    if (o.price !== undefined && (typeof o.price !== "number" || o.priceCurrency !== "PEN"))
      err.push(`Offer: price ${String(o.price)} ${String(o.priceCurrency)}`);
  }
  for (const s of de("Service")) {
    if ((s.provider as Nodo | undefined)?.["@id"] !== ORG_ID)
      err.push(`Service ${String(s.name)}: provider no apunta a la entidad global`);
    if (!s.areaServed) err.push(`Service ${String(s.name)}: sin areaServed`);
  }
  for (const h of de("HowTo"))
    if (!(h.step as Nodo[] | undefined)?.length) err.push("HowTo sin pasos");

  errores += err.length;
  avisos += warn.length;
  const tiposPagina = [...new Set(raices.flatMap((r) => tipos(r)))].join(", ");
  resumen.push(
    `${err.length ? "✗" : "✓"} ${ruta} — ${bloques.length} bloques: ${tiposPagina}${warn.length ? ` · ${warn.length} aviso(s)` : ""}`,
  );
  for (const e of err) resumen.push(`    ✗ ${e}`);
  for (const w of [...new Set(warn)]) resumen.push(`    · ${w}`);
}
console.log(resumen.join("\n"));
console.log(
  `\n${paginas.length} páginas · ${errores} errores · ${avisos} avisos · nodos: ${Object.entries(
    cuenta,
  )
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `${t} ${n}`)
    .join(", ")}`,
);
if (errores) process.exit(1);
