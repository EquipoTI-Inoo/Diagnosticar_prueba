# Decisiones

> Regla 6 del prompt maestro: lo que no está en el documento se resuelve con la opción más simple y se anota aquí. Fase 1 · 15/11/2026.

## Stack y proyecto

| # | Decisión | Por qué |
|---|---|---|
| D1 | **Next.js 15.5** (no la 16, que es la estable actual). | El prompt pide Next 15. Migrar después es sencillo. |
| D2 | **TypeScript 5.9** (no la 6). | Con TS 6, `tsc` marcaba error en `import "./globals.css"`; Next 15 está probado con TS 5. |
| D3 | **Zod 4** valida todo el contenido al cargar el módulo. | Un dato mal formado rompe `npm run build` en vez de llegar a producción. |
| D4 | `npm run lint` usa `eslint .` (flat config) y no `next lint`. | `next lint` está deprecado en Next 15.5. |
| D5 | Sin Playwright, axe ni Lighthouse CI en la Fase 1. | Son de la Fase 6; instalarlos ahora sería sumar dependencias antes de tiempo. |
| D6 | La paleta por defecto de Tailwind está **desactivada** (`--color-*: initial`). | Así solo se pueden usar los tokens de marca y no se cuela un `blue-500`. |
| D7 | `docs/fuente/` se versiona completo (~120 MB, incluye un video de 44 MB). | El prompt pide la carpeta dentro del repo. **Recomendación:** usar Git LFS para `assets/` y `raw/` antes de subirlo a GitHub. |
| D8 | Los archivos `.claude-fase1.*` de la raíz se ignoran en git. | Son salidas del orquestador, no parte del proyecto. |
| D9 | Todo el sitio va con `robots: noindex` mientras sea prototipo. | La indexación por entorno (`robots.ts`) es de la Fase 5. |

## Contenido

| # | Decisión | Por qué |
|---|---|---|
| C1 | `scripts/import-content.ts` **genera** `content/{negocio,servicios,faqs,testimonios,problemas,proceso,cobertura}.ts` y `docs/PENDIENTES.md`. Los archivos generados llevan cabecera «no editar». | Así cada dato sale de `contenido.json` y se puede regenerar. Las mejoras de redacción están en tablas explícitas `original → pulido` dentro del script; si un original desaparece del JSON, el script falla. |
| C2 | `content/navegacion.ts` y `content/comparador.ts` se escriben a mano. | No son datos de negocio: son estructura (mapa del §4) y copy curado del §5.1. El comparador cita en comentarios de qué página sale cada frase. |
| C3 | Precios en conflicto: se usan los de la **home 2026** (Antecedentes Completo S/ 49, Plus S/ 549) con `porConfirmar: true`. | Es la versión más reciente; el resto queda en PENDIENTES. |
| C4 | Asesoría online y Certificación: `precio.actual = null` → se muestra `[PENDIENTE CLIENTE]`. No se muestra el S/ 99 antiguo. | Lo indica el §5.3. |
| C5 | El email `info@diagnosticar.com` se guarda como `emailReferenciaInterna` y **no** se publica; `email = [PENDIENTE CLIENTE]`. | Dominio distinto al del sitio. |
| C6 | Cuenta BCP y CCI: **no se importan**. | El §5.5 prohíbe publicar números de cuenta sin confirmar. |
| C7 | Cifras de la landing de venta (300–400 leads, +100k seguidores) llevan `confirmar: true` y el texto `[CONFIRMAR CLIENTE]`. | Lo indica el §5.4. |
| C8 | Las reseñas se citan **textualmente** (sin corregir ortografía ni puntuación). | Son palabras de clientes. La regla 2 aplica al copy propio. |
| C9 | 3 testimonios del sitio antiguo sin nombre: `autor: null`. Solo los que tienen nombre van en `testimoniosConNombre`. | Evita inventar autores. |
| C10 | FAQ: 11 del JSON + 3 de certificación que solo estaban en `/venta-sin-consignar/` (el §5.4 pide 6). Se descartan duplicados por similitud. Categorías: Servicio · Reserva y pagos · Certificación · Alcances técnicos. | El §5.12 pide esas categorías. |
| C11 | Taglines de servicios sin tagline en el JSON: Asesoría «Para quien está lejos o no tiene tiempo.» (del público 4 del §2) y Certificación «Vehículo verificado por DiagnostiCAR.» (de su nombre). | Copy, no datos; se basan en el documento. |
| C12 | SONAX figura como aliado `vigente: false`. | Solo aparece en páginas antiguas. |
| C13 | Las fotos de `_clave` se copian a `public/img/clave/` y los logos a `public/logos/`; el PDF de ejemplo, a `public/docs/`. Ninguna imagen del blog. | Lo pide el §1. Los `alt` se toman del sitio original. |
| C14 | `npm run check:datos` audita que toda cifra de `/content` exista en `contenido.json` (ignora rutas y dimensiones de imagen). | Criterio de aceptación «ningún dato inventado», de forma repetible. |

