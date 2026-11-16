/**
 * Copy de las páginas educativas (Fase 4: §5.8–§5.14).
 * Redacción propia SOBRE el texto del scrape (regla 2: más claro, sin cambiar significado ni cifras).
 * Cada bloque indica su fuente; las cifras se interpolan desde /content o existen en el JSON
 * (lo verifican `npm run check:datos` y `npm run check:paginas`).
 * Excepción: los T&C se muestran LITERALES desde educativo-fuente.ts (no pasan por aquí).
 */
import { z } from "zod";
import { educativoFuente as F } from "./educativo-fuente";
import { negocio } from "./negocio";
import { problemas, problemasFuente } from "./problemas";
import { CONFIRMAR, PENDIENTE, type ServicioSlug } from "./schema";

const palabras = (t: string) => t.trim().split(/\s+/).length;
const aeo = z.string().superRefine((t, ctx) => {
  const n = palabras(t);
  if (n < 40 || n > 60)
    ctx.addIssue({
      code: "custom",
      message: `Resumen-respuesta con ${n} palabras (40–60): «${t}»`,
    });
});

/** Fecha de esta versión del contenido educativo (visible como «Actualizado»). */
export const ACTUALIZADO = { iso: "2026-11-16", texto: "16 de noviembre de 2026" };

/* ------------------------------------------------------------------ /tecnologia (§5.8) */

const T = F.tecnologia;
export const paginaTecnologia = {
  seo: {
    title: "Tecnología de diagnóstico",
    description:
      "Escáneres LAUNCH y Autel, escaneo electromagnético de carrocería, videoscopía y revisión de +200 puntos: qué hace cada herramienta.",
  },
  h1: "Un solo escáner no puede detectarlo todo.",
  resumen: aeo.parse(
    "Para revisar un auto usado combinamos varias herramientas: escáneres profesionales que leen todos los sistemas y el kilometraje real, un escáner electromagnético que detecta masilla de choques, un videoscopio para ver dentro del motor, una revisión vehicular de +200 puntos y la prueba de manejo. Cada una cubre lo que la otra no ve.",
  ),
  herramientas: [
    {
      id: "escaneo",
      pregunta: "¿Qué detecta el escaneo computarizado?",
      titulo: "Escaneo completo",
      // escaneo (legacy) + home 2026 («6 escáneres profesionales…»).
      texto: [
        "Conectamos un escáner profesional al puerto OBD2 y leemos los códigos de falla del auto, incluso si manipularon el tablero para que no se vean. También vemos los datos en tiempo real, las fallas que quedaron guardadas en el sistema y el kilometraje real.",
        "Ningún escáner lee todas las marcas, modelos y años: por eso tenemos 6 escáneres profesionales y llevamos a tu cita el más adecuado para tu auto.",
      ],
      lista: { titulo: "Sistemas que escaneamos", items: T.escaneo.sistemas },
      foto: "informe-2" as const,
    },
    {
      id: "carroceria",
      pregunta: "¿Qué es el escaneo electromagnético de carrocería?",
      titulo: "Escaneo electromagnético de carrocería",
      // detector-de-choques (legacy).
      texto: [
        "Es una medición que detecta capas de masilla sobre la lata. Según el espesor de la capa sabemos si el auto tuvo golpes, choques o siniestros graves, aunque esté bien pintado.",
        "Según el plan, medimos la carrocería entre 100 y 120 veces para revisar todos los paneles.",
      ],
      foto: null,
    },
    {
      id: "videoscopia",
      pregunta: "¿Para qué sirve la videoscopía?",
      titulo: "Videoscopía",
      // videoscopo (legacy).
      texto: [
        "Un videoscopio es una cámara en una sonda flexible que llega a los lugares más escondidos. Con él revisamos uno por uno los cilindros, las válvulas de admisión y escape y los pistones, y hemos encontrado ramales del cableado principal en mal estado.",
      ],
      foto: "videoscopio" as const,
    },
    {
      id: "revision",
      pregunta: "¿Qué incluye la revisión vehicular?",
      titulo: "Revisión vehicular (+200 puntos)",
      // revision-vehicular (legacy). La cifra se unifica a «+200 puntos» (dato vigente); ver PENDIENTES.
      texto: [
        "Es una revisión minuciosa de +200 puntos con equipos especializados. Medimos la calidad del aceite y del líquido de frenos y hacemos pruebas de arranque para conocer el estado del arrancador, el alternador y la batería.",
      ],
      lista: { titulo: "Sistemas que revisamos", items: T.revision.sistemas },
      foto: "informe-3" as const,
    },
    {
      id: "manejo",
      pregunta: "¿Qué se detecta en la prueba de manejo?",
      titulo: "Prueba de manejo",
      // manejo (legacy) + T&C «Prueba de manejo».
      texto: [
        "Complementa lo que miden las máquinas: sonidos extraños, dirección, frenos, caja de cambios, motor, accesorios internos y el funcionamiento general.",
        "Solo se hace si la pides, con autorización del propietario, en una ruta corta de máximo 20 minutos y si el auto cumple condiciones mínimas de seguridad.",
      ],
      foto: null,
    },
    {
      id: "plus",
      pregunta: "¿Qué agrega el DiagnostiCAR Plus?",
      titulo: "PaintSCAN, TintSCAN y escaneo láser",
      // servicios[DiagnostiCAR Plus].incluye.
      texto: [
        "El DiagnostiCAR Plus suma PaintSCAN Pro + TintSCAN Pro, escaneo láser de frenos y llantas y protección anticlonación.",
      ],
      foto: null,
      servicio: "diagnosticar-plus" as ServicioSlug,
    },
  ],
};

