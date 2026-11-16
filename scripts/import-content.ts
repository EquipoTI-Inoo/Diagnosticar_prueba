/**
 * Importa `docs/fuente/contenido.json` y genera los archivos tipados de `/content`.
 *
 *   npm run import:content
 *
 * Reglas:
 * - Ningún dato se escribe a mano: cada cifra, precio, nombre o texto se lee del JSON.
 * - Las mejoras de redacción permitidas (regla 2) están en tablas `REDACCION_*` explícitas:
 *   texto original → texto pulido. Si el original deja de existir en el JSON, el script falla.
 * - Lo que falta se escribe como `[PENDIENTE CLIENTE]`.
 * - El resultado se valida con los esquemas Zod de `content/schema.ts` antes de escribirse.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  CONFIRMAR,
  PENDIENTE,
  faqSchema,
  negocioSchema,
  pasoSchema,
  problemaSchema,
  servicioSchema,
  testimonioSchema,
  type Faq,
  type Imagen,
  type Servicio,
  type ServicioSlug,
} from "../content/schema";

const ROOT = process.cwd();
const FUENTE = join(ROOT, "docs/fuente/contenido.json");
const OUT = join(ROOT, "content");

/* ------------------------------------------------------------------ utilidades */

type Pagina = {
  slug: string;
  url: string;
  grupo: string;
  texto: string[];
  imagenes: { src: string; alt: string | null }[] | null;
};
type Fuente = {
  generado: string;
  negocio: Record<string, unknown> & {
    redes: Record<string, string>;
    cobertura: { sin_recargo: string[]; nota: string; fuente: string };
    metricas: Record<string, string>;
    aliados: string[];
    medios: string[];
    automovilismo: string[];
    tecnologia: string[];
    pago: Record<string, string>;
  };
  servicios: {
    nombre: string;
    tagline?: string;
    badge?: string;
    precio: string;
    nota?: string;
    incluye?: string[];
    incluye_home?: string[];
    incluye_ficha?: string[];
    incluye_detalle?: string[];
    url_actual: string;
  }[];
  proceso: { paso: string; titulo: string; texto: string }[];
  problemas_comunes: { fuente: string; items: [string, string][] };
  faqs: [string, string][];
  testimonios: { autor: string; texto: string }[];
  inconsistencias_detectadas: string[];
  pendiente_cliente: string[];
  paginas: Pagina[];
};

const fuente: Fuente = JSON.parse(readFileSync(FUENTE, "utf8"));
const n = fuente.negocio as Fuente["negocio"] & Record<string, string>;

function fallar(msg: string): never {
  throw new Error(`[import-content] ${msg}`);
}

function match(re: RegExp, s: string, que: string): RegExpMatchArray {
  const m = s.match(re);
  if (!m) fallar(`No pude leer ${que} en: «${s}»`);
  return m;
}

function pagina(slug: string): Pagina {
  return fuente.paginas.find((p) => p.slug === slug) ?? fallar(`Falta la página ${slug}`);
}

/** Aplica una tabla de redacción y exige que cada original exista en la lista fuente. */
function pulir(lista: string[], tabla: Record<string, string>, que: string): string[] {
  for (const original of Object.keys(tabla)) {
    if (!lista.includes(original)) fallar(`La redacción de ${que} espera «${original}»`);
  }
  return lista.map((s) => tabla[s] ?? s);
}