## Sistema de diseño

| # | Decisión | Por qué |
|---|---|---|
| S1 | Se añaden 3 tokens: **`ink-muted` #8E9C9A** (texto secundario sobre oscuro), **`alert-deep` #B8392A** (texto de error sobre claro) y **`alert-soft` #F08A78** (texto de error sobre oscuro). | `muted` no se lee sobre `ink` y `alert` como texto sobre `paper` da 4.07:1 (< 4.5). |
| S2 | Superficies semánticas `.surface-light` / `.surface-dark` con variables (`bg`, `card`, `fg`, `fg-muted`, `accent`, `border`, `border-strong`, `ring`, `error`). | Un mismo componente funciona en secciones claras y oscuras sin variantes duplicadas. |
| S3 | **Acento:** `brand-deep` sobre claro y `brand` sobre oscuro (lo resuelve `text-accent`). | `brand` sobre `paper` da 2.50:1. |
| S4 | **Foco:** anillo de 2 px `brand-deep` sobre claro y `brand` sobre oscuro, desplazado 2 px. | Ambos superan 3:1. |
| S5 | **Bordes de inputs:** `muted` (claro) / `ink-muted` (oscuro); `line` solo para divisores decorativos. | `line` sobre `paper` da 1.21:1 (WCAG 1.4.11 pide 3:1 en controles). |
| S6 | **Botones:** texto `ink` sobre `brand` y sobre `whatsapp`. | El blanco da 2.71:1 y 1.98:1. |
| S7 | **Semáforo del medidor:** ≥ 5/10 → `alert`; ≥ 2/10 → `warn`; menos → `ok`. La cifra en mono acompaña siempre a la barra y el lector de pantalla lee «8 de cada 10 autos». | El ámbar sobre `paper` da 2.09:1: el dato nunca depende solo del color. |
| S8 | Tipografía: Archivo con `font-stretch: 87.5%` (dentro del rango wdth 87–100 que pide el §6) y peso 800 en titulares; Inter Tight variable; JetBrains Mono solo en 500. Las tres van autohospedadas con `next/font`, subset latin y `display: swap`. | Lo pide el §6. |
| S9 | Logo: el PNG tiene «CAR» en blanco, así que solo se usa sobre fondo oscuro. Sobre claro va un logotipo tipográfico provisional (Archivo, «CAR» en `brand-deep`). | No hay SVG ([PENDIENTE CLIENTE]). |
| S10 | Logos de terceros sobre placa blanca; el de Gestión (blanco con transparencia) sobre placa `ink-2` (campo `fondo: "oscuro"` en la imagen). | Se ven bien en ambos temas sin tocar los archivos. |
| S11 | El sello «Vehículo verificado» lleva un **QR ilustrativo** que no se puede escanear (patrón determinista con los 3 marcadores de posición). | No existe aún la URL de verificación; no se añade una librería de QR solo para un mockup. |
| S12 | Placa: se aceptan 1 letra + 2 alfanuméricos + 3 dígitos (`ABC-123`, `A1B-234`), con máscara automática y validación al salir del campo. | Cubre formatos peruanos actuales. |
| S13 | Componentes de «cromo» (header con mega-menú, footer, barra inferior móvil, botón flotante de WhatsApp y banner de cookies) se dejan para la **Fase 2**. | La Fase 2 los lista de forma explícita. En la Fase 1 van los componentes base del §6. |
| S14 | Analítica: `track()` solo envía a `dataLayer` si hay consentimiento analítico guardado (`localStorage dc-consent`). En desarrollo lo registra en la consola. | El §3 pide respetar el consentimiento. El banner que lo guarda llega en la Fase 2. |
| S15 | `/design-system` está fuera del grupo `(site)` y lleva `noindex`. | Es una herramienta interna; no debe heredar el header ni el footer del sitio. |

## Ronda de corrección 1 (revisión UX, 15/11/2026)

