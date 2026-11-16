/**
 * Genera public/llms.txt y public/llms-full.txt (formato llmstxt.org, §8 GEO) desde content/*.
 * Se ejecuta antes de cada build (`prebuild`) para que nunca se desincronicen del sitio.
 *   npm run build:llms
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { cobertura } from "../content/cobertura";
import { fichas, paginaComoFunciona } from "../content/conversion";
import { ACTUALIZADO, paginaGuia } from "../content/educativo";
import { faqCategoriaLabel, faqs } from "../content/faqs";
import { negocio } from "../content/negocio";
import { proceso } from "../content/proceso";
import { problemas, problemasFuente } from "../content/problemas";
import { PENDIENTE } from "../content/schema";
import { servicios } from "../content/servicios";
import { articulos } from "../lib/blog";
import { neutralizar } from "../lib/entorno";

const SITIO = negocio.sitio.replace(/\/$/, "");
const u = (p: string) => `${SITIO}${p}`;
const precio = (s: (typeof servicios)[number]) =>
  s.precio.actual === null
    ? PENDIENTE
    : `S/ ${s.precio.actual}${s.precio.antes ? ` (antes S/ ${s.precio.antes})` : ""}${s.precio.porConfirmar ? " (por confirmar)" : ""}`;
const resumenFicha = (href: string) => fichas.find((f) => f.servicio.href === href)?.resumen;

const cabecera = [
  `# ${negocio.marca}`,
  "",
  `> ${negocio.marca} (${negocio.razonSocial}, RUC ${negocio.ruc}) hace diagnóstico vehicular pre-compra a domicilio en Lima Metropolitana: antecedentes legales del auto e inspección técnica con equipos profesionales. Lema: «${negocio.lema}».`,
  "",
  `Contacto: WhatsApp ${negocio.whatsapp.display} · oficina administrativa en ${negocio.direccion.calle}, ${negocio.direccion.distrito}, ${negocio.direccion.ciudad} (el servicio es a domicilio). Horario: ${negocio.horario.dias}, ${negocio.horario.horas}. Contenido actualizado el ${ACTUALIZADO.texto}.`,
  "",
];

const corto = [
  ...cabecera,
  "## Servicios y precios",
  "",
  `- [Planes y precios](${u("/servicios")}): comparativa de los planes en tabla HTML.`,
  ...servicios.map((s) => `- [${s.nombre}](${u(s.href)}): ${precio(s)}. ${s.tagline}`),
  "",
  "## Cobertura",
  "",
  `- [Cobertura en Lima](${u("/cobertura")}): sin recargo de traslado en ${cobertura.sinRecargo.join(", ")}. ${cobertura.nota}`,
  "",
  "## Cómo reservar",
  "",
  `- [Cómo funciona](${u("/como-funciona")}): ${proceso.map((p) => p.titulo).join(" → ")}. ${negocio.reserva.texto}`,
  `- [Contacto](${u("/contacto")}): WhatsApp ${negocio.whatsapp.display}.`,
  `- [Preguntas frecuentes](${u("/preguntas-frecuentes")})`,
  "",
  "## Guías",
  "",
  `- [${paginaGuia.h1}](${u("/guia")}): qué revisar del estado legal y técnico antes de comprar.`,
  `- [Checklist antes de comprar un auto usado](${u("/guia/checklist")})`,
  `- [Problemas más comunes en autos usados](${u("/guia/problemas-comunes")}): cifras de ${problemasFuente.toLowerCase()}.`,
  `- [Consulta de placa gratis](${u("/guia/consulta-placa-gratis")}): SOAT y Revisión Técnica.`,
  `- [Tecnología](${u("/tecnologia")}) · [Informe de ejemplo](${u("/informe-de-ejemplo")})`,
  "",
  "## Empresa",
  "",
  `- [Nosotros](${u("/nosotros")}) · [Términos y condiciones](${u("/legal/terminos-y-condiciones")}) · [Libro de Reclamaciones](${u("/libro-de-reclamaciones")})`,
  `- [Texto completo para modelos (llms-full.txt)](${u("/llms-full.txt")})`,
  "",
  "## Optional",
  "",
  ...articulos().map((a) => `- [${a.titulo}](${u(`/blog/${a.slug}`)}): ${a.resumen}`),
  "",
];

const completo = [
  ...cabecera,
  "## Servicios y precios",
  "",
  `Precios en soles (PEN). La cita se reserva con el ${negocio.reserva.adelantoPorcentaje} % del servicio. IGV: ${PENDIENTE}.`,
  "",
  "| Plan | Precio | Qué es |",
  "|---|---|---|",
  ...servicios.map((s) => `| [${s.nombre}](${u(s.href)}) | ${precio(s)} | ${s.tagline} |`),
  "",
  ...servicios.flatMap((s) => [
    `### ${s.nombre} — ${precio(s)}`,
    "",
    ...(resumenFicha(s.href) ? [resumenFicha(s.href)!, ""] : []),
    ...s.resumen.map((x) => `- ${x}`),
    ...(s.detalle.length ? ["", "Incluye en detalle:", "", ...s.detalle.map((x) => `- ${x}`)] : []),
    ...("nota" in s && s.nota ? ["", `Nota: ${s.nota}`] : []),
    "",
    `URL: ${u(s.href)}`,
    "",
  ]),
  "## Cobertura",
  "",
  `Vamos a donde está el auto, dentro de Lima Metropolitana. Sin recargo de traslado en: ${cobertura.sinRecargo.join(", ")}. ${cobertura.nota}`,
  "",
  "## Cómo reservar",
  "",
  ...proceso.map((p, i) => `${i + 1}. **${p.titulo}.** ${p.texto}`),
  "",
  `Para agendar necesitamos: ${paginaComoFunciona.necesitamos.join("; ")}.`,
  "",
  ...paginaComoFunciona.politicas.map((p) => `- **${p.titulo}:** ${p.texto}`),
  "",
  "## Problemas más comunes en autos usados",
  "",
  ...problemas.map(
    (p) =>
      `- Según ${problemasFuente.toLowerCase()} de ${negocio.marca}, ${p.casos} de cada ${p.base.toLocaleString("es-PE")} autos: ${p.titulo.toLowerCase()}.`,
  ),
  "",
  "## Preguntas frecuentes",
  "",
  ...(Object.keys(faqCategoriaLabel) as (keyof typeof faqCategoriaLabel)[]).flatMap((c) => {
    const lista = faqs.filter((f) => f.categoria === c);
    return lista.length
      ? [
          `### ${faqCategoriaLabel[c]}`,
          "",
          ...lista.flatMap((f) => [`**${f.pregunta}**`, "", f.respuesta, ""]),
        ]
      : [];
  }),
  "## Guía para comprar un auto usado en Perú",
  "",
  paginaGuia.resumen,
  "",
  `Más: ${u("/guia")}`,
  "",
];

// En el build de producción las marcas [PENDIENTE CLIENTE] se neutralizan como en el sitio.
const produccion = process.env.SITE_ENV === "production";
const escribir = (f: string, lineas: string[]) => {
  const texto = produccion ? neutralizar(lineas.join("\n")) : lineas.join("\n");
  writeFileSync(join(process.cwd(), "public", f), texto);
  console.log(`✓ public/${f} (${texto.length} caracteres${produccion ? ", producción" : ""})`);
};
escribir("llms.txt", corto);
escribir("llms-full.txt", completo);
