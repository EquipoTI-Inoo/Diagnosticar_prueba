/**
 * Navegación del sitio (§4 del prompt maestro). Estructura, no datos de negocio:
 * los precios «desde» del mega-menú se leen de servicios.ts.
 */
import { z } from "zod";
import { navItemSchema, type NavItem } from "./schema";
import { servicios } from "./servicios";

const lista = z.array(navItemSchema);

export const megaMenuServicios = servicios
  .filter((s) => s.slug !== "certifica-tu-auto")
  .map((s) => ({
    label: s.nombre,
    href: s.href,
    descripcion: s.tagline,
    precioDesde: s.precio.actual,
  }));

export const navPrincipal: NavItem[] = lista.parse([
  { label: "Servicios", href: "/servicios" },
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Vende tu auto", href: "/vende-tu-auto" },
  { label: "Guía", href: "/guia" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
]);

export const etapas = z
  .array(
    z.object({
      titulo: z.string(),
      texto: z.string(),
      enlaces: lista,
    }),
  )
  .parse([
    {
      titulo: "Recién estoy evaluando",
      texto: "Todavía no decido qué auto comprar. Quiero información antes de buscar.",
      enlaces: [
        { label: "Guía gratis", href: "/guia" },
        { label: "Checklist", href: "/guia/checklist" },
        { label: "Top problemas", href: "/guia/problemas-comunes" },
      ],
    },
    {
      titulo: "Estoy buscando opciones",
      texto: "Ya tengo uno o varios autos en la mira y quiero comparar antes de decidir.",
      enlaces: [
        { label: "Asesoría precompra", href: "/servicios/asesoria-precompra-online" },
        { label: "Comparar planes", href: "/servicios" },
      ],
    },
    {
      titulo: "Ya encontré el auto",
      texto: "Tengo la placa de un auto puntual y quiero revisarlo antes de comprar.",
      enlaces: [{ label: "Agendar diagnóstico", href: "/servicios/diagnosticar", whatsapp: true }],
    },
    {
      titulo: "Quiero vender mi auto",
      texto: "Quiero certificar mi auto para generar más confianza al venderlo.",
      enlaces: [{ label: "Certificar mi auto", href: "/vende-tu-auto" }],
    },
  ]);

export const footer = {
  servicios: lista.parse(servicios.map((s) => ({ label: s.nombre, href: s.href }))),
  aprende: lista.parse([
    { label: "Guía para comprar un auto usado", href: "/guia" },
    { label: "Checklist precompra", href: "/guia/checklist" },
    { label: "Problemas más comunes", href: "/guia/problemas-comunes" },
    { label: "Consulta de placa gratis", href: "/guia/consulta-placa-gratis" },
    { label: "Tecnología", href: "/tecnologia" },
    { label: "Blog", href: "/blog" },
  ]),
  empresa: lista.parse([
    { label: "Nosotros", href: "/nosotros" },
    { label: "Cómo funciona", href: "/como-funciona" },
    { label: "Cobertura", href: "/cobertura" },
    { label: "Informe de ejemplo", href: "/informe-de-ejemplo" },
    { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
    { label: "Términos y condiciones", href: "/legal/terminos-y-condiciones" },
    { label: "Privacidad", href: "/legal/privacidad" },
    { label: "Cookies", href: "/legal/cookies" },
  ]),
};

/**
 * Rutas del mapa del sitio (§4) que aún no existen, con la fase del §10 en que se construyen.
 * Mientras tanto, app/(site)/[...ruta] muestra un marcador «en construcción» (noindex) para que
 * el prototipo sea navegable y no haya 404 en los enlaces internos. Cada ruta real que se cree
 * en su fase tiene prioridad sobre el marcador.
 */
export const rutasPlanificadas: { href: string; titulo: string; fase: 3 | 4 }[] = [
  { href: "/servicios", titulo: "Planes y precios", fase: 3 },
  ...servicios
    .filter((s) => s.href.startsWith("/servicios/"))
    .map((s) => ({ href: s.href, titulo: s.nombre, fase: 3 as const })),
  { href: "/vende-tu-auto", titulo: "Vende tu auto", fase: 3 },
  { href: "/como-funciona", titulo: "Cómo funciona", fase: 3 },
  { href: "/cobertura", titulo: "Cobertura", fase: 3 },
  { href: "/informe-de-ejemplo", titulo: "Informe de ejemplo", fase: 3 },
  { href: "/contacto", titulo: "Contacto", fase: 3 },
  { href: "/tecnologia", titulo: "Tecnología", fase: 4 },
  { href: "/guia", titulo: "Guía para comprar un auto usado", fase: 4 },
  { href: "/guia/checklist", titulo: "Checklist precompra", fase: 4 },
  { href: "/guia/problemas-comunes", titulo: "Problemas más comunes", fase: 4 },
  { href: "/guia/consulta-placa-gratis", titulo: "Consulta de placa gratis", fase: 4 },
  { href: "/blog", titulo: "Blog", fase: 4 },
  { href: "/nosotros", titulo: "Nosotros", fase: 4 },
  { href: "/preguntas-frecuentes", titulo: "Preguntas frecuentes", fase: 4 },
  { href: "/legal/terminos-y-condiciones", titulo: "Términos y condiciones", fase: 4 },
  { href: "/legal/privacidad", titulo: "Política de privacidad", fase: 4 },
  { href: "/legal/cookies", titulo: "Política de cookies", fase: 4 },
  { href: "/libro-de-reclamaciones", titulo: "Libro de Reclamaciones", fase: 4 },
];
