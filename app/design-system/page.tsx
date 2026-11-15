import type { Metadata } from "next";
import Link from "next/link";
import { ContrastSample } from "@/components/design-system/contrast-sample";
import { DsSection, Specimen } from "@/components/design-system/specimen";
import {
  Badge,
  Button,
  ComparatorToggle,
  Counter,
  DistrictList,
  Eyebrow,
  FaqAccordion,
  FindingMeter,
  Highlight,
  Logo,
  LogoWall,
  Pendiente,
  PhotoFigure,
  PlanCard,
  PlateInput,
  Price,
  ReviewCard,
  Stepper,
  TextField,
  VerifiedSeal,
  WhatsAppButton,
} from "@/components/ui";
import { cobertura } from "@/content/cobertura";
import { comparador } from "@/content/comparador";
import { faqsHome } from "@/content/faqs";
import { negocio } from "@/content/negocio";
import { problemas, problemasFuente } from "@/content/problemas";
import { proceso } from "@/content/proceso";
import { escalera, getServicio } from "@/content/servicios";
import { testimoniosConNombre } from "@/content/testimonios";
import { PARES, PROHIBIDOS, ratio } from "@/lib/contrast";
import { tokens, type Token } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Sistema de diseño",
  description: "Tokens y componentes del prototipo DiagnostiCAR (uso interno).",
  robots: { index: false, follow: false },
};

const SECCIONES = [
  ["color", "Color"],
  ["contraste", "Contraste AA"],
  ["tipografia", "Tipografía"],
  ["espaciado", "Espaciado y radios"],
  ["botones", "Botones"],
  ["etiquetas", "Eyebrow, badges, pendientes"],
  ["precios", "Precios y tarjetas de plan"],
  ["medidores", "Medidor de hallazgo"],
  ["metricas", "Contadores"],
  ["comparador", "Comparador"],
  ["pasos", "Stepper"],
  ["distritos", "Chips de distrito"],
  ["faq", "Acordeón FAQ"],
  ["resenas", "Reseñas"],
  ["logos", "Logo y muro de logos"],
  ["formularios", "Formularios e input de placa"],
  ["sello", "Sello «Vehículo verificado»"],
  ["fotos", "Fotos reales"],
] as const;

const GRUPOS_COLOR: { titulo: string; tokens: { t: Token; uso: string }[] }[] = [
  {
    titulo: "Base",
    tokens: [
      { t: "ink", uso: "Fondos oscuros, texto principal" },
      { t: "ink-2", uso: "Superficies oscuras secundarias" },
      { t: "ink-muted", uso: "Texto secundario sobre oscuro (añadido)" },
      { t: "paper", uso: "Fondo claro principal" },
      { t: "white", uso: "Tarjetas sobre paper" },
      { t: "line", uso: "Bordes y divisores (decorativos)" },
      { t: "muted", uso: "Texto secundario y borde de inputs sobre claro" },
    ],
  },
  {
    titulo: "Marca",
    tokens: [
      { t: "brand", uso: "Acento sobre ink; fondo de botón con texto ink" },
      { t: "brand-deep", uso: "Enlaces, acentos y foco sobre claro" },
      { t: "whatsapp", uso: "Solo botón WhatsApp (texto ink)" },
    ],
  },
  {
    titulo: "Semáforo de hallazgos",
    tokens: [
      { t: "ok", uso: "Hallazgo poco frecuente / estado OK" },
      { t: "warn", uso: "Frecuencia media / advertencia" },
      { t: "alert", uso: "Frecuencia alta / alerta" },
      { t: "alert-deep", uso: "Texto de error sobre claro (añadido)" },
      { t: "alert-soft", uso: "Texto de error sobre oscuro (añadido)" },
    ],
  },
];