/* ------------------------------------------------------------------ /guia (§5.9) */

const G = F.guia as Record<string, readonly string[]>;
/** Exige que la sección de la guía original exista y contenga el fragmento citado. */
function fuenteGuia(seccion: string, fragmento: string): string {
  const ok = (G[seccion] ?? []).some((p) => p.includes(fragmento));
  if (!ok)
    throw new Error(`[educativo] La guía original («${seccion}») no contiene «${fragmento}»`);
  return seccion;
}

export type SeccionGuia = {
  id: string;
  titulo: string;
  texto: string[];
  consulta?: { donde: string; detalle: string };
  fuente: string;
};

const legal: SeccionGuia[] = [
  {
    id: "impuesto-vehicular-sat",
    titulo: "Impuesto vehicular y medidas cautelares (SAT)",
    texto: [
      "El impuesto vehicular se aplica a los autos con 3 años o menos de antigüedad desde su primera inscripción en el Registro de Propiedad Vehicular. Las medidas cautelares se inscriben para garantizar el pago de deudas: si el auto las tiene, la deuda viaja con él.",
    ],
    consulta: {
      donde: "SAT y SUNARP",
      detalle:
        "El impuesto se revisa en el SAT; las medidas cautelares, en la partida del vehículo en SUNARP.",
    },
    fuente: fuenteGuia(
      "Pago de impuestos o inscripción de medidas cautelares SAT",
      "3 años o menos",
    ),
  },
  {
    id: "cuantos-duenos",
    titulo: "¿Cómo saber cuántos dueños tuvo un auto en Perú?",
    texto: [
      "Busca la placa en SUNARP y mira el historial de propietarios. Son alertas rojas: muchos dueños en poco tiempo, varias transferencias en un mismo año, que haya pertenecido a una empresa de seguros o que se haya vendido por un valor muy bajo.",
    ],
    consulta: { donde: "SUNARP", detalle: "Búsqueda con el número de placa." },
    fuente: fuenteGuia("Historial de Propietarios", "SUNARP"),
  },
  {
    id: "papeletas",
    titulo: "¿Qué papeletas no ven las notarías?",
    texto: [
      "Las notarías solo ven las papeletas de Lima y Callao. Hemos encontrado autos que se vendían en Lima con más de 20 mil soles en papeletas de provincias, y autos vendidos como particulares que en realidad eran colectivos, con casi 20 mil soles de papeletas ocultas en la ATU.",
    ],
    consulta: {
      donde: "Municipalidades de provincia, SAT y ATU",
      detalle:
        "Busca la placa en la página de la municipalidad de cada provincia, en el SAT y en la ATU.",
    },
    fuente: fuenteGuia("Papeletas Pendientes de Pago", "LIMA Y EL CALLAO"),
  },
  {
    id: "ordenes-de-captura",
    titulo: "Órdenes de captura",
    texto: [
      "Muchos autos en el mercado tienen órdenes de captura vigentes por deuda tributaria o por papeletas.",
    ],
    consulta: {
      donde: "SAT",
      detalle:
        "Las órdenes de captura por deuda tributaria o papeletas se revisan en la página del SAT.",
    },
    fuente: fuenteGuia("Ordenes de Captura", "SAT"),
  },
  {
    id: "robo",
    titulo: "Antecedentes de robo",
    texto: [
      "Hemos encontrado autos desmantelados y rearmados con partes de otros vehículos que no eran las adecuadas, y autos con anotación de robo vigente.",
    ],
    consulta: {
      donde: "SUNARP",
      detalle:
        "La anotación de robo aparece en la consulta vehicular por placa y en la partida electrónica del auto.",
    },
    fuente: fuenteGuia("Antecedentes Delictivos", "anotación de robo"),
  },
  {
    id: "gravamenes",
    titulo: "Gravámenes y títulos pendientes",
    texto: [
      "Hemos encontrado autos prendados o dados en garantía que se intentaban vender a terceros.",
    ],
    consulta: {
      donde: "SUNARP",
      detalle:
        "Los gravámenes y títulos pendientes figuran en la boleta informativa del vehículo, que se pide a SUNARP.",
    },
    fuente: fuenteGuia("Gravámenes", "boleta informativa"),
  },
  {
    id: "revision-tecnica",
    titulo: "Revisión técnica vehicular",
    texto: [
      "Comprueba que la revisión técnica esté vigente y mira el historial: si el auto desaprobó alguna vez, y por qué.",
    ],
    consulta: { donde: "MTC", detalle: "Consulta de CITV en la página del MTC." },
    fuente: fuenteGuia("Revisión Técnica Vehicular", "MTC"),
  },
  {
    id: "estado-registral",
    titulo: "Estado registral",
    texto: [
      "Revisa si el auto fue dado de baja. Hay quienes consiguen papeles de autos siniestrados para ponérselos a vehículos dados de baja y venderlos.",
    ],
    consulta: {
      donde: "SUNARP",
      detalle: "El estado del vehículo se confirma en la página de SUNARP.",
    },
    fuente: fuenteGuia("Estado Registral Del Vehículo", "SUNARP"),
  },
  {
    id: "importados",
    titulo: "Autos importados",
    texto: [
      "Muchos autos importados de Estados Unidos fueron dados de baja allá por siniestros, inundaciones u otras circunstancias. Si el auto es americano, pide siempre el reporte CARFAX para entender su historial.",
    ],
    consulta: { donde: "Reporte CARFAX", detalle: "Historial del auto en Estados Unidos." },
    fuente: fuenteGuia("Vehículos importados", "CARFAX"),
  },
  {
    id: "siniestrados-subastados",
    titulo: "Autos siniestrados o subastados en Perú",
    texto: [
      "La mayoría fueron declarados pérdida por el seguro, comprados por revendedores, arreglados y vendidos como si nunca hubieran chocado. Una forma de detectarlos: si alguno de los dueños anteriores fue una empresa de seguros, lo más probable es que el auto haya sido pérdida y subastado.",
    ],
    consulta: { donde: "SUNARP", detalle: "Relación de propietarios anteriores del vehículo." },
    fuente: fuenteGuia("Vehículos siniestrados o Subastados en Perú", "empresa de seguros"),
  },
];