| # | Decisión | Por qué |
|---|---|---|
| R1 | Cada combinación de `lib/contrast.ts` declara cómo se muestra (`muestra: texto · foco · borde · celda`). En `/design-system` solo las de `texto` se pintan como texto («Aa»); el foco se muestra como anillo, el borde como input y la celda como medidor. Las 5 prohibidas son swatches sin texto. Las muestras gráficas llevan `aria-hidden`, y al lado va el rótulo `fg / bg` en `ink` sobre blanco. | Pintar como texto un color que solo se usa en gráficos daba falsos fallos de axe y comunicaba mal el uso real. |
| R2 | El hex de cada swatch de color se muestra en el pie blanco de la tarjeta (`muted` sobre blanco, 5.58:1) y no encima del color. | `ink` sobre `alert` da 4.27:1 a 12 px. |
| R3 | La tabla de contraste va en un contenedor desplazable con `tabIndex=0`, `role="region"`, `aria-label` y foco visible. | Requisito `scrollable-region-focusable` de axe a 390 px. |
| R4 | **Sin cursiva.** `Highlight` ya no acepta `italic`: el acento es solo color. | Archivo se carga sin estilo italic y el navegador la falseaba. El §5.1 pide solo color de acento. |
| R5 | Pies de foto desde `/content`: `imagen.pie = { tipo, texto }`, generado por el script. Se pone «Hallazgo real» solo cuando la foto muestra el hallazgo (fuga de aceite, videoscopio). El resto se rotula «Fotograma de video» con lo que se ve. `PhotoFigure` ya no pone un pie por defecto. | Varias fotos son fotogramas del equipo con subtítulos quemados, y afirmar «hallazgo real» era falso. |
| R6 | Los `alt` originales que no describen la imagen se reemplazan por descripciones literales (choques ocultos, problemas documentarios, kilometraje200k = una llanta, airbag = interior). Queda anotado en PENDIENTES. | El `alt` debe describir lo que se ve, no lo que el sitio viejo afirmaba. |
| R7 | `imagen.posicion` (object-position) más recorte 2:1 en el specimen de fotos, para dejar fuera los subtítulos quemados. `problema.muestraHallazgo` filtra qué fotos se usan como evidencia. | Reduce el ruido visual sin editar los archivos. |
| R8 | Patrón «revelar al entrar» (`useRevealOnView`): el estado SSR / sin JS es el final (medidor lleno). Solo en cliente, si está fuera de pantalla y no hay reduced-motion, vuelve a 0 y se llena al entrar. | Si falla JS no se muestra un dato falso (barras vacías). |
| R9 | Táctiles: los enlaces del índice y «Volver al inicio» miden `min-h-11` (44 px). | §9. |
| R10 | `PlanCard` como ficha de inspección: código «PLAN 03 / 05» en mono (por orden en la escalera; lector: «Plan 03 de 05»), cabecera con cuadrícula sutil y regla fina, precio vigente de 44 px en mono con «S/» alineado arriba, tachado de 15 px en `muted` con «Antes» en sr-only, y la línea del tachado reservada para alinear tarjetas sin precio anterior. Los ítems van como renglones numerados (01, 02…) con separadores finos y un check al final. | Que no parezca un pricing SaaS genérico. No se añadió ningún dato. |
| R11 | `LogoWall` en grilla con subgrid (columnas y filas): placas 5:3 idénticas y cabeceras alineadas. Los logotipos apaisados ocupan un área óptica de 68 % × 40 % y los emblemas, de 68 % × 76 %, centrados. El emblema del Rally (círculo blanco sobre cuadrado negro) va sobre placa oscura. | Tamaño óptico parejo; antes LAUNCH/Autel quedaban apilados y el Rally se veía diminuto. |
| R12 | axe-core se usa **fuera del repo** (carpeta temporal) para verificar, sin añadir dependencias. La suite e2e con `@axe-core/playwright` sigue siendo de la Fase 6. | La revisión pide no instalar dependencias nuevas de runtime. |

## Contraste (WCAG 2.2 AA)

Generado con `npm run check:contrast -- --md` a partir de `lib/contrast.ts`. Los ratios no cambiaron en la ronda 1; lo que cambió es cómo se muestran en /design-system (R1). El script falla si alguna combinación en uso no llega a su mínimo o si `globals.css` deja de coincidir con `lib/tokens.ts`.