export default function DesignSystemPage() {
  const diagnosticar = getServicio("diagnosticar");
  // Solo fotos que muestran el hallazgo (fuga, videoscopio, placas clonadas).
  const fotosHallazgo = problemas.filter((p) => p.muestraHallazgo);
  const m = negocio.metricas;
  return (
    <div className="surface-light min-h-dvh">
      <header className="surface-dark bg-inspeccion">
        <div className="container-site py-16 sm:py-20">
          <Logo on="dark" className="h-16" />
          <p className="mt-8 font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase">
            Fase 1 · Fundaciones · uso interno (noindex)
          </p>
          <h1 className="mt-3 text-h1">
            Sistema de diseño.
            <br />
            <Highlight>Informe técnico.</Highlight>
          </h1>
          <p className="mt-6 max-w-[60ch] text-fg-muted">
            Tokens, tipografías y componentes del nuevo sitio. Cada componente se muestra sobre
            superficie clara (<code className="font-mono text-fg">paper</code>) y oscura (
            <code className="font-mono text-fg">ink</code>). Todo el contenido de ejemplo sale de{" "}
            <code className="font-mono text-fg">/content</code>, importado de{" "}
            <code className="font-mono text-fg">contenido.json</code>.
          </p>
        </div>
      </header>

      <div className="container-site lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <nav
          aria-label="Secciones del sistema de diseño"
          className="py-10 lg:sticky lg:top-0 lg:max-h-dvh lg:overflow-auto"
        >
          <p className="font-mono text-eyebrow tracking-[0.12em] text-muted uppercase">Índice</p>
          <ol className="mt-4 grid grid-cols-2 gap-x-4 text-sm sm:grid-cols-3 lg:grid-cols-1">
            {SECCIONES.map(([id, label], i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex min-h-11 items-center gap-2 text-ink hover:text-brand-deep"
                >
                  <span className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-brand-deep underline underline-offset-4"
            >
              ← Volver al inicio
            </Link>
          </p>
        </nav>

        <main id="contenido" className="min-w-0">
          {/* 01 COLOR */}
          <DsSection
            id="color"
            numero="01"
            titulo="Color"
            descripcion={
              <>
                Paleta derivada del logo (teal <code className="font-mono">#04ADBF</code> + gris).
                Los hex viven en <code className="font-mono">lib/tokens.ts</code> y{" "}
                <code className="font-mono">app/globals.css</code>; la paleta por defecto de
                Tailwind está desactivada. Se añadieron 3 tokens para cumplir AA (ver Contraste).
              </>
            }
          >
            {GRUPOS_COLOR.map((g) => (
              <div key={g.titulo}>
                <h3 className="font-mono text-eyebrow tracking-[0.12em] text-muted uppercase [font-stretch:100%] font-medium">
                  {g.titulo}
                </h3>
                <ul role="list" className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {g.tokens.map(({ t, uso }) => (
                    <li
                      key={t}
                      className="overflow-hidden rounded-card border border-line bg-white"
                    >
                      <div aria-hidden className="h-20" style={{ background: tokens[t] }} />
                      <div className="border-t border-line p-3">
                        <p className="flex items-baseline justify-between gap-2 font-mono text-sm">
                          <span className="font-medium">{t}</span>
                          <span className="text-xs text-muted">{tokens[t]}</span>
                        </p>
                        <p className="text-sm text-muted">{uso}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </DsSection>

          {/* 02 CONTRASTE */}
          <DsSection
            id="contraste"
            numero="02"
            titulo="Contraste AA"
            descripcion={
              <>
                Calculado con la fórmula WCAG 2.2 por{" "}
                <code className="font-mono">npm run check:contrast</code> (falla si algo baja del
                mínimo). Texto: 4.5:1. Componentes de interfaz, foco y gráficos: 3:1.
              </>
            }
          >
            <div
              tabIndex={0}
              role="region"
              aria-label="Tabla de contraste (desplazable en horizontal)"
              className="overflow-x-auto rounded-card border border-line bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep"
            >
              <table className="w-full min-w-[640px] text-left text-sm">
                <caption className="sr-only">Combinaciones de color y su contraste</caption>
                <thead className="border-b border-line font-mono text-xs text-muted uppercase">
                  <tr>
                    <th scope="col" className="p-3 font-medium">
                      Muestra (uso real)
                    </th>
                    <th scope="col" className="p-3 font-medium">
                      Uso
                    </th>
                    <th scope="col" className="p-3 font-medium">
                      Ratio
                    </th>
                    <th scope="col" className="p-3 font-medium">
                      Mín.
                    </th>
                    <th scope="col" className="p-3 font-medium">
                      Resultado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {PARES.map((p) => {
                    const r = ratio(tokens[p.fg], tokens[p.bg]);
                    return (
                      <tr key={`${p.fg}-${p.bg}-${p.uso}`}>
                        <td className="p-3">
                          <ContrastSample fg={p.fg} bg={p.bg} muestra={p.muestra} />
                        </td>
                        <td className="p-3">{p.uso}</td>
                        <td className="p-3 font-mono">{r.toFixed(2)}:1</td>
                        <td className="p-3 font-mono">{p.minimo}:1</td>
                        <td className="p-3">
                          <Badge tone={r >= p.minimo ? "ok" : "alert"}>
                            {r >= p.minimo ? "Cumple" : "Falla"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="rounded-card border border-line bg-white p-5">
              <h3 className="text-xl">Combinaciones prohibidas</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {PROHIBIDOS.map((p) => (
                  <li key={`${p.fg}-${p.bg}`} className="flex flex-wrap items-center gap-3">
                    <ContrastSample fg={p.fg} bg={p.bg} muestra="franja" />
                    <span className="font-mono">
                      {ratio(tokens[p.fg], tokens[p.bg]).toFixed(2)}:1
                    </span>
                    <span className="text-muted">{p.uso}</span>
                  </li>
                ))}
              </ul>
            </div>
          </DsSection>

          {/* 03 TIPOGRAFÍA */}
          <DsSection
            id="tipografia"
            numero="03"
            titulo="Tipografía"
            descripcion="Archivo (titulares, variable con wdth 87.5 %, peso 800, tracking −2 %), Inter Tight (texto, 17→18 px, interlineado 1.6) y JetBrains Mono 500 (cifras, placas, códigos, precios). Autohospedadas con next/font, subset latin, display: swap. Escala fluida con clamp()."
          >
            <Specimen stack>
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-xs text-fg-muted">
                    H1 · 44→88 px · Archivo 800 · wdth 87.5
                  </p>
                  <p
                    className="font-display text-h1 font-extrabold [font-stretch:87.5%]"
                    aria-hidden
                  >
                    Revisa antes de decidir. <br />
                    <Highlight>Las máquinas no mienten.</Highlight>
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs text-fg-muted">H2 · 32→56 px</p>
                  <p
                    className="font-display text-h2 font-extrabold [font-stretch:87.5%]"
                    aria-hidden
                  >
                    Elige cuánto quieres <Highlight>saber</Highlight> antes de comprar.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs text-fg-muted">H3 · 20→26 px</p>
                  <p
                    className="font-display text-h3 font-extrabold [font-stretch:87.5%]"
                    aria-hidden
                  >
                    De la duda al veredicto, en 4 pasos.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs text-fg-muted">
                    Texto · Inter Tight 400/500 · 17→18 px / 1.6
                  </p>
                  <p className="max-w-[62ch]">
                    Vamos a donde está el auto, revisamos su historia legal y su estado real con
                    equipos profesionales, y te damos un veredicto claro antes de que pagues.{" "}
                    <strong className="font-medium">Peso 500 para énfasis.</strong>
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs text-fg-muted">Mono · JetBrains Mono 500</p>
                  <p className="font-mono text-lg">
                    ABC-123 · P0420 · 8 / 10 · S/ 349 · {m.diagnosticos.display}
                  </p>
                </div>
              </div>
            </Specimen>
          </DsSection>

          {/* 04 ESPACIADO */}
          <DsSection
            id="espaciado"
            numero="04"
            titulo="Espaciado y radios"
            descripcion="Grid de 12 columnas, máx. 1200 px, gutter 24 px. Secciones con padding vertical clamp(64px, 10vw, 128px). Radios: 6 px (inputs, chips), 14 px (tarjetas), 999 px (botones). Sombras casi nulas: se usan bordes."
          >
            <div className="grid-12 rounded-card border border-line bg-white p-4">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="flex h-16 items-end justify-center rounded-sm bg-brand/15 pb-1 font-mono text-[0.65rem] text-brand-deep"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-end gap-6">
              {[
                ["radius-sm · 6 px", "rounded-sm"],
                ["radius-card · 14 px", "rounded-card"],
                ["radius-pill · 999 px", "rounded-pill"],
              ].map(([label, cls]) => (
                <div key={label} className="text-center">
                  <div className={`h-16 w-32 border-2 border-ink bg-white ${cls}`} />
                  <p className="mt-2 font-mono text-xs text-muted">{label}</p>
                </div>
              ))}
              <div className="text-center">
                <div className="surface-dark bg-inspeccion h-16 w-48 rounded-card" />
                <p className="mt-2 font-mono text-xs text-muted">Hoja de inspección</p>
              </div>
            </div>
          </DsSection>

          {/* 05 BOTONES */}
          <DsSection
            id="botones"
            numero="05"
            titulo="Botones"
            descripcion="Primario píldora brand con flecha en círculo; secundario de contorno; WhatsApp (verde, texto ink). Altura mínima 44 px. Los CTA de WhatsApp llevan mensaje prellenado y registran whatsapp_click {servicio, ubicacion}."
          >
            <Specimen>
              <div className="flex flex-wrap items-center gap-3">
                <WhatsAppButton
                  variant="primary"
                  servicio={diagnosticar.nombreWhatsapp}
                  ubicacion="design-system"
                >
                  Agendar diagnóstico
                </WhatsAppButton>
                <Button href="/servicios" variant="secondary">
                  Ver planes y precios
                </Button>
                <WhatsAppButton ubicacion="design-system">WhatsApp</WhatsAppButton>
                <Button href="/guia/consulta-placa-gratis" variant="link">
                  Consultar placa gratis
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button size="lg">Botón grande</Button>
                <Button variant="secondary" icon="phone" href={`tel:${negocio.telefono.e164}`}>
                  {negocio.telefono.display}
                </Button>
                <Button disabled>Deshabilitado</Button>
              </div>
            </Specimen>
          </DsSection>

          {/* 06 ETIQUETAS */}
          <DsSection id="etiquetas" numero="06" titulo="Eyebrow, badges y pendientes">
            <Specimen>
              <Eyebrow>Diagnóstico vehicular pre-compra a domicilio · Lima</Eyebrow>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge>Más elegido</Badge>
                <Badge tone="neutral">Nuevo</Badge>
                <Badge tone="ok">Sin observaciones</Badge>
                <Badge tone="warn">Revisar</Badge>
                <Badge tone="alert">Alerta</Badge>
              </div>
              <p className="mt-5 text-sm">
                Horario: {negocio.horario.dias}, <Pendiente>{negocio.horario.horas}</Pendiente>
              </p>
            </Specimen>
          </DsSection>

          {/* 07 PRECIOS Y PLANES */}
          <DsSection
            id="precios"
            numero="07"
            titulo="Precios y tarjetas de plan"
            descripcion="Precio en mono con el anterior tachado. La tarjeta «Más elegido» usa superficie oscura. En móvil, la Fase 2 las pondrá en carrusel con snap."
          >
            <Specimen>
              <div className="flex flex-wrap gap-8">
                {escalera.slice(2, 4).map((s) => (
                  <div key={s.slug}>
                    <p className="font-mono text-xs text-fg-muted">{s.nombre}</p>
                    <Price precio={s.precio} />
                  </div>
                ))}
                <div>
                  <p className="font-mono text-xs text-fg-muted">
                    {getServicio("asesoria-precompra-online").nombre}
                  </p>
                  <Price precio={getServicio("asesoria-precompra-online").precio} />
                </div>
              </div>
            </Specimen>
            <div className="surface-light rounded-card border border-line p-6">
              <ul role="list" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {escalera.map((s, i) => (
                  <li key={s.slug}>
                    <PlanCard
                      servicio={s}
                      indice={i + 1}
                      total={escalera.length}
                      ubicacion="design-system"
                    />
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-muted">
                Programa tu cita con el {negocio.reserva.adelantoPorcentaje} % del servicio. Aplican
                términos y condiciones.
              </p>
            </div>
          </DsSection>

          {/* 08 MEDIDORES */}
          <DsSection
            id="medidores"
            numero="08"
            titulo="Medidor de hallazgo"
            descripcion="Barra segmentada de 10 celdas en semáforo (≥ 5/10 alerta, ≥ 2/10 advertencia, menos: ok) + cifra en mono. Se llena al entrar en pantalla. Lector de pantalla: «8 de cada 10 autos»."
          >
            <Specimen>
              <ul role="list" className="space-y-5">
                {problemas.map((p) => (
                  <li key={p.slug}>
                    <p className="mb-1.5 text-[0.95rem] font-medium">
                      {p.titulo}
                      {p.detalle && (
                        <span className="font-normal text-fg-muted"> · {p.detalle}</span>
                      )}
                    </p>
                    <FindingMeter casos={p.casos} base={p.base} />
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-mono text-xs text-fg-muted">Fuente: {problemasFuente}.</p>
            </Specimen>
          </DsSection>

          {/* 09 CONTADORES */}
          <DsSection
            id="metricas"
            numero="09"
            titulo="Contadores"
            descripcion="Suben una sola vez al entrar en pantalla; con reduced-motion se muestran fijos."
          >
            <Specimen>
              <dl className="grid grid-cols-2 gap-6">
                {[m.diagnosticos, m.rating, m.resenas, m.independencia].map((x) => (
                  <div key={x.etiqueta} className="flex flex-col border-l border-accent pl-4">
                    <dt className="text-sm text-fg-muted">{x.etiqueta}</dt>
                    <dd className="order-first">
                      <Counter
                        display={x === m.rating ? `${x.display}★` : x.display}
                        className="text-4xl font-medium"
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            </Specimen>
          </DsSection>

          {/* 10 COMPARADOR */}
          <DsSection
            id="comparador"
            numero="10"
            titulo="Comparador"
            descripcion="Patrón de pestañas WAI-ARIA: flechas ← → para cambiar, Tab entra al panel."
          >
            <Specimen>
              <ComparatorToggle sin={comparador.sin} con={comparador.con} />
            </Specimen>
          </DsSection>

          {/* 11 STEPPER */}
          <DsSection id="pasos" numero="11" titulo="Stepper de 4 pasos">
            <Specimen stack>
              <Stepper pasos={proceso} />
            </Specimen>
          </DsSection>

          {/* 12 DISTRITOS */}
          <DsSection
            id="distritos"
            numero="12"
            titulo="Chips de distrito"
            descripcion={`Distritos sin recargo (${cobertura.sinRecargo.length}). Vigencia de la lista por confirmar.`}
          >
            <Specimen>
              <DistrictList distritos={cobertura.sinRecargo} />
              <p className="mt-4 text-sm text-fg-muted">{cobertura.nota}</p>
            </Specimen>
          </DsSection>

          {/* 13 FAQ */}
          <DsSection
            id="faq"
            numero="13"
            titulo="Acordeón FAQ"
            descripcion="<details>/<summary> nativo: funciona con teclado y sin JavaScript."
          >
            <Specimen>
              <FaqAccordion faqs={faqsHome.slice(0, 3)} />
            </Specimen>
          </DsSection>

          {/* 14 RESEÑAS */}
          <DsSection
            id="resenas"
            numero="14"
            titulo="Reseñas"
            descripcion="Texto literal de Google. Permiso de uso pendiente."
          >
            <Specimen>
              <div className="grid gap-4">
                {testimoniosConNombre.slice(0, 2).map((t) => (
                  <ReviewCard key={t.id} testimonio={t} />
                ))}
              </div>
            </Specimen>
          </DsSection>

          {/* 15 LOGOS */}
          <DsSection
            id="logos"
            numero="15"
            titulo="Logo y muro de logos"
            descripcion="El PNG del logo tiene «CAR» en blanco: solo sirve sobre oscuro. Sobre claro se usa un logotipo tipográfico provisional hasta tener el SVG."
          >
            <Specimen dark={<Logo on="dark" className="h-20" />}>
              <Logo on="light" className="text-4xl" />
            </Specimen>
            <Specimen stack>
              <LogoWall
                grupos={[
                  {
                    titulo: "Aliados que nos respaldan",
                    logos: negocio.aliados
                      .filter((a) => a.vigente && a.logo)
                      .map((a) => ({ nombre: a.nombre, logo: a.logo! })),
                  },
                  { titulo: "Estamos en los medios", logos: negocio.medios },
                  { titulo: "Apoyamos el automovilismo", logos: negocio.automovilismo },
                ]}
              />
            </Specimen>
          </DsSection>

          {/* 16 FORMULARIOS */}
          <DsSection
            id="formularios"
            numero="16"
            titulo="Formularios e input de placa"
            descripcion="Máscara AAA-000 (acepta ABC-123 y A1B-234). Validación al salir del campo; errores anunciados con role=alert y asociados por aria-describedby. Celular: 9 dígitos que empiezan con 9."
          >
            <Specimen
              dark={
                <div className="grid gap-4 sm:grid-cols-2">
                  <PlateInput id="ds-placa-oscuro" />
                  <TextField
                    id="ds-cel-oscuro"
                    label="Celular"
                    type="tel"
                    inputMode="numeric"
                    placeholder="9XX XXX XXX"
                    error="El celular debe tener 9 dígitos y empezar con 9."
                  />
                </div>
              }
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <PlateInput id="ds-placa-claro" />
                <TextField
                  id="ds-cel-claro"
                  label="Celular"
                  type="tel"
                  inputMode="numeric"
                  placeholder="9XX XXX XXX"
                  hint="Te escribimos por WhatsApp."
                />
              </div>
            </Specimen>
          </DsSection>

          {/* 17 SELLO */}
          <DsSection
            id="sello"
            numero="17"
            titulo="Sello «Vehículo verificado»"
            descripcion={
              <>
                SVG con QR <strong>ilustrativo</strong> (no escaneable). URL de verificación:{" "}
                <Pendiente />
              </>
            }
          >
            <Specimen>
              <VerifiedSeal className="mx-auto max-w-56" />
            </Specimen>
          </DsSection>

          {/* 18 FOTOS */}
          <DsSection
            id="fotos"
            numero="18"
            titulo="Fotos reales"
            descripcion="Solo fotos reales del sitio (nunca las del blog). Recorte editorial 2:1 con object-position para esconder subtítulos quemados, leve desaturación y pie en mono que viene de /content: dice lo que la foto muestra («Hallazgo real» solo si se ve el hallazgo; si no, «Fotograma de video»)."
          >
            <Specimen stack>
              <div className="grid gap-6 sm:grid-cols-3">
                {fotosHallazgo.map((p) => (
                  <PhotoFigure
                    key={p.slug}
                    imagen={p.imagen}
                    aspect="aspect-[2/1]"
                    sizes="(min-width: 640px) 30vw, 100vw"
                  />
                ))}
              </div>
            </Specimen>
          </DsSection>
        </main>
      </div>
    </div>
  );
}