const inspeccion: SeccionGuia[] = [
  {
    id: "kilometraje",
    titulo: "¿Cómo saber si un auto tiene el kilometraje bajado?",
    texto: [
      "En Perú esta práctica está tan normalizada que hasta hay anuncios en Facebook Marketplace que ofrecen «bajar el kilometraje». Hay señales visuales —el desgaste debe corresponder a lo que marca el odómetro—, pero la mejor forma de contrastarlo es con un escáner profesional que acceda a todos los sistemas del auto y ubique el kilometraje real.",
    ],
    fuente: fuenteGuia("Kilometraje Adulterado", "Marketplace"),
  },
  {
    id: "siniestrados",
    titulo: "Autos siniestrados: cómo detectar choques",
    texto: [
      "Hay que mirar las líneas del auto con un ojo entrenado. Con un escáner electromagnético se detecta la masilla sobre la lata, así que los choques reparados se encuentran fácilmente.",
    ],
    fuente: fuenteGuia("Autos Siniestrados", "masilla"),
  },
  {
    id: "escaneo-obd2",
    titulo: "Escaneo OBD2",
    texto: [
      "Los autos modernos tienen un puerto OBD2 para conectar un escáner y leer todos los sistemas: motor, caja de cambios, airbags, choques, recorrido real, fallas actuales y fallas que existieron. Cuánta información sale depende del nivel del escáner.",
    ],
    fuente: fuenteGuia("Escaneo Completo", "OBD2"),
  },
  {
    id: "fugas-de-aceite",
    titulo: "Mal mantenimiento y fugas de aceite",
    texto: [
      "La mayoría de autos tiene el desgaste normal del uso, pero hay detalles que parecen menores y cuestan miles de soles. Hace poco revisamos un Nissan Sentra con fuga de aceite en la caja: no es una reparación compleja, pero puede costar miles de soles porque ese aceite suele ser muy caro.",
    ],
    fuente: fuenteGuia("Mal Mantenimiento y Fugas de Aceite", "Nissan Sentra"),
  },
];