| Uso | Primer plano | Fondo | Ratio | Mínimo | Resultado |
|---|---|---|---|---|---|
| Texto principal sobre claro | `ink` #0B1214 | `paper` #F5F6F3 | 17.43:1 | 4.5:1 | ✅ Cumple |
| Texto secundario sobre claro | `muted` #5C6B6A | `paper` #F5F6F3 | 5.14:1 | 4.5:1 | ✅ Cumple |
| Enlaces y palabras clave sobre claro | `brand-deep` #00727E | `paper` #F5F6F3 | 5.22:1 | 4.5:1 | ✅ Cumple |
| Mensajes de error sobre claro | `alert-deep` #B8392A | `paper` #F5F6F3 | 5.29:1 | 4.5:1 | ✅ Cumple |
| Texto en tarjetas blancas | `ink` #0B1214 | `white` #FFFFFF | 18.90:1 | 4.5:1 | ✅ Cumple |
| Texto secundario en tarjetas blancas | `muted` #5C6B6A | `white` #FFFFFF | 5.58:1 | 4.5:1 | ✅ Cumple |
| Texto principal sobre oscuro | `paper` #F5F6F3 | `ink` #0B1214 | 17.43:1 | 4.5:1 | ✅ Cumple |
| Texto sobre superficie oscura secundaria | `paper` #F5F6F3 | `ink-2` #16211F | 15.23:1 | 4.5:1 | ✅ Cumple |
| Texto secundario sobre oscuro | `ink-muted` #8E9C9A | `ink` #0B1214 | 6.64:1 | 4.5:1 | ✅ Cumple |
| Texto secundario sobre ink-2 | `ink-muted` #8E9C9A | `ink-2` #16211F | 5.80:1 | 4.5:1 | ✅ Cumple |
| Acento / palabra clave sobre oscuro | `brand` #04ADBF | `ink` #0B1214 | 6.96:1 | 4.5:1 | ✅ Cumple |
| Acento sobre ink-2 | `brand` #04ADBF | `ink-2` #16211F | 6.08:1 | 4.5:1 | ✅ Cumple |
| Mensajes de error sobre oscuro | `alert-soft` #F08A78 | `ink` #0B1214 | 7.75:1 | 4.5:1 | ✅ Cumple |
| Botón primario (texto ink sobre brand) | `ink` #0B1214 | `brand` #04ADBF | 6.96:1 | 4.5:1 | ✅ Cumple |
| Botón WhatsApp (texto ink) | `ink` #0B1214 | `whatsapp` #25D366 | 9.53:1 | 4.5:1 | ✅ Cumple |
| Badge «Más elegido» sobre claro | `paper` #F5F6F3 | `brand-deep` #00727E | 5.22:1 | 4.5:1 | ✅ Cumple |
| Etiqueta de semáforo ámbar | `ink` #0B1214 | `warn` #E0A100 | 8.34:1 | 4.5:1 | ✅ Cumple |
| Anillo de foco sobre claro | `brand-deep` #00727E | `paper` #F5F6F3 | 5.22:1 | 3:1 | ✅ Cumple |
| Anillo de foco sobre oscuro | `brand` #04ADBF | `ink` #0B1214 | 6.96:1 | 3:1 | ✅ Cumple |
| Borde de inputs sobre claro | `muted` #5C6B6A | `paper` #F5F6F3 | 5.14:1 | 3:1 | ✅ Cumple |
| Borde de inputs sobre oscuro | `ink-muted` #8E9C9A | `ink` #0B1214 | 6.64:1 | 3:1 | ✅ Cumple |
| Celda de medidor verde sobre claro | `ok` #2E9E5B | `paper` #F5F6F3 | 3.14:1 | 3:1 | ✅ Cumple |
| Celda de medidor ámbar sobre oscuro | `warn` #E0A100 | `ink` #0B1214 | 8.34:1 | 3:1 | ✅ Cumple |
| Celda de medidor rojo sobre claro | `alert` #D6452F | `paper` #F5F6F3 | 4.07:1 | 3:1 | ✅ Cumple |
| Celda de medidor rojo sobre oscuro | `alert` #D6452F | `ink` #0B1214 | 4.28:1 | 3:1 | ✅ Cumple |
| Celda de medidor verde sobre oscuro | `ok` #2E9E5B | `ink` #0B1214 | 5.54:1 | 3:1 | ✅ Cumple |

**Combinaciones prohibidas** (no cumplen AA para texto):

| Combinación | Ratio | Regla |
|---|---|---|
| `brand` sobre `paper` | 2.50:1 | Brand como texto sobre claro → usar brand-deep |
| `white` sobre `whatsapp` | 1.98:1 | Texto blanco sobre verde WhatsApp → usar ink |
| `white` sobre `brand` | 2.71:1 | Texto blanco sobre brand → usar ink |
| `line` sobre `paper` | 1.21:1 | line solo como divisor decorativo, no como borde de input |
| `warn` sobre `paper` | 2.09:1 | Ámbar como texto o celda sobre claro → acompañar siempre de cifra en ink |