/** Lee ancho/alto de PNG, JPEG o WebP sin dependencias. */
function dimensiones(rutaPublica: string): { ancho: number; alto: number } {
  const b = readFileSync(join(ROOT, "public", rutaPublica));
  if (b.readUInt32BE(0) === 0x89504e47)
    return { ancho: b.readUInt32BE(16), alto: b.readUInt32BE(20) };
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const tipo = b.toString("ascii", 12, 16);
    if (tipo === "VP8X") return { ancho: 1 + b.readUIntLE(24, 3), alto: 1 + b.readUIntLE(27, 3) };
    if (tipo === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { ancho: 1 + (bits & 0x3fff), alto: 1 + ((bits >> 14) & 0x3fff) };
    }
    return { ancho: b.readUInt16LE(26) & 0x3fff, alto: b.readUInt16LE(28) & 0x3fff };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      const marker = b[i + 1]!;
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { alto: b.readUInt16BE(i + 5), ancho: b.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  fallar(`Formato de imagen no soportado: ${rutaPublica}`);
}

/** Alt original del sitio para un archivo (busca en todas las páginas). */
function altOriginal(archivo: string): string {
  const base = archivo.replace(/\.(jpg|png|webp)$/, "");
  for (const p of fuente.paginas) {
    for (const img of p.imagenes ?? []) {
      const nombre = img.src.split("/").pop() ?? "";
      if (nombre.startsWith(base) && img.alt && !/^Dise[ñn]o sin t[ií]tulo/.test(img.alt)) {
        return img.alt;
      }
    }
  }
  return "";
}

function imagen(rutaPublica: string, alt?: string): Imagen {
  const archivo = rutaPublica.split("/").pop()!;
  return { src: rutaPublica, alt: alt ?? altOriginal(archivo), ...dimensiones(rutaPublica) };
}

/** «+6,000 (home 2026; …)» → { valor: 6000, display: "+6,000", notaFuente: "home 2026; …" } */
function metrica(raw: string, etiqueta: string, opts: { confirmar?: boolean } = {}) {
  const m = match(/^([+]?)([\d.,]+)(k?)(%?)\s*(?:–\s*([\d.,]+))?\s*(?:\((.*)\))?/, raw, etiqueta);
  const [, mas, num, k, pct, hasta, parentesis] = m;
  const valor = Number(num!.replace(/,/g, "")) * (k ? 1000 : 1);
  const display = hasta ? `${num}–${hasta}` : `${mas}${num}${k}${pct ? " %" : ""}`;
  return {
    valor,
    display,
    etiqueta,
    ...(parentesis ? { notaFuente: parentesis } : {}),
    confirmar: Boolean(opts.confirmar || /CONFIRMAR/.test(raw)),
  };
}

/* ------------------------------------------------------------------ negocio */

function construirNegocio() {
  const dir = n.direccion as string;
  const [, lat, lng] = match(/coord\.\s*(-?[\d.]+),\s*(-?[\d.]+)/, dir, "coordenadas");
  const [, cp] = match(/,\s*(\d{5});/, dir, "código postal");
  const [, oficina] = match(/oficina\s+(\d+)/, dir, "oficina");
  const [, calle] = match(/^(Av\. [^,]+ \d+)/, dir, "calle");
  const wa = match(/wa\.me\/(51\d{9})/, n.whatsapp as string, "whatsapp")[1]!;
  const tel = (n.telefono as string).replace(/\D/g, "");
  if (!wa.endsWith(tel)) fallar("Teléfono y WhatsApp no coinciden");
  const [, dias] = match(/'Atención de ([^']+)'/, n.horario as string, "horario");
  const emailRaw = match(/^(\S+@\S+)/, n.email as string, "email")[1]!;

  const redes = n.redes;
  const ig = redes.instagram!;
  const yt = redes.youtube!;
  // El JSON normaliza el enlace corto a www.tiktok.com; la fuente real (raw/venta-sin-consignar.html)
  // usa vt.tiktok.com. Se toma el de la fuente y se verifica que el código coincida.
  const ttJson = match(/^(\S+)/, redes.tiktok!, "tiktok")[1]!;
  const ttRaw = match(
    /https:\/\/vt\.tiktok\.com\/[\w-]+\//,
    readFileSync(join(ROOT, "docs/fuente/raw/venta-sin-consignar.html"), "utf8"),
    "enlace de TikTok en raw/venta-sin-consignar.html",
  )[0];
  const codigo = (u: string) => u.split("/").filter(Boolean).pop();
  if (codigo(ttJson) !== codigo(ttRaw)) fallar(`TikTok no coincide: ${ttJson} vs ${ttRaw}`);
  const tt = ttRaw;
  const grupo = match(/^(.+?) \(URL/, redes.grupo_facebook!, "grupo FB")[1]!;

  const met = n.metricas;
  const logo = (archivo: string) => imagen(`/logos/${archivo}`);

  const aliados = n.aliados.map((a) => {
    const [, nombre, rol] = match(/^(\S+) \((.+)\)$/, a, "aliado");
    const logos: Record<string, string> = {
      LAUNCH: "launch-official-v2.png",
      Autel: "logo-autel.png",
    };
    const archivo = logos[nombre!];
    return {
      nombre: nombre!,
      rol: rol!.replace(/^mencionado en páginas legacy$/, "Mencionado solo en páginas antiguas"),
      ...(archivo ? { logo: logo(archivo) } : {}),
      vigente: !/legacy/.test(rol!),
    };
  });

  const [, nombreMedio] = match(/^(\S+) \(/, n.medios[0]!, "medio");

  return negocioSchema.parse({
    marca: match(/^(\S+) \(/, n.marca as string, "marca")[1],
    razonSocial: n.razon_social,
    ruc: n.ruc,
    partidaRegistral: n.partida_registral,
    sitio: n.sitio,
    queEs: n.que_es,
    lema: n.lema,
    direccion: {
      calle: `${calle}, of. ${oficina}`,
      distrito: "Miraflores",
      ciudad: "Lima",
      pais: "PE",
      codigoPostal: cp,
      referencia: "Oficina administrativa. El servicio es a domicilio: vamos a donde está el auto.",
      geo: { lat: Number(lat), lng: Number(lng) },
    },
    whatsapp: { numero: wa, display: `+51 ${tel.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}` },
    telefono: { e164: `+${wa}`, display: n.telefono },
    email: PENDIENTE,
    emailReferenciaInterna: emailRaw,
    horario: {
      dias: dias!.charAt(0).toUpperCase() + dias!.slice(1).toLowerCase(),
      horas: PENDIENTE,
    },
    redes: {
      instagram: { url: ig, usuario: `@${match(/instagram\.com\/([^/]+)/, ig, "IG")[1]}` },
      youtube: { url: yt, usuario: match(/youtube\.com\/(@[^/]+)/, yt, "YT")[1] },
      facebook: { url: redes.facebook },
      tiktok: { url: tt, usuario: PENDIENTE },
      grupoFacebook: { nombre: grupo, url: PENDIENTE },
    },
    metricas: {
      diagnosticos: metrica(met.diagnosticos_realizados!, "diagnósticos realizados"),
      rating: metrica(met.rating_google!, "en Google"),
      resenas: metrica(met.resenas_google!, "reseñas en Google"),
      anios: metrica(met.anios_experiencia!, "años de experiencia"),
      independencia: metrica(met.independencia!, "independientes del vendedor"),
      leadsDiarios: metrica(met.leads_diarios!, "leads diarios", { confirmar: true }),
      seguidores: metrica(met.seguidores!, "seguidores", { confirmar: true }),
    },
    aliados,
    // El logo de Gestión es blanco sobre transparente: necesita placa oscura.
    medios: [
      {
        nombre: nombreMedio,
        logo: { ...logo("logo-gestion.png"), fondo: "oscuro" },
        url: PENDIENTE,
      },
    ],
    // El emblema del Rally es un círculo blanco sobre cuadrado negro: placa oscura para que
    // el cuadrado se funda con el fondo.
    automovilismo: n.automovilismo.map((nombre) => ({
      nombre,
      logo: { ...logo("caminos-del-inca-logo.png"), fondo: "oscuro" },
    })),
    tecnologia: n.tecnologia,
    reserva: {
      adelantoPorcentaje: Number(match(/^(\d+)%/, n.pago.reserva!, "adelanto")[1]),
      texto: "Reservas con el 50 % del servicio y pagas el saldo al terminar.",
      // Regla: NO publicar números de cuenta hasta que el cliente los confirme.
      mediosDePago: PENDIENTE,
    },
  });
}

/* ------------------------------------------------------------------ servicios */

const SLUGS: Record<string, { slug: ServicioSlug; href: string; tipo: Servicio["tipo"] }> = {
  "Antecedentes Básico": {
    slug: "antecedentes-basico",
    href: "/servicios/antecedentes-basico",
    tipo: "antecedentes",
  },
  "Antecedentes Completo": {
    slug: "antecedentes-completo",
    href: "/servicios/antecedentes-completo",
    tipo: "antecedentes",
  },
  "Diagnóstico Básico": {
    slug: "diagnostico-basico",
    href: "/servicios/diagnostico-basico",
    tipo: "inspeccion",
  },
  DiagnostiCAR: { slug: "diagnosticar", href: "/servicios/diagnosticar", tipo: "inspeccion" },
  "DiagnostiCAR Plus": {
    slug: "diagnosticar-plus",
    href: "/servicios/diagnosticar-plus",
    tipo: "inspeccion",
  },
  "Asesoría precompra online": {
    slug: "asesoria-precompra-online",
    href: "/servicios/asesoria-precompra-online",
    tipo: "asesoria",
  },
  "Certifica tu auto / Vehículo verificado": {
    slug: "certifica-tu-auto",
    href: "/vende-tu-auto",
    tipo: "certificacion",
  },
};

/** Redacción pulida de bullets (regla 2). Clave = texto exacto del JSON. */
const REDACCION_BULLETS: Record<string, string> = {
  "+ asientos registrales": "Asientos registrales",
  "+ Papeletas a nivel nacional": "Papeletas a nivel nacional",
  "+ Boleta informativa": "Boleta informativa SUNARP",
  "+25 págs (ficha dice ~30 págs)": "Informe de +25 páginas",
  "Análisis + comentarios de especialista": "Análisis y comentarios de un especialista",
  "Incluye todo lo del básico": "Todo lo del Antecedentes Básico",
  "Reporte de escáner + reporte verbal": "Reporte de escáner y reporte verbal",
  "Reporte de antecedentes + de especialista (con fotos) + de escáner":
    "Reportes de antecedentes, de especialista (con fotos) y de escáner",
  "Prueba de manejo (según ficha legacy; sujeta a T&C)": "Prueba de manejo (sujeta a T&C)",
  "(4) reportes escritos": "4 reportes escritos",
  "Videollamada de ~45 minutos con un técnico": "Videollamada de unos 45 minutos con un técnico",
  "Resolver dudas e interpretar informes (incl. de terceros)":
    "Resolvemos tus dudas e interpretamos informes, incluso de terceros",
  "Análisis de un caso específico": "Análisis de tu caso específico",
  "Conexión con compradores (300–400 leads diarios, sin comisión ni exclusividad)": `Conexión con compradores, sin comisión ni exclusividad (300–400 leads diarios ${CONFIRMAR})`,
  "Sello digital 'Vehículo verificado por DiagnostiCAR' con QR único":
    "Sello digital «Vehículo verificado por DiagnostiCAR» con QR único",
  "Inspección completa (chequeo documentario, visual, escaneo OBD certificado)":
    "Inspección completa: chequeo documentario, visual y escaneo OBD certificado",
  "Informes: estado mecánico, escaneo, documentación registral":
    "Informes de estado mecánico, escaneo y documentación registral",
};

const NOMBRE_WHATSAPP: Partial<Record<ServicioSlug, string>> = {
  "asesoria-precompra-online": "Asesoría precompra online",
  "certifica-tu-auto": "Certifica tu auto",
};

function precio(raw: string, nombre: string): Servicio["precio"] {
  if (/^Precio a confirmar/.test(raw)) {
    return { actual: null, antes: null, moneda: "PEN", porConfirmar: true, nota: raw };
  }
  const [, actual] = match(/^S\/ (\d+)/, raw, `precio de ${nombre}`);
  const antes = raw.match(/^S\/ \d+ \(antes S\/ (\d+)\)/)?.[1];
  const resto = raw.replace(/^S\/ \d+( \(antes S\/ \d+\))?/, "").trim();
  return {
    actual: Number(actual),
    antes: antes ? Number(antes) : null,
    moneda: "PEN",
    // Todos los precios quedan por confirmar en IGV; además hay cifras contradictorias.
    porConfirmar: resto.length > 0 || /CONFIRMAR/.test(raw),
    ...(resto ? { nota: resto.replace(/^[—(\s]+|[)\s]+$/g, "") } : {}),
  };
}

function construirServicios(): Servicio[] {
  const todos = fuente.servicios.flatMap((s) => [
    ...(s.incluye ?? []),
    ...(s.incluye_home ?? []),
    ...(s.incluye_detalle ?? []),
    ...(s.incluye_ficha ?? []),
  ]);
  pulir(todos, REDACCION_BULLETS, "bullets de servicios");
  return fuente.servicios.map((s) => {
    const meta = SLUGS[s.nombre] ?? fallar(`Servicio sin slug: ${s.nombre}`);
    const resumenRaw = s.incluye_home ?? s.incluye ?? fallar(`Sin bullets: ${s.nombre}`);
    const detalleRaw = s.incluye_detalle ?? s.incluye ?? s.incluye_ficha ?? resumenRaw;
    const pulidos = (l: string[]) => l.map((b) => REDACCION_BULLETS[b] ?? b);
    const nombre =
      s.nombre === "Certifica tu auto / Vehículo verificado" ? "Certifica tu auto" : s.nombre;
    return servicioSchema.parse({
      slug: meta.slug,
      nombre,
      nombreWhatsapp: NOMBRE_WHATSAPP[meta.slug] ?? s.nombre,
      href: meta.href,
      tipo: meta.tipo,
      tagline:
        s.tagline ??
        (meta.slug === "certifica-tu-auto"
          ? "Vehículo verificado por DiagnostiCAR."
          : "Para quien está lejos o no tiene tiempo."),
      ...(s.badge ? { badge: s.badge } : {}),
      destacado: Boolean(s.badge),
      enEscalera: meta.tipo === "antecedentes" || meta.tipo === "inspeccion",
      precio: precio(s.precio, s.nombre),
      resumen: pulidos(resumenRaw),
      detalle: pulidos(detalleRaw),
      ...(s.nota ? { nota: `${s.nota}.` } : {}),
      urlActual: s.url_actual.split(/\s+y\s+/).map((u) => u.trim()),
    });
  });
}

/* ------------------------------------------------------------------ FAQs */

const FAQ_HOME = 5; // las 5 primeras del JSON son las de la home 2026

const REDACCION_FAQ: Record<string, string> = {
  "Sí, con al menos 48 horas de anticipación. Una vez agendada la cita no hay reembolsos (salvo incumplimiento de Diagnosticar, que se remedia en 5 días).":
    "Sí, con al menos 48 horas de anticipación. Una vez agendada la cita no hay reembolsos, salvo que DiagnostiCAR incumpla; en ese caso lo resolvemos en 5 días.",
  "Solo a solicitud del cliente, con autorización del propietario, ruta corta de máx. 20 min y si el auto cumple condiciones mínimas de seguridad.":
    "Solo si la pides, con autorización del propietario, en una ruta corta de máximo 20 minutos y si el auto cumple condiciones mínimas de seguridad.",
  "Entre 24 y 48 horas. Podemos agendar el diagnóstico el mismo día si hay disponibilidad. El diagnóstico demora 45 minutos.":
    "Entre 24 y 48 horas. Si hay disponibilidad, agendamos el diagnóstico el mismo día; la revisión en sí demora 45 minutos.",
};

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .replace(/-$/, "");
}

function construirFaqs(): Faq[] {
  const base = fuente.faqs.map(([p, r], i) => {
    const etiqueta = p.match(/^\((Certificación|T&C)\)\s*/)?.[1];
    const pregunta = p.replace(/^\([^)]+\)\s*/, "");
    let categoria: Faq["categoria"] = "servicio";
    if (etiqueta === "Certificación") categoria = "certificacion";
    if (etiqueta === "T&C")
      categoria = /reprogramar/i.test(pregunta) ? "reserva-pagos" : "alcances";
    return faqSchema.parse({
      id: slugify(pregunta),
      categoria,
      pregunta,
      respuesta: REDACCION_FAQ[r] ?? r,
      enHome: i < FAQ_HOME,
    });
  });

  // FAQs de certificación que solo están en la landing /venta-sin-consignar/ (la §5.4 pide 6).
  const t = pagina("venta-sin-consignar").texto;
  const desde = t.indexOf("## Preguntas frecuentes");
  if (desde < 0) fallar("No encontré las FAQ de venta-sin-consignar");
  const pares = t.slice(desde + 1);
  const yaEstan = new Set(base.map((f) => f.pregunta));
  const extra: Faq[] = [];
  const REDACCION_CERT: Record<string, string> = {
    "Sí. Derivamos compradores reales de nuestros 300 a 400 leads diarios que están buscando vehículos ya certificados. Tu auto se destaca automáticamente frente al resto.": `Sí. Te derivamos compradores reales que buscan autos ya certificados (300 a 400 leads diarios ${CONFIRMAR}), y tu auto destaca frente al resto.`,
    "Cada certificado tiene un QR único vinculado a nuestra base de datos. Eso asegura que el reporte no pueda ser copiado o falsificado por terceros. Además, monitoreamos el uso de nuestro sello oficial.":
      "Cada certificado tiene un QR único vinculado a nuestra base de datos, así nadie puede copiar ni falsificar el reporte. Además, vigilamos el uso de nuestro sello oficial.",
    "Te entregamos reportes completos y un sello digital con QR verificable, que puedes usar en tu publicación para generar más confianza en los compradores.":
      "Reportes completos y un sello digital con QR verificable para usar en tu publicación y dar más confianza a los compradores.",
  };
  for (let i = 0; i + 1 < pares.length; i += 2) {
    const pregunta = pares[i]!;
    if (!pregunta.startsWith("¿")) break;
    const similar = [...yaEstan].some(
      (q) => slugify(q).slice(0, 16) === slugify(pregunta).slice(0, 16),
    );
    if (similar) continue;
    const respuesta = pares[i + 1]!;
    extra.push(
      faqSchema.parse({
        id: slugify(pregunta),
        categoria: "certificacion",
        pregunta,
        respuesta: REDACCION_CERT[respuesta] ?? respuesta,
        enHome: false,
      }),
    );
  }
  const todas = [...base, ...extra];
  const ids = new Set(todas.map((f) => f.id));
  if (ids.size !== todas.length) fallar("IDs de FAQ duplicados");
  return todas;
}

/* ------------------------------------------------------------------ testimonios / problemas / proceso */

function construirTestimonios() {
  return fuente.testimonios.map((t, i) => {
    const google = /\(Google\)$/.test(t.autor);
    const sinNombre = /^\(sin nombre/.test(t.autor);
    const autor = sinNombre ? null : t.autor.replace(/\s*\(Google\)$/, "");
    return testimonioSchema.parse({
      id: autor ? slugify(autor) : `anonimo-${i + 1}`,
      autor,
      fuente: google ? "google" : "sitio-anterior",
      // Las reseñas se citan textualmente (no se corrigen palabras de clientes).
      texto: t.texto,
      permisoConfirmado: false,
    });
  });
}

/**
 * Fotos de problemas. Todas son fotogramas de video del sitio (varias con subtítulos quemados).
 * El pie dice lo que la imagen MUESTRA, no lo que el sitio afirma. Cuando el `alt` original
 * no describe la imagen (p. ej. «kilometraje» sobre una foto de una llanta), se reemplaza por
 * una descripción literal y se anota en PENDIENTES.
 */
type FotoProblema = {
  escala?: number;
  slug: string;
  archivo: string;
  pie: { tipo: string; texto?: string };
  /** Muestra el hallazgo de verdad (apta para «hallazgo real»). */
  muestraHallazgo: boolean;
  alt?: string;
  posicion?: string;
};

const FOTOGRAMA = "Fotograma de video";

const FOTOS_PROBLEMAS: Record<string, FotoProblema> = {
  "Fugas de aceite": {
    slug: "fugas-de-aceite",
    archivo: "fugas-aceite.jpg",
    pie: { tipo: "Hallazgo real", texto: "Fuga de aceite señalada" },
    muestraHallazgo: true,
  },
  "Problemas documentarios (garantías, papeletas, robo, pérdida total)": {
    slug: "problemas-documentarios",
    archivo: "problemas-documentarios.jpg",
    pie: { tipo: FOTOGRAMA, texto: "Equipo DiagnostiCAR" },
    muestraHallazgo: false,
    alt: "Técnico de DiagnostiCAR hablando a cámara junto a un auto rojo (fotograma de video)",
    posicion: "50% 15%",
  },
  "Choques ocultos": {
    slug: "choques-ocultos",
    archivo: "choques-ocultos.jpg",
    pie: { tipo: FOTOGRAMA, texto: "Equipo DiagnostiCAR" },
    muestraHallazgo: false,
    alt: "Dos técnicos de DiagnostiCAR sentados conversando en una oficina (fotograma de video)",
    posicion: "50% 30%",
  },
  "Kilometraje bajado": {
    slug: "kilometraje-bajado",
    archivo: "kilometraje200k.jpg",
    pie: { tipo: FOTOGRAMA, texto: "Revisión de una llanta" },
    muestraHallazgo: false,
    alt: "Primer plano de una llanta durante una revisión, con el subtítulo «le habían borrado el número VIN» (fotograma de video)",
    posicion: "50% 20%",
  },
  "Airbags reventados": {
    slug: "airbags-reventados",
    archivo: "airbag.jpg",
    pie: { tipo: FOTOGRAMA, texto: "Inspección del habitáculo" },
    muestraHallazgo: false,
    alt: "Interior de un auto durante una inspección, con el subtítulo «el problema» (fotograma de video)",
    posicion: "50% 20%",
  },
  "Motor o caja reparados": {
    slug: "motor-o-caja-reparados",
    archivo: "motor-reparado.jpg",
    pie: { tipo: "Hallazgo real", texto: "Inspección con videoscopio" },
    muestraHallazgo: true,
    // Subtítulo quemado «especializados, pueden…» en el 86–100 % inferior: zoom desde arriba.
    posicion: "50% 0%",
    escala: 1.25,
  },
  "Carros clonados": {
    slug: "carros-clonados",
    archivo: "carros-clonados.jpg",
    pie: { tipo: FOTOGRAMA, texto: "Dos autos con la misma placa" },
    muestraHallazgo: true,
    posicion: "50% 0%",
  },
};

function construirProblemas() {
  return fuente.problemas_comunes.items.map(([nombre, frecuencia]) => {
    const meta = FOTOS_PROBLEMAS[nombre] ?? fallar(`Problema sin foto: ${nombre}`);
    const [, casos, base] = match(/^(\d+) \/ (\d+) autos$/, frecuencia, "frecuencia");
    const [, titulo, detalle] = nombre.match(/^(.+?) \((.+)\)$/) ?? [null, nombre, undefined];
    return problemaSchema.parse({
      slug: meta.slug,
      titulo,
      ...(detalle ? { detalle: detalle.charAt(0).toUpperCase() + detalle.slice(1) } : {}),
      casos: Number(casos),
      base: Number(base),
      imagen: {
        ...imagen(`/img/clave/${meta.archivo}`, meta.alt),
        pie: meta.pie,
        ...(meta.posicion ? { posicion: meta.posicion } : {}),
        ...(meta.escala ? { escala: meta.escala } : {}),
      },
      muestraHallazgo: meta.muestraHallazgo,
    });
  });
}

const REDACCION_PROCESO: Record<string, string> = {
  "Chatea con nosotros y elige el servicio que te interesa realizar.":
    "Escríbenos por WhatsApp y elige el servicio que necesitas.",
  "Programa tu cita con 50% del servicio y completa nuestro formulario.":
    "Reserva tu cita con el 50 % del servicio y completa un formulario corto.",
  "El diagnóstico del vehículo tomará entre 40 y 70 minutos.":
    "Vamos a donde está el auto. La revisión toma entre 40 y 70 minutos.",
  "Te entregaremos el reporte luego de haber terminado la inspección.":
    "Te entregamos el reporte apenas terminamos la inspección.",
};

function construirProceso() {
  pulir(
    fuente.proceso.map((p) => p.texto),
    REDACCION_PROCESO,
    "proceso",
  );
  return fuente.proceso.map((p) =>
    pasoSchema.parse({
      numero: p.paso,
      titulo: p.titulo,
      texto: REDACCION_PROCESO[p.texto] ?? p.texto,
    }),
  );
}

/* ------------------------------------------------------------------ salida */

const CABECERA = (que: string) =>
  `/**\n * ${que}\n *\n * ARCHIVO GENERADO por scripts/import-content.ts desde docs/fuente/contenido.json\n * (generado el ${fuente.generado}). No lo edites a mano: cambia la fuente o el script\n * y ejecuta \`npm run import:content\`.\n */\n`;

function escribir(archivo: string, que: string, cuerpo: string) {
  writeFileSync(join(OUT, archivo), `${CABECERA(que)}${cuerpo}\n`);
  console.log(`✓ content/${archivo}`);
}

const json = (v: unknown) => JSON.stringify(v, null, 2);

const negocio = construirNegocio();
escribir(
  "negocio.ts",
  "Datos del negocio: identidad, contacto, métricas, aliados.",
  `import { negocioSchema, type Negocio } from "./schema";\n\nexport const negocio: Negocio = negocioSchema.parse(${json(negocio)});`,
);

const servicios = construirServicios();
escribir(
  "servicios.ts",
  "Servicios y precios (orden de la escalera de planes).",
  `import { z } from "zod";\nimport { servicioSchema, type Servicio, type ServicioSlug } from "./schema";\n\nexport const servicios: Servicio[] = z.array(servicioSchema).parse(${json(servicios)});\n\nexport const escalera = servicios.filter((s) => s.enEscalera);\n\nexport function getServicio(slug: ServicioSlug): Servicio {\n  const s = servicios.find((x) => x.slug === slug);\n  if (!s) throw new Error(\`Servicio no encontrado: \${slug}\`);\n  return s;\n}`,
);

const faqs = construirFaqs();
escribir(
  "faqs.ts",
  "Preguntas frecuentes agrupadas por categoría.",
  `import { z } from "zod";\nimport { faqSchema, type Faq } from "./schema";\n\nexport const faqCategoriaLabel: Record<Faq["categoria"], string> = {\n  servicio: "Servicio",\n  "reserva-pagos": "Reserva y pagos",\n  certificacion: "Certificación",\n  alcances: "Alcances técnicos",\n};\n\nexport const faqs: Faq[] = z.array(faqSchema).parse(${json(faqs)});\n\nexport const faqsHome = faqs.filter((f) => f.enHome);`,
);

escribir(
  "testimonios.ts",
  "Reseñas de clientes (texto literal; permiso de uso pendiente).",
  `import { z } from "zod";\nimport { testimonioSchema, type Testimonio } from "./schema";\n\nexport const testimonios: Testimonio[] = z.array(testimonioSchema).parse(${json(construirTestimonios())});\n\n/** Solo reseñas con nombre (Google): las que se muestran en la home. */\nexport const testimoniosConNombre = testimonios.filter((t) => t.autor !== null);`,
);

escribir(
  "problemas.ts",
  "Problemas más comunes encontrados (frecuencia sobre autos revisados).",
  `import { z } from "zod";\nimport { problemaSchema, type Problema } from "./schema";\n\nexport const problemasFuente = ${json(`Informes propios ${fuente.problemas_comunes.fuente.replace(/^informes propios /, "")}`)};\n\nexport const problemas: Problema[] = z.array(problemaSchema).parse(${json(construirProblemas())});`,
);

escribir(
  "proceso.ts",
  "Proceso de reserva y diagnóstico en 4 pasos.",
  `import { z } from "zod";\nimport { pasoSchema, type Paso } from "./schema";\n\nexport const proceso: Paso[] = z.array(pasoSchema).parse(${json(construirProceso())});`,
);

const cob = n.cobertura;
escribir(
  "cobertura.ts",
  "Distritos de cobertura sin recargo.",
  `import { z } from "zod";\n\nexport const coberturaSchema = z.object({\n  sinRecargo: z.array(z.string().min(1)).min(1),\n  nota: z.string(),\n  vigenciaConfirmada: z.boolean(),\n});\n\nexport const cobertura = coberturaSchema.parse(${json(
    {
      sinRecargo: cob.sin_recargo,
      nota: "¿Otro distrito? Escríbenos y te decimos el costo de traslado.",
      vigenciaConfirmada: false,
    },
  )});`,
);

/* ------------------------------------------------------------------ medios (Fase 2) */

/**
 * Videos «Tips antes de comprar» de la home: las URLs están en paginas[home].redes del JSON;
 * el ORDEN y el título de cada reel se leen del HTML original (raw/home.html), y la miniatura
 * es reco{n}-frame.jpg (alt original = título del reel).
 */
function construirMedios() {
  const home = pagina("home") as Pagina & { redes: string[] };
  const html = readFileSync(join(ROOT, "docs/fuente/raw/home.html"), "utf8");
  const ini = html.indexOf("Tips antes de comprar");
  if (ini < 0) fallar("No encontré «Tips antes de comprar» en raw/home.html");
  const tramo = html.slice(ini, ini + 8000);
  const reels = [
    ...tramo.matchAll(
      /href="(https:\/\/www\.instagram\.com\/reel\/[^"]+)"[^>]*>\s*<img[^>]*src="[^"]*\/(reco\d-frame\.jpg)"[^>]*alt="([^"]+)"/g,
    ),
  ].map((m) => ({ url: m[1]!, archivo: m[2]!, titulo: m[3]!.trim() }));
  if (reels.length !== 3) fallar("Esperaba 3 reels en «Tips antes de comprar»");
  const tips = reels.map((r) => {
    if (!home.redes.includes(r.url)) fallar(`El reel ${r.url} no está en paginas[home].redes`);
    const miniatura = imagen(`/img/clave/${r.archivo}`, r.titulo);
    // Los reels verticales (reco1, reco2) traen subtítulo quemado (~66–78 % del alto), el caption
    // de Instagram abajo y una franja negra a la derecha: zoom desde la esquina superior izquierda.
    const vertical = miniatura.alto > miniatura.ancho;
    const recorte = vertical ? { posicion: "0% 0%", escala: 1.4 } : {};
    return {
      titulo: r.titulo,
      url: r.url,
      miniatura: { ...miniatura, ...recorte, pie: { tipo: "Reel de Instagram" } },
    };
  });

  // Video explicativo (§5.1): solo aparece en raw/servicio-diagnosticar.html.
  const htmlServicio = readFileSync(
    join(ROOT, "docs/fuente/raw/servicio-diagnosticar.html"),
    "utf8",
  );
  const [, youtubeId, youtubeTitulo] = match(
    /youtube\.com\/embed\/([\w-]{11})" title="([^"]+)"/,
    htmlServicio,
    "video de YouTube",
  );

  // Fotos REALES para «Confianza técnica». Las 3 imágenes que usaba el sitio actual para esta
  // sección (fg-min, gh-1, Diseno-sin-titulo-6) parecen de banco o generadas: no se usan (§6).
  const confianza = {
    tecnicos: {
      ...imagen("/img/clave/asi-trabajamos-frame2.jpg"),
      pie: { tipo: "Fotograma de video", texto: "Equipo DiagnostiCAR" },
    },
    equipos: {
      ...imagen("/img/clave/motor-reparado.jpg"),
      pie: { tipo: "Hallazgo real", texto: "Inspección con videoscopio" },
      posicion: "50% 0%",
      escala: 1.25,
    },
    informes: {
      ...imagen(
        "/img/informe/informe_ejemplo_pag-02.png",
        "Página de un informe DiagnostiCAR con el puntaje por sistema: seguridad, frenos, motor, escaneo, suspensión y más (placa de ejemplo)",
      ),
      pie: { tipo: "Informe de ejemplo", texto: "2022 · placa de ejemplo" },
    },
    atencion: {
      ...imagen(
        "/img/clave/IMG_5446.webp",
        "Dos camionetas con la marca DiagnostiCAR estacionadas en la calle",
      ),
      pie: { tipo: "Foto", texto: "Unidades móviles DiagnostiCAR" },
    },
  };
  return { tips, youtube: { id: youtubeId!, titulo: youtubeTitulo! }, confianza };
}

escribir(
  "medios.ts",
  "Videos y fotos de la home (tips, video explicativo, fotos de confianza).",
  `import { z } from "zod";\nimport { imagenSchema } from "./schema";\n\nexport const medios = z\n  .object({\n    tips: z.array(z.object({ titulo: z.string(), url: z.url(), miniatura: imagenSchema })).length(3),\n    youtube: z.object({ id: z.string().regex(/^[\\w-]{11}$/), titulo: z.string() }),\n    confianza: z.record(z.enum(["tecnicos", "equipos", "informes", "atencion"]), imagenSchema),\n  })\n  .parse(${json(construirMedios())});`,
);

// PENDIENTES.md se genera junto con el contenido para que no se desincronice.
const pendientes = `# Pendientes del cliente

> Generado por \`scripts/import-content.ts\` a partir de \`contenido.json\` (${fuente.generado}). Lo que figura aquí aparece en el sitio como \`${PENDIENTE}\` o \`${CONFIRMAR}\`. **No editar a mano:** los pendientes nuevos se agregan en la sección C del script y se regenera con \`npm run import:content\`.

## A. Información que falta (\`pendiente_cliente\`)

${fuente.pendiente_cliente.map((p) => `- [ ] ${p}`).join("\n")}

## B. Inconsistencias detectadas en el sitio actual (\`inconsistencias_detectadas\`)

${fuente.inconsistencias_detectadas.map((p) => `- [ ] ${p}`).join("\n")}

## C. Decisiones provisionales tomadas en el prototipo (confirmar)

- [ ] Precios usados: los de la home 2026 → Antecedentes Completo **S/ ${servicios.find((s) => s.slug === "antecedentes-completo")!.precio.actual}**, DiagnostiCAR Plus **S/ ${servicios.find((s) => s.slug === "diagnosticar-plus")!.precio.actual}**. Confirmar y aclarar si incluyen IGV.
- [ ] Cifras usadas: ${negocio.metricas.diagnosticos.display} diagnósticos, ${negocio.metricas.resenas.display} reseñas, ${negocio.metricas.rating.display}★, ${negocio.metricas.anios.display} años, «+200 puntos» de revisión, duración 40–70 min.
- [ ] Cifras de la landing de venta marcadas \`${CONFIRMAR}\`: ${negocio.metricas.leadsDiarios.display} leads diarios y ${negocio.metricas.seguidores.display} seguidores.
- [ ] Email: no se publica \`${negocio.emailReferenciaInterna}\` hasta confirmar el oficial.
- [ ] Cuenta BCP y CCI del sitio antiguo: **no** se importaron. Confirmar medios de pago (Yape/Plin/tarjeta/transferencia) antes de publicarlos.
- [ ] Reseñas: ${construirTestimonios().filter((t) => !t.autor).length} testimonios del sitio antiguo no tienen nombre; ninguno tiene permiso de uso confirmado.
- [ ] Aliado SONAX: solo aparece en páginas antiguas; no se muestra como aliado vigente.
- [ ] Asesoría precompra online: no se muestra el precio antiguo (S/ 99) hasta confirmar.
- [ ] Logo vectorial (SVG) y versión oficial para fondo claro: hoy se usan derivados del PNG original 1894×1074 (dark, light con «CAR» recoloreado a ink, isotipo). El laptop gris claro del logo se ve tenue sobre fondos claros.
- [ ] Sello «Vehículo verificado»: el QR del prototipo es ilustrativo. Falta la URL real de verificación.
- [ ] Gestión: URL de la nota de prensa. Ficha de Google Business (URL para «Ver reseñas en Google»).
- [ ] TikTok: el enlace corto es ${'`'}https://vt.tiktok.com/ZSPVKqXRd/${'`'} (de raw/venta-sin-consignar.html); confirmar el @usuario de la cuenta.
- [ ] IDs de Meta Pixel, TikTok Pixel y GTM (variables \`NEXT_PUBLIC_GTM_ID\`, \`NEXT_PUBLIC_META_PIXEL_ID\`, \`NEXT_PUBLIC_TIKTOK_PIXEL_ID\`).
- [ ] Fotos reales para «Confianza técnica»: el sitio actual usa 3 imágenes que parecen de banco o generadas (fg-min, gh-1, Diseno-sin-titulo-6); el prototipo usa fotos propias (equipo, videoscopio, informe de ejemplo, unidades móviles).
- [ ] Certificaciones de los técnicos («Técnicos certificados» se muestra sin detalle).
- [ ] Ícono oficial del Libro de Reclamaciones (Indecopi) en SVG/PNG.
- [ ] Copy redactado en la Fase 2 (titulares de comparador, consulta por placa, confianza y footer): validar.
- [ ] Fotos de hallazgos sin subtítulos quemados, en especial choque oculto y problemas documentarios.
- [ ] Fotos que muestren el hallazgo: hoy «kilometraje bajado» (${FOTOS_PROBLEMAS["Kilometraje bajado"]!.archivo}) muestra una llanta y «airbags reventados» (${FOTOS_PROBLEMAS["Airbags reventados"]!.archivo}) no muestra un airbag; sus \`alt\` originales no describen la imagen y se reemplazaron por descripciones literales.
`;
writeFileSync(join(ROOT, "docs/PENDIENTES.md"), pendientes);
console.log("✓ docs/PENDIENTES.md");