const fugas = problemas.find((p) => p.slug === "fugas-de-aceite")!;
/** /guia/consulta-placa-gratis: resumen-respuesta (§8 AEO) con datos de recursos_gratis y el Antecedentes Completo. */
export const paginaConsultaPlaca = {
  resumen: aeo.parse(
    "Te decimos gratis si el SOAT y la Revisión Técnica del auto que quieres comprar están vigentes, y cuántos dueños ha tenido. Solo necesitas la placa y tu celular: te respondemos por WhatsApp con el resultado. Papeletas en provincias, gravámenes u órdenes de captura se revisan en el informe Antecedentes Completo.",
  ),
};

export const paginaGuia = {
  seo: {
    title: "Guía 2026: comprar un auto usado en Perú",
    description:
      "Guía para comprar un auto usado en Perú sin sorpresas: qué revisar del estado legal (SUNARP, SAT, ATU, MTC) y de la inspección técnica antes de pagar.",
  },
  h1: "Cómo comprar un auto usado en Perú sin sorpresas (guía 2026)",
  resumen: aeo.parse(
    "Antes de pagar por un auto usado en Perú revisa dos cosas: su estado legal —propietarios, papeletas en todo el país, gravámenes, órdenes de captura, robo y revisión técnica, en SUNARP, SAT, ATU y MTC— y su estado real con una inspección técnica: kilometraje, choques ocultos, escaneo de sistemas y fugas.",
  ),
  dato: `Según ${problemasFuente.charAt(0).toLowerCase() + problemasFuente.slice(1)} de DiagnostiCAR, ${fugas.casos} de cada ${fugas.base} autos usados que revisamos tenían ${fugas.titulo.toLowerCase()}.`,
  intro:
    "En el mercado de autos de segunda en Perú hay estafas a diario: kilometraje adulterado, fallas electrónicas escondidas, autos chocados o volcados que se venden como si nunca hubieran tenido choques, fallas mecánicas importantes, autos clonados (VIN duplicado), papeletas en provincias, órdenes de captura y gravámenes pendientes. Esta guía te dice qué revisar y dónde.",
  partes: [
    {
      id: "estado-legal",
      titulo: "1. Estado legal del auto",
      bajada: "Averigua los antecedentes antes de ir a verlo.",
      secciones: legal,
    },
    {
      id: "inspeccion",
      titulo: "2. Inspección: en qué fijarse",
      bajada:
        "Con los antecedentes en orden, toca revisar el auto. La revisión mecánica, eléctrica, electrónica y física debe hacerla alguien con conocimiento y los equipos de diagnóstico adecuados.",
      secciones: inspeccion,
    },
  ],
  conclusion:
    "Todos los días vemos autos en venta con los que se pretende estafar a quien no conoce del tema. Revisa los antecedentes y que una persona experta te asesore antes de comprar.",
};

/* ------------------------------------------------------------------ /guia/checklist */

