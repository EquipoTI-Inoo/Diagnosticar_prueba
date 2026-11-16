/**
 * Copy y estructura de las páginas de conversión (Fase 3: §5.2–§5.7).
 * Escrito a mano, pero TODA cifra o precio se interpola desde servicios.ts / negocio.ts /
 * faqs.ts / paginas-fuente.ts (generados desde contenido.json), así no puede desincronizarse.
 * Cada fila de la comparativa indica de qué bullet del JSON sale.
 */
import { z } from "zod";
import { cobertura } from "./cobertura";
import { faqs } from "./faqs";
import { negocio } from "./negocio";
import { paginasFuente } from "./paginas-fuente";
import { CONFIRMAR, PENDIENTE, type Faq, type Servicio, type ServicioSlug } from "./schema";
import { escalera, getServicio, servicios } from "./servicios";

/* ------------------------------------------------------------------ utilidades */

const pen = (n: number) => `S/ ${n}`;
/** Primera letra en minúscula salvo siglas/marcas («PaintSCAN», «+200»). */
const lc = (t: string) => {
  const primera = t.split(/\s/)[0] ?? "";
  const sigla = /[A-ZÁÉÍÓÚÑ]/.test(primera.slice(1)); // PaintSCAN, DiagnostiCAR, SUNARP…
  return /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]/.test(t) && !sigla ? t[0]!.toLowerCase() + t.slice(1) : t;
};
const lista = (xs: string[]) =>
  xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} y ${xs[xs.length - 1]}`;
/** Devuelve el bullet tal cual existe en el servicio (falla si no existe). */
function bullet(slug: ServicioSlug, empieza: string): string {
  const s = getServicio(slug);
  const b = [...s.resumen, ...s.detalle].find((x) => x.startsWith(empieza));
  if (!b) throw new Error(`[conversion] ${slug} no tiene un bullet que empiece con «${empieza}»`);
  return b;
}
const precio = (slug: ServicioSlug) => {
  const p = getServicio(slug).precio;
  if (p.actual === null) return PENDIENTE;
  return p.antes ? `${pen(p.actual)} (antes ${pen(p.antes)})` : pen(p.actual);
};
const palabras = (t: string) => t.trim().split(/\s+/).length;

const DURACION = "entre 40 y 70 minutos"; // faqs[«¿Cuánto dura un diagnóstico?»]
const ADELANTO = `${negocio.reserva.adelantoPorcentaje} %`;

/* ------------------------------------------------------------------ comparativa (§5.2) */

export type Celda = "si" | "no" | "confirmar" | string;

/** Columnas = los 5 planes de la escalera, en orden. */
export const columnasComparativa = escalera.map((s) => s.slug);

type Fila = {
  id: string;
  caracteristica: string;
  nota?: string;
  celdas: Record<string, Celda>;
  fuente: string;
};

const ANT = ["antecedentes-basico", "antecedentes-completo"] as const;
const INSP = ["diagnostico-basico", "diagnosticar", "diagnosticar-plus"] as const;
function celdas(si: readonly string[], confirmar: readonly string[] = []): Record<string, Celda> {
  return Object.fromEntries(
    columnasComparativa.map((c) => [
      c,
      si.includes(c) ? "si" : confirmar.includes(c) ? "confirmar" : "no",
    ]),
  );
}

export const comparativa: Fila[] = [
  {
    id: "antecedentes",
    caracteristica: "Propietarios, gravámenes y papeletas",
    // AB: incluye_ficha; AC: «Incluye todo lo del básico»; DiagnostiCAR: «Reporte de antecedentes…»
    // (el JSON no dice si es básico o completo → por confirmar en DiagnostiCAR y Plus).
    celdas: celdas(ANT, ["diagnosticar", "diagnosticar-plus"]),
    fuente: "servicios[].incluye_ficha / incluye_home / incluye",
  },
  {
    id: "asientos",
    caracteristica: "Asientos registrales",
    celdas: celdas(["antecedentes-completo"], ["diagnosticar", "diagnosticar-plus"]),
    fuente: "Antecedentes Completo · incluye_home «+ asientos registrales»",
  },
  {
    id: "papeletas-nacional",
    caracteristica: "Papeletas a nivel nacional, SUTRAN y ATU",
    nota: "El Antecedentes Básico revisa papeletas de Lima y Callao.",
    celdas: celdas(["antecedentes-completo"], ["diagnosticar", "diagnosticar-plus"]),
    fuente:
      "Antecedentes Completo · incluye_home / incluye_detalle «Multas en todo el Perú, SUTRAN y ATU»",
  },
  {
    id: "boleta",
    caracteristica: "Boleta informativa SUNARP",
    celdas: celdas(["antecedentes-completo"], ["diagnosticar", "diagnosticar-plus"]),
    fuente: "Antecedentes Completo · incluye_home «+ Boleta informativa»",
  },
  {
    id: "revision",
    caracteristica: "Revisión vehicular completa (+200 puntos)",
    celdas: celdas(INSP),
    fuente:
      "Diagnóstico Básico · incluye; DiagnostiCAR «Todo lo del Básico»; Plus «Todo lo de DiagnostiCAR»",
  },
  {
    id: "escaneo",
    caracteristica: "Escaneo profesional de motor, caja, airbags y ABS",
    celdas: celdas(INSP),
    fuente: "Diagnóstico Básico · incluye",
  },
  {
    id: "electromagnetico",
    caracteristica: "Escaneo electromagnético de carrocería (choques)",
    celdas: celdas(INSP),
    fuente: "Diagnóstico Básico · incluye",
  },
  {
    id: "kilometraje",
    caracteristica: "Confirmación del kilometraje real",
    celdas: celdas(["diagnosticar", "diagnosticar-plus"]),
    fuente: "DiagnostiCAR · incluye",
  },
  {
    id: "videoscopia",
    caracteristica: "Videoscopía completa",
    celdas: celdas(["diagnosticar", "diagnosticar-plus"]),
    fuente: "DiagnostiCAR · incluye",
  },
  {
    id: "vin",
    caracteristica: "Revisión N.° VIN y motor",
    celdas: celdas(["diagnosticar", "diagnosticar-plus"]),
    fuente: "DiagnostiCAR · incluye",
  },
  {
    id: "especialista",
    caracteristica: "Reporte de especialista con fotos",
    celdas: celdas(["diagnosticar", "diagnosticar-plus"]),
    fuente:
      "DiagnostiCAR · incluye «Reporte de antecedentes + de especialista (con fotos) + de escáner»",
  },
  {
    id: "manejo",
    caracteristica: "Prueba de manejo (sujeta a T&C)",
    celdas: celdas(["diagnosticar", "diagnosticar-plus"]),
    fuente: "DiagnostiCAR · incluye «Prueba de manejo (según ficha legacy; sujeta a T&C)»",
  },
  {
    id: "laser",
    caracteristica: "Escaneo láser de frenos y llantas",
    celdas: celdas(["diagnosticar-plus"]),
    fuente: "DiagnostiCAR Plus · incluye",
  },
  {
    id: "anticlonacion",
    caracteristica: "Protección anticlonación",
    celdas: celdas(["diagnosticar-plus"]),
    fuente: "DiagnostiCAR Plus · incluye",
  },
  {
    id: "paintscan",
    caracteristica: "PaintSCAN Pro + TintSCAN Pro",
    celdas: celdas(["diagnosticar-plus"]),
    fuente: "DiagnostiCAR Plus · incluye",
  },
  {
    id: "reportes",
    caracteristica: "Qué recibes",
    celdas: {
      "antecedentes-basico": bullet("antecedentes-basico", "+20"),
      "antecedentes-completo": bullet("antecedentes-completo", "Informe de +25"),
      "diagnostico-basico": bullet("diagnostico-basico", "Reporte de escáner"),
      diagnosticar: bullet("diagnosticar", "Reportes de antecedentes"),
      "diagnosticar-plus": bullet("diagnosticar-plus", "4 reportes"),
    },
    fuente: "bullets de reporte de cada servicio",
  },
];

/* ------------------------------------------------------------------ /servicios */

const ac = getServicio("antecedentes-completo");
export const paginaServicios = {
  seo: {
    title: "Planes y precios",
    description: `Compara los 5 planes de DiagnostiCAR: antecedentes desde ${pen(escalera[0]!.precio.actual!)} e inspección a domicilio en Lima hasta ${pen(getServicio("diagnosticar-plus").precio.actual!)}. Qué revisa cada uno, lado a lado.`,
  },
  h1: "Planes y precios",
  // Resumen-respuesta (AEO) construido con los precios del JSON.
  resumen: `Revisar un auto usado antes de comprarlo en Lima cuesta desde ${pen(escalera[0]!.precio.actual!)} si solo quieres sus antecedentes, y desde ${pen(getServicio("diagnostico-basico").precio.actual!)} si además quieres una inspección técnica a domicilio. El plan más elegido es el DiagnostiCAR (${pen(getServicio("diagnosticar").precio.actual!)}). Reservas con el ${ADELANTO} del servicio y pagas el saldo al terminar.`,
  preguntaH2: "¿Cuánto cuesta revisar un auto usado antes de comprarlo en Lima?",
  tablaCaption:
    "Comparativa de los 5 planes de DiagnostiCAR: qué revisa cada uno y qué recibes. Precios en soles.",
  notas: [
    `${ac.nombre} es ${lc(ac.nota ?? "")}`.replace(/\.$/, "."),
    `Precios en soles. IGV incluido: ${PENDIENTE}.`,
    `«Por confirmar»: el JSON indica que DiagnostiCAR y Plus incluyen un reporte de antecedentes, pero no si es el básico o el completo ${CONFIRMAR}.`,
  ],
  otros: ["asesoria-precompra-online", "certifica-tu-auto"] as ServicioSlug[],
  noHacemos: {
    titulo: "Lo que NO hacemos",
    servicio: "Medición de compresión del motor",
    // T&C «Medición de compresión» (resumen fiel).
    texto:
      "No la ofrecemos: es un procedimiento invasivo que requiere intervenir el sistema de combustión, y la mayoría de propietarios no lo autoriza. Te lo decimos antes para que lo sepas al elegir.",
  },
};

/* ------------------------------------------------------------------ fichas (§5.3) */

const FAQS_POR_SERVICIO: Partial<Record<ServicioSlug, string[]>> = {
  "diagnostico-basico": [
    "donde-hacen-los-diagnosticos",
    "es-necesario-que-este-presente-en-el-diagnostico",
    "cuanto-dura-un-diagnostico",
    "cuanto-tiempo-despues-recibo-el-resultado",
    "puedo-reprogramar",
    "miden-compresion-del-motor",
  ],
  diagnosticar: [
    "donde-hacen-los-diagnosticos",
    "es-necesario-que-este-presente-en-el-diagnostico",
    "cuanto-dura-un-diagnostico",
    "cuanto-tiempo-despues-recibo-el-resultado",
    "hacen-prueba-de-manejo",
    "que-incluye-el-plus-que-no-incluye-diagnosticar",
    "puedo-reprogramar",
  ],
  "diagnosticar-plus": [
    "que-incluye-el-plus-que-no-incluye-diagnosticar",
    "donde-hacen-los-diagnosticos",
    "cuanto-dura-un-diagnostico",
    "cuanto-tiempo-despues-recibo-el-resultado",
    "hacen-prueba-de-manejo",
    "puedo-reprogramar",
  ],
};

const RESUMEN: Record<Exclude<ServicioSlug, "certifica-tu-auto">, () => string> = {
  "antecedentes-basico": () => {
    const s = getServicio("antecedentes-basico");
    return `El ${s.nombre} cuesta ${precio(s.slug)} y revisa ${lista(s.detalle.map(lc))} del auto que te interesa: lo esencial para empezar antes de avanzar con la compra. Solo necesitamos la placa del vehículo; lo pides por WhatsApp y reservas con el ${ADELANTO} del servicio.`;
  },
  "antecedentes-completo": () =>
    `El ${ac.nombre} cuesta ${precio(ac.slug)} y reúne la historia registral del auto: propietarios, cambios registrales, gravámenes, multas en todo el Perú, SUTRAN y ATU, orden de captura, siniestralidad SOAT y Boleta Informativa SUNARP, en un ${lc(bullet(ac.slug, "Informe de +25"))}. Es descontable del DiagnostiCAR o Plus.`,
  "diagnostico-basico": () => {
    const s = getServicio("diagnostico-basico");
    return `El ${s.nombre} cuesta ${precio(s.slug)} e incluye ${lista(s.resumen.slice(0, 4).map(lc))}. Vamos a donde está el auto en Lima Metropolitana; la revisión toma ${DURACION} y reservas tu cita con el ${ADELANTO} del servicio.`;
  },
  diagnosticar: () => {
    const s = getServicio("diagnosticar");
    return `El ${s.nombre} cuesta ${precio(s.slug)} y es el plan más elegido: incluye ${lista(s.resumen.slice(0, 4).map(lc))}, además de reportes de antecedentes, especialista y escáner. Vamos a donde está el auto en Lima Metropolitana y la revisión toma ${DURACION}.`;
  },
  "diagnosticar-plus": () => {
    const s = getServicio("diagnosticar-plus");
    return `El ${s.nombre} cuesta ${precio(s.slug)} y es la revisión más completa: incluye ${lista(s.resumen.map(lc))}. Vamos a donde está el auto en Lima Metropolitana y la revisión toma ${DURACION}.`;
  },
  "asesoria-precompra-online": () => {
    const s = getServicio("asesoria-precompra-online");
    return `La ${s.nombre} es una ${lc(s.resumen[0]!)} de DiagnostiCAR para resolver tus dudas, interpretar informes —incluso de terceros— y analizar tu caso específico, antes de comprar. Sirve si estás fuera de Lima o no tienes tiempo de ir a ver el auto. Precio: ${PENDIENTE}.`;
  },
};

const RECIBES: Record<Exclude<ServicioSlug, "certifica-tu-auto">, string[]> = {
  "antecedentes-basico": ["Informe de antecedentes de " + bullet("antecedentes-basico", "+20")],
  "antecedentes-completo": [
    bullet("antecedentes-completo", "Informe de +25"),
    bullet("antecedentes-completo", "Análisis y comentarios"),
    bullet("antecedentes-completo", "Boleta informativa"),
  ],
  "diagnostico-basico": [bullet("diagnostico-basico", "Reporte de escáner")],
  diagnosticar: [bullet("diagnosticar", "Reportes de antecedentes")],
  "diagnosticar-plus": [
    bullet("diagnosticar-plus", "4 reportes"),
    "Todo lo que recibes con el DiagnostiCAR",
  ],
  "asesoria-precompra-online": [
    bullet("asesoria-precompra-online", "Videollamada"),
    bullet("asesoria-precompra-online", "Resolvemos"),
  ],
};

const fichaSchema = z.object({
  slug: z.string(),
  resumen: z.string().superRefine((t, ctx) => {
    const n = palabras(t);
    if (n < 40 || n > 60)
      ctx.addIssue({
        code: "custom",
        message: `Resumen-respuesta con ${n} palabras (debe tener 40–60): «${t}»`,
      });
  }),
  recibes: z.array(z.string().min(1)).min(1),
  faqs: z.array(z.custom<Faq>()),
  relacionados: z.array(z.string()),
  /** Las fichas de inspección muestran el proceso de 4 pasos (visita a domicilio). */
  conVisita: z.boolean(),
});
export type Ficha = z.infer<typeof fichaSchema> & { servicio: Servicio };

export const fichaSlugs = servicios
  .filter((s) => s.href.startsWith("/servicios/"))
  .map((s) => s.slug as Exclude<ServicioSlug, "certifica-tu-auto">);

export const fichas: Ficha[] = fichaSlugs.map((slug) => {
  const s = getServicio(slug);
  const i = escalera.findIndex((x) => x.slug === slug);
  const relacionados =
    i >= 0
      ? [escalera[i - 1], escalera[i + 1]].filter(Boolean).map((x) => x!.slug)
      : ["diagnosticar", "antecedentes-completo"];
  const ficha = fichaSchema.parse({
    slug,
    resumen: RESUMEN[slug](),
    recibes: RECIBES[slug],
    faqs: (FAQS_POR_SERVICIO[slug] ?? []).map((id) => {
      const f = faqs.find((x) => x.id === id);
      if (!f) throw new Error(`[conversion] FAQ inexistente: ${id}`);
      return f;
    }),
    relacionados,
    conVisita: s.tipo === "inspeccion",
  });
  return { ...ficha, servicio: s };
});

export function getFicha(slug: string): Ficha | undefined {
  return fichas.find((f) => f.slug === slug);
}

export const fichaTextos = {
  programa: `Programa tu cita con el ${ADELANTO} del servicio.`,
  comoSePide: "Cómo se pide",
  pasosSinVisita: {
    // Para servicios sin visita (antecedentes, asesoría) solo aplican los pasos 01 y 02 del JSON.
    nota: `Plazo de entrega del informe: ${PENDIENTE}.`,
  },
  compararTitulo: "¿No estás seguro si es el servicio correcto?",
  compararTexto:
    "Compara todos los planes en la tabla completa y elige el nivel de detalle que necesitas antes de decidir.",
};

/* ------------------------------------------------------------------ /vende-tu-auto (§5.4) */

const cert = getServicio("certifica-tu-auto");
export const paginaVende = {
  seo: {
    title: "Vende tu auto con sello verificado",
    description:
      "Certifica tu auto con DiagnostiCAR: inspección completa, reportes y sello «Vehículo verificado» con QR único. Sin comisiones ni exclusividad.",
  },
  h1: "Vende tu auto sin comisiones.",
  sub: "Certifícalo con DiagnostiCAR, genera confianza inmediata y llega a compradores que buscan autos verificados.",
  resumen: `La certificación de DiagnostiCAR revisa tu auto a fondo —documentos, estado visual y escaneo OBD— y te entrega reportes y un sello digital «Vehículo verificado» con QR único para tu publicación. No cobramos comisión por la venta ni pedimos exclusividad: sigues usando tu auto mientras se vende. Precio: ${PENDIENTE}.`,
  precio: cert.precio,
  cifras: {
    leads: `${negocio.metricas.leadsDiarios.display} ${negocio.metricas.leadsDiarios.etiqueta}`,
    seguidores: `${negocio.metricas.seguidores.display} ${negocio.metricas.seguidores.etiqueta}`,
    marca: CONFIRMAR,
  },
  ...paginasFuente.venta,
  mensajeWhatsapp: "Hola, quiero certificar mi auto para venderlo",
};

/* ------------------------------------------------------------------ /como-funciona (§5.5) */

const tyc = paginasFuente.tyc as Record<string, readonly string[]>;
function tycContiene(seccion: string, fragmento: string) {
  const ok = (tyc[seccion] ?? []).some((p) => p.includes(fragmento));
  if (!ok) throw new Error(`[conversion] T&C «${seccion}» no contiene «${fragmento}»`);
  return seccion;
}

export const paginaComoFunciona = {
  seo: {
    title: "Cómo funciona la reserva",
    description: `Así se agenda un diagnóstico DiagnostiCAR: escribes por WhatsApp, reservas con el ${ADELANTO}, vamos a donde está el auto y recibes el reporte. Qué necesitamos y políticas.`,
  },
  h1: "Cómo funciona",
  resumen: `Escribes por WhatsApp y eliges el servicio, reservas tu cita con el ${ADELANTO} del servicio, vamos a donde está el auto en Lima Metropolitana y te entregamos el reporte apenas terminamos. La revisión toma ${DURACION}. Para agendar necesitamos el nombre y celular del comprador, la placa y la dirección.`,
  necesitamos: paginasFuente.necesitamos.map((n) => n.replace(/\.$/, "")),
  reserva: {
    titulo: `Reserva con el ${ADELANTO}`,
    texto: `La cita se reserva con el ${ADELANTO} del servicio y el saldo se paga al terminar. Con el adelanto empezamos la búsqueda de antecedentes, por eso te pedimos la placa.`,
    medios: `Medios de pago: ${negocio.reserva.mediosDePago}. Te los indica tu asesor por WhatsApp.`,
  },
  politicas: [
    {
      titulo: "Reprogramación",
      texto:
        "Puedes reprogramar con al menos 48 horas de anticipación. Una vez agendada la cita no hay reembolsos, salvo que DiagnostiCAR incumpla.",
      fuente: tycContiene("Política de devoluciones y reprogramaciones", "48 horas"),
    },
    {
      titulo: "Tolerancia",
      texto:
        "Esperamos hasta 15 minutos desde la hora pactada. Si el auto no está en el lugar, el especialista puede retirarse.",
      fuente: tycContiene("Tolerancia, constancia y alcance del servicio", "quince (15) minutos"),
    },
    {
      titulo: "Prueba de manejo",
      texto:
        "Solo si la pides y con autorización del propietario: ruta corta de máximo 20 minutos y solo si el auto cumple condiciones mínimas de seguridad.",
      fuente: tycContiene("Prueba de manejo", "veinte (20) minutos"),
    },
    {
      titulo: "Airbags",
      texto:
        "Si el escáner muestra códigos de error de airbags, no los borramos: así se conserva la trazabilidad. Si hay sospecha de emuladores, te lo advertimos.",
      fuente: tycContiene("Bolsas de aire (Airbags)", "no serán borrados ni reseteados"),
    },
    {
      titulo: "Cambio de fluidos",
      texto:
        "Después de comprar, te recomendamos cambiar todos los fluidos: aceite de motor, de caja y de diferencial, líquido de frenos y refrigerante.",
      fuente: tycContiene("Cambio de fluidos", "cambio de todos los fluidos"),
    },
    {
      titulo: "Límites del kilometraje",
      texto:
        "Nuestros escáneres detectan adulteraciones de kilometraje, pero una manipulación profesional puede no ser detectable. Te recomendamos confirmar el historial con la casa matriz.",
      fuente: tycContiene(
        "Limitación de Responsabilidad sobre la Detección de Kilometraje",
        "casa matriz",
      ),
    },
  ],
  tycHref: "/legal/terminos-y-condiciones",
};

/* ------------------------------------------------------------------ /cobertura (§5.6) */

export const paginaCobertura = {
  seo: {
    title: "Cobertura en Lima",
    description: `Vamos a domicilio en Lima Metropolitana, sin recargo en ${cobertura.sinRecargo.length} distritos: ${cobertura.sinRecargo.slice(0, 4).join(", ")} y más. Para otros distritos te decimos el costo de traslado.`,
  },
  h1: "Cobertura",
  resumen: `Hacemos el diagnóstico a domicilio, donde esté el auto, dentro de Lima Metropolitana. No cobramos recargo de traslado en estos distritos; para cualquier otro distrito te decimos el costo antes de agendar. La lista vigente está por confirmar ${CONFIRMAR}.`,
  otroDistrito: "¿Otro distrito? Escríbenos y te decimos el costo de traslado.",
  mensajeWhatsapp: "Hola, quiero saber el costo de traslado a mi distrito:",
  mapaNota: "Esquema sin escala. Solo muestra la ubicación relativa de los distritos sin recargo.",
};

/* ------------------------------------------------------------------ /informe-de-ejemplo (§5.7) */

export const paginaInforme = {
  seo: {
    title: "Informe de ejemplo",
    description:
      "Mira cómo es un informe DiagnostiCAR real: antecedentes (SOAT, papeletas, gravámenes, dueños previos) y la revisión técnica sistema por sistema. Descarga el PDF.",
  },
  h1: paginasFuente.informe.titulo,
  texto: paginasFuente.informe.texto,
  aviso: "Placa de ejemplo — los datos son ilustrativos.",
  avisoFuente: paginasFuente.informe.aviso,
  pendiente: `${PENDIENTE.slice(0, -1)}: informe actualizado] — este PDF es de 2022.`,
  pdf: { href: "/docs/Reporte-DiagnostiCAR.pdf" },
  paginasVisor: [
    {
      src: "/img/informe/informe-pagina-01.webp",
      titulo: "Página 1 · Antecedentes",
      alt: "Página 1 del informe de ejemplo: deudas tributarias, dueños previos (5), multas electorales, boleta informativa (gravámenes y títulos pendientes), papeletas de Lima y Callao y órdenes de captura, para una placa de ejemplo.",
    },
    {
      src: "/img/informe/informe-pagina-02.webp",
      titulo: "Página 2 · Puntaje por sistema",
      alt: "Página 2 del informe de ejemplo: puntaje porcentual por sistema — seguridad, frenos, interior, motor, escaneo computarizado, exterior, sistema eléctrico, aros y llantas, videoscopía, suspensión, prueba de manejo y dirección.",
    },
    {
      src: "/img/informe/informe-pagina-03.webp",
      titulo: "Página 3 · Motor y escape",
      alt: "Página 3 del informe de ejemplo: detalle de motor y escape con porcentajes por ítem (fluidos, aceite, refrigerante, líquido de frenos, soportes, filtro de aire, mangueras, escape) y observaciones del técnico.",
    },
  ],
};

/* ------------------------------------------------------------------ /contacto (§5.13, formulario de Fase 3) */

export const paginaContacto = {
  seo: {
    title: "Contacto",
    description: `Escríbenos por WhatsApp al ${negocio.whatsapp.display} o déjanos tus datos. Atendemos a domicilio en Lima Metropolitana.`,
  },
  h1: paginasFuente.contacto.titulo,
  texto: paginasFuente.contacto.texto,
  aclaracionOficina:
    "Es nuestra oficina administrativa: el diagnóstico se hace a domicilio, donde está el auto.",
};

/* ------------------------------------------------------------------ formularios */

export const formTextos = {
  placa: {
    boton: "Consultar gratis SOAT y Revisión Técnica",
    ayudaCelular: "Te respondemos por WhatsApp con el resultado.",
    exitoTitulo: "Recibimos tu consulta.",
    exitoTexto:
      "Te escribiremos por WhatsApp con el estado del SOAT y la Revisión Técnica. Si prefieres, escríbenos tú ahora:",
    errorEnvio: "No pudimos registrar tu consulta. Puedes enviarla directo por WhatsApp:",
  },
  contacto: {
    boton: "Enviar mensaje",
    exitoTitulo: "Mensaje recibido.",
    exitoTexto: "Te contactaremos pronto. Para una respuesta más rápida, escríbenos por WhatsApp:",
    errorEnvio: "No pudimos enviar tu mensaje. Puedes escribirnos directo por WhatsApp:",
  },
  errorFormulario: "Revisa los campos marcados.",
  abrirWhatsapp: "Abrir WhatsApp",
  otraConsulta: "Enviar otra consulta",
};