export const paginaChecklist = {
  seo: {
    title: "Checklist antes de comprar un auto usado",
    description:
      "Los 7 puntos que más conviene revisar antes de comprar un auto usado en Lima, según lo que encontramos en nuestras revisiones. Versión imprimible.",
  },
  h1: "Checklist antes de comprar un auto usado",
  resumen: aeo.parse(
    "Estos son los 7 puntos que más conviene revisar antes de comprar un auto usado, según lo que encontramos en nuestras revisiones: fugas de aceite, papeletas y garantías, choques ocultos, kilometraje, airbags, reparaciones de motor o caja y clonación. Imprímelo y llévalo cuando vayas a ver el auto.",
  ),
  // checklist-precompra (rediseño 2026), literal.
  puntos: F.checklist,
};

/* ------------------------------------------------------------------ /guia/problemas-comunes */

const EXPLICACION: Record<string, { texto: string; servicio: ServicioSlug }> = {
  "fugas-de-aceite": {
    texto:
      "Muchas parecen menores y cuestan miles de soles: una fuga en la caja no es compleja de reparar, pero el aceite de algunas cajas es muy caro. Revisamos motor, caja y la calidad del aceite con equipos especializados.",
    servicio: "diagnostico-basico",
  },
  "problemas-documentarios": {
    texto:
      "Garantías pendientes, papeletas en provincias, anotaciones de robo o pérdida total. Las notarías solo ven papeletas de Lima y Callao, por eso revisamos papeletas a nivel nacional, SUTRAN y ATU.",
    servicio: "antecedentes-completo",
  },
  "choques-ocultos": {
    texto:
      "Un buen trabajo de pintura los esconde a la vista. El escaneo electromagnético detecta la masilla sobre la lata: según el plan, medimos la carrocería entre 100 y 120 veces.",
    servicio: "diagnostico-basico",
  },
  "kilometraje-bajado": {
    texto:
      "Hay anuncios que ofrecen «bajar el kilometraje». Lo contrastamos con escáneres que leen los módulos del auto y con el desgaste de los componentes. Una manipulación profesional puede no ser detectable: confirma el historial con la casa matriz.",
    servicio: "diagnosticar",
  },
  "airbags-reventados": {
    texto:
      "Existen emuladores que hacen que un airbag detonado parezca funcionar. Si el escáner muestra códigos de airbag, no los borramos, y revisamos tablero, tapicería y parabrisas en busca de señales de choque.",
    servicio: "diagnosticar",
  },
  "motor-o-caja-reparados": {
    texto:
      "Con la videoscopía entramos al motor y revisamos uno por uno cilindros, válvulas y pistones: así se ven intervenciones que el vendedor no declaró.",
    servicio: "diagnosticar",
  },
  "carros-clonados": {
    texto:
      "Un auto clonado lleva el número de VIN duplicado de otro vehículo. Revisamos el N.° de VIN y de motor, y el DiagnostiCAR Plus incluye protección anticlonación.",
    servicio: "diagnosticar-plus",
  },
};

export const paginaProblemas = {
  seo: {
    title: "Problemas más comunes en autos usados",
    description: `Frecuencia real sobre los autos que revisamos: ${fugas.casos} de cada ${fugas.base} tienen fugas de aceite. Los 7 problemas más comunes y cómo detectarlos.`,
  },
  h1: "Los problemas más comunes al comprar un auto usado",
  resumen: aeo.parse(
    `Según ${problemasFuente.charAt(0).toLowerCase() + problemasFuente.slice(1)} de DiagnostiCAR, los problemas más comunes en autos usados son las fugas de aceite (${fugas.casos} de cada ${fugas.base}), los problemas documentarios, los choques ocultos, el kilometraje bajado, los airbags reventados, el motor o la caja reparados y, mucho menos, los autos clonados.`,
  ),
  fuente: problemasFuente,
  items: problemas.map((p, i) => {
    const e = EXPLICACION[p.slug];
    if (!e) throw new Error(`[educativo] Falta explicación para ${p.slug}`);
    // Frase literal de /puntos-importantes/ (misma cifra que problemas.ts).
    const dato = F.puntos[i]!;
    if (!dato.includes(`${p.casos} de cada ${p.base}`))
      throw new Error(`[educativo] Desfase entre puntos y problemas: ${p.slug}`);
    return { ...p, dato, explicacion: e.texto, servicio: e.servicio };
  }),
};

/* ------------------------------------------------------------------ /nosotros (§5.11) */

export const paginaNosotros = {
  seo: {
    title: "Nosotros",
    description: `DiagnostiCAR (${negocio.razonSocial}, RUC ${negocio.ruc}): diagnóstico vehicular pre-compra a domicilio en Lima. Historia, misión, visión y datos legales.`,
  },
  ...F.nosotros,
  contadores: [
    { valor: negocio.metricas.diagnosticos.display, etiqueta: "vehículos diagnosticados" },
    { valor: negocio.metricas.resenas.display, etiqueta: "clientes que nos reseñaron en Google" },
    { valor: negocio.metricas.anios.display, etiqueta: "años de experiencia" },
  ],
  equipo: `${PENDIENTE.slice(0, -1)}: fotos y nombres de técnicos, certificaciones]`,
  legales: [
    { t: "Razón social", v: negocio.razonSocial },
    { t: "RUC", v: negocio.ruc },
    { t: "Partida registral", v: negocio.partidaRegistral },
    {
      t: "Domicilio",
      v: `${negocio.direccion.calle}, ${negocio.direccion.distrito}, ${negocio.direccion.ciudad}`,
    },
  ],
};

/* ------------------------------------------------------------------ /preguntas-frecuentes (§5.12) */

export const paginaFaq = {
  seo: {
    title: "Preguntas frecuentes",
    description:
      "Respuestas cortas sobre el diagnóstico pre-compra de DiagnostiCAR: dónde lo hacemos, cuánto dura, reserva, certificación y alcances técnicos.",
  },
  h1: "Preguntas frecuentes",
  resumen: aeo.parse(
    "Aquí respondemos lo que más nos preguntan antes de agendar: dónde hacemos el diagnóstico, cuánto dura y cuándo recibes el informe, cómo se reserva y se reprograma, qué incluye la certificación para vender y qué no hacemos, como la medición de compresión del motor.",
  ),
};

/* ------------------------------------------------------------------ legales (§5.14) */

export const paginasLegales = {
  terminos: {
    seo: {
      title: "Términos y condiciones",
      description:
        "Términos y condiciones de los servicios de Diagnosticar S.A.C. (DiagnostiCAR): reservas, reprogramaciones, alcance del servicio y responsabilidades.",
    },
    h1: "Términos y condiciones",
    nota: "Texto vigente publicado por Diagnosticar S.A.C. Se reproduce sin cambios de redacción.",
  },
  privacidad: {
    seo: {
      title: "Política de privacidad",
      description:
        "Política de privacidad de DiagnostiCAR. Texto pendiente de entrega por el cliente.",
    },
    h1: "Política de privacidad",
    pendiente: `${PENDIENTE.slice(0, -1)}: texto de la política de privacidad]`,
    mientras:
      "Mientras se publica el texto definitivo, aplica lo indicado en la sección «Información y contacto» de los términos y condiciones.",
  },
  cookies: {
    seo: {
      title: "Política de cookies",
      description:
        "Política de cookies de DiagnostiCAR. Texto pendiente de entrega por el cliente.",
    },
    h1: "Política de cookies",
    pendiente: `${PENDIENTE.slice(0, -1)}: texto de la política de cookies]`,
    // Descripción de lo que hace este sitio (implementación propia, no un dato del cliente).
    comoFunciona: [
      {
        t: "Necesarias",
        d: "Guardan tu elección sobre cookies en este navegador. Siempre activas.",
      },
      {
        t: "Analítica",
        d: "Google Tag Manager, solo si la aceptas. Mide qué páginas y botones se usan.",
      },
      { t: "Publicidad", d: "Meta Pixel y TikTok Pixel, solo si la aceptas." },
    ],
  },
};

/* ------------------------------------------------------------------ /libro-de-reclamaciones */

export const paginaLibro = {
  seo: {
    title: "Libro de Reclamaciones",
    description: `Libro de Reclamaciones virtual de ${negocio.razonSocial} (RUC ${negocio.ruc}) conforme al Código de Protección y Defensa del Consumidor.`,
  },
  h1: "Libro de Reclamaciones",
  ...F.libro,
  aviso:
    "Prototipo: el envío es simulado. No se registra ni se envía ningún dato. El formulario definitivo se conectará al sistema que indique el cliente.",
  confirmar: CONFIRMAR,
};
