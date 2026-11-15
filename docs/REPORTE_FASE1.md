# Reporte · Fase 1 — Fundaciones y sistema de diseño

Fecha: 15/11/2026 · Rama: `master` · Ejecución no interactiva. **Me detuve aquí. No empecé la Fase 2 ni desplegué ni publiqué nada.**

## Qué hice

1. **Entendimiento y dudas** → `docs/ENTENDIMIENTO.md`: resumen en 10 líneas y 14 dudas, cada una con el supuesto que apliqué mientras tanto.
2. **Repo** con Next.js 15.5 (App Router), TypeScript 5.9, Tailwind CSS v4, ESLint (flat config) y Prettier. Dependencias de runtime: solo `next`, `react`, `lucide-react`, `clsx` y `zod`. `schema-dts` llega en la Fase 5.
3. **Tokens** en `app/globals.css` (`@theme`) y `lib/tokens.ts`: los colores del §6 más 3 tokens añadidos para cumplir AA (`ink-muted`, `alert-deep`, `alert-soft`). Además: superficies semánticas claro/oscuro, escala tipográfica fluida (H1 44→88, H2 32→56, H3 20→26, texto 17→18), radios 6/14/999, contenedor de 1200 px con gutter de 24 px, padding de sección con `clamp(64px, 10vw, 128px)`, cuadrícula de «hoja de inspección», tratamiento de foto y `prefers-reduced-motion`.
4. **Fuentes autohospedadas** con `next/font`: Archivo (variable con eje `wdth`), Inter Tight y JetBrains Mono 500, todas con subset latin y `display: swap`. `lang="es-PE"`.
5. **Contenido**: `scripts/import-content.ts` lee `docs/fuente/contenido.json`, aplica mejoras de redacción declaradas (tablas `original → pulido`, que fallan si el original cambia), valida con Zod y genera:
   - `content/negocio.ts`, `servicios.ts` (7 servicios), `faqs.ts` (14), `testimonios.ts` (10), `problemas.ts` (7, con foto real y `alt` original), `proceso.ts` (4 pasos) y `cobertura.ts` (10 distritos).
   - `docs/PENDIENTES.md` con `pendiente_cliente` (15), `inconsistencias_detectadas` (11) y las decisiones provisionales que hay que confirmar (12).
   - A mano, porque son estructura o copy y no datos: `content/navegacion.ts` (mapa del §4, etapas, footer) y `content/comparador.ts` (con la página de origen de cada frase).
   - `content/schema.ts` define los esquemas y tipos (listos para conectar un CMS).
6. **Componentes `components/ui`** (26 archivos): Button (primario con flecha en círculo, secundario, WhatsApp, enlace), WhatsAppButton (mensaje prellenado + `track('whatsapp_click', {servicio, ubicacion})`), TrackedLink, Eyebrow, Highlight, Badge (incluye semáforo), Pendiente, Price, PlanCard, FindingMeter (10 celdas en semáforo, se llena una vez al entrar en pantalla), Counter, ComparatorToggle (tabs WAI-ARIA con flechas), Stepper, DistrictChip/List, FaqAccordion (`<details>` + «+» en círculo), ReviewCard, LogoWall, Logo, TextField, PlateInput (máscara `AAA-000`), VerifiedSeal (SVG con QR ilustrativo), PhotoFigure y Section.
7. **Librerías**: `lib/whatsapp.ts` (URL exacta del §3), `lib/analytics.ts` (`track` → `dataLayer`, solo con consentimiento), `lib/validacion.ts` (placa y celular de 9 dígitos que empieza por 9), `lib/contrast.ts` y `lib/utils.ts`.
8. **`/design-system`**: 18 secciones con índice lateral. Cada componente aparece sobre claro (`paper`) y oscuro (`ink`), con datos reales de `/content`. Incluye la tabla de contraste calculada en vivo.
9. **`/`**: página temporal que enlaza al sistema de diseño (la Home completa es de la Fase 2).
10. **Assets**: las fotos de `_clave` van en `public/img/clave/`, los logos en `public/logos/` y el PDF de ejemplo en `public/docs/`. No se usó ninguna imagen del blog.
11. **Documentación**: `docs/DECISIONES.md` (38 decisiones y la tabla de contraste) y `README.md`.
12. **Commits** (5, pequeños):
    ```
    f7e1264 docs: decisiones de Fase 1 y tabla de contraste AA
    f91275c feat(ui): componentes base y página /design-system en claro/oscuro
    835fc8f feat(content): importa contenido.json a /content tipado con Zod y genera PENDIENTES
    3ba7c61 chore: andamiaje Next.js 15 + TS + Tailwind v4 con tokens y fuentes
    ad1cc47 docs: agrega prompt maestro, fuentes y resumen de entendimiento
    ```
    Más el commit de este reporte.

## Cómo verlo

```bash
npm install
npm run dev                 # abrir http://localhost:3000/design-system
# o en modo producción:
npm run build && npm start
```

Verificaciones:

```bash
npm run check               # contraste + datos + tsc + eslint
npm run import:content      # regenera /content y PENDIENTES.md desde el JSON
```

## Criterios de aceptación

| Criterio | Estado | Evidencia |
|---|---|---|
| `npm run build` sin errores | ✅ **Cumple** | Compila con lint y tipos sin errores ni advertencias, y genera 3 rutas estáticas (`/`, `/design-system`, `/_not-found`). Lo repetí en un **clon limpio** del repo (`npm ci && npm run build`) y también pasó. |
| `/design-system` navegable | ✅ **Cumple** | Lo revisé con Chrome headless a 1280 y 390 px: no hay scroll horizontal en móvil y el índice lateral es fijo en desktop. Probé con Playwright: máscara de placa (`abc123` → `ABC-123`, `a1b 234` → `A1B-234`), error accesible (`aria-invalid` + `aria-describedby` + `role=alert`), comparador con teclado (← cambia de pestaña), FAQ con Enter, y que el enlace de WhatsApp sea `https://wa.me/51923374470?text=Hola%2C%20quiero%20reservar%20mi%20diagn%C3%B3stico%20DiagnostiCAR` (idéntico al §3). |
| Contrastes documentados AA | ✅ **Cumple** | 26 combinaciones en uso, todas ≥ su mínimo (4.5:1 texto, 3:1 UI/foco/gráficos), más 5 combinaciones prohibidas documentadas. La tabla está en `docs/DECISIONES.md` y en `/design-system#contraste`. `npm run check:contrast` falla si algo baja del mínimo o si el CSS se desincroniza de `lib/tokens.ts`. |
| Ningún dato inventado (revisión manual contra JSON) | ✅ **Cumple**, con matiz | Revisé a mano los archivos generados contra el JSON y además dejé la auditoría automática `npm run check:datos`: las 78 cifras de `/content` existen en `contenido.json`. Los datos que faltan aparecen como `[PENDIENTE CLIENTE]` o `[CONFIRMAR CLIENTE]`. **Matiz:** hay copy redactado por mí (no datos) que conviene que revises: 2 taglines (Asesoría y Certificación), los textos del proceso pulidos, el texto de las etapas y las 3 frases del comparador. Todo está listado en DECISIONES C1, C2 y C11. |
| `PENDIENTES.md` inicial con `pendiente_cliente` + `inconsistencias_detectadas` | ✅ **Cumple** | `docs/PENDIENTES.md` (secciones A y B literales del JSON, más la sección C con las decisiones provisionales). |
| `scripts/import-content.ts` | ✅ **Cumple** | Es idempotente: al regenerar, el resultado es idéntico. |

### Lo que NO incluye esta fase (a propósito)

- Header con mega-menú, footer, barra inferior móvil, botón flotante de WhatsApp y banner de cookies: los pide la **Fase 2** (ver DECISIONES S13).
- Playwright, axe y Lighthouse CI como suite del proyecto (son de la Fase 6). Para revisar esta fase usé Playwright fuera del repo.
- Redirecciones, `sitemap`, `robots`, JSON-LD y `llms.txt` (Fase 5). Por ahora todo lleva `noindex`.

### Observaciones

- En la consola del navegador aparecen 404 por el *prefetch* de enlaces a rutas que todavía no existen (`/servicios/...`, `/guia/...`). Es lo esperado y desaparece al construirlas en las fases 2 a 4.
- `npm audit` muestra avisos en dependencias de desarrollo. No los forcé (`audit fix --force` cambiaría versiones mayores).
- `docs/fuente/` suma unos 120 MB al historial de git (incluye un video de 44 MB). Antes de subir el repo a GitHub conviene usar Git LFS (DECISIONES D7).
- No había identidad de git configurada, así que los commits salen como `asesoria <asesoria@inoo.pe>` (solo en cada comando; no cambié la configuración del repo). La rama de trabajo es `master`, que es la que ya existía.

## Dudas abiertas para el cliente / para ti

Las 14 dudas detalladas están en `docs/ENTENDIMIENTO.md`. Las que más afectan a la Fase 2:

1. **¿Seguimos en Next 15 o subimos a 16?** (hoy la 16 es la estable).
2. **Precios definitivos:** Plus S/ 549 o 559, Antecedentes Completo S/ 49 o 59, y si incluyen IGV.
3. **Logo SVG** (versiones para fondo claro y oscuro). Mientras no llegue, sobre claro se usa un logotipo tipográfico provisional.
4. **URL de la ficha de Google** para «Ver reseñas en Google», y permiso para usar las reseñas con nombre.
5. **Horario exacto y email oficial** (salen en el footer y en contacto).
6. ¿Te parece bien el umbral del semáforo de hallazgos (≥ 5/10 rojo, ≥ 2/10 ámbar, menos verde)?
7. ¿Validas el copy que redacté (taglines, pasos, etapas y comparador)?

---

## Ronda de corrección 1 (revisión UX)

Fecha: 15/11/2026. Sigo en la Fase 1: no empecé la Fase 2, no hice push ni añadí remotos, no desplegué y no instalé dependencias nuevas en el proyecto. No toqué `docs/capturas/`.

### Qué cambió

| # | Pedido | Cambio | Resultado |
|---|---|---|---|
| 1a | `color-contrast` (9 nodos) | Cada combinación de `lib/contrast.ts` declara su tipo de muestra (`texto`, `foco`, `borde`, `celda`). Solo las de texto se pintan como «Aa»; el resto se muestra como anillo de foco, borde de input o celdas de medidor (todo `aria-hidden`), con el rótulo `fg / bg` en `ink` sobre blanco. Las 5 prohibidas son swatches sin texto. El hex de los swatches de color pasó al pie blanco de la tarjeta. Componente nuevo: `components/design-system/contrast-sample.tsx`. | ✅ 0 nodos |
| 1b | `scrollable-region-focusable` | El contenedor de la tabla lleva `tabIndex=0`, `role="region"`, `aria-label` y foco visible (`brand-deep`). | ✅ |
| 2 | Cursiva sintética | `Highlight` ya no tiene la opción `italic` y el acento es solo color. Lo quité en `app/page.tsx` y en `/design-system` (el titular de ejemplo pone la segunda línea en color de acento, como pide el §5.1). | ✅ |
| 3 | Pies de foto honestos | Campo `imagen.pie {tipo, texto}` y `imagen.posicion` en `/content`, generados por el script. «Hallazgo real» solo para la fuga de aceite y el videoscopio; el resto dice «Fotograma de video · …». Los `alt` originales que no describían la imagen (choques ocultos, problemas documentarios, kilometraje = una llanta, airbag) se cambiaron por descripciones literales. El specimen de fotos usa solo `muestraHallazgo` (fuga, videoscopio, placas clonadas) con recorte 2:1 y `object-position` para esconder subtítulos. En la sección C de PENDIENTES se añadieron: «Fotos de hallazgos sin subtítulos quemados…» y otro pendiente sobre las fotos que no muestran su hallazgo. | ✅ |
| 4 | FindingMeter sin JS | Nuevo hook `useRevealOnView`: en SSR / sin JS el medidor sale **lleno**. En cliente vuelve a 0 solo si está fuera de pantalla y no hay reduced-motion, y se llena al entrar. Lo comprobé con Playwright: sin JS, celdas al 100 %; con JS fuera de pantalla, 0 %; tras hacer scroll, 100 %. | ✅ |
| 5 | Táctiles ≥ 44 px | Los enlaces del índice y «← Volver al inicio» miden `min-h-11` (44 px). | ✅ |
| 6a | PlanCard | Tarjeta tipo ficha: «PLAN 03 / 05» en mono (el lector lee «Plan 03 de 05»), cabecera con cuadrícula sutil y regla fina, precio vigente de 44 px en JetBrains Mono con «S/» alineado arriba, tachado de 15 px en `muted` con «Antes» en sr-only, línea del tachado reservada para alinear tarjetas, e ítems como renglones numerados 01…06 con separadores finos. La destacada sigue en oscuro con «Más elegido». No añadí ningún dato. | ✅ |
| 6b | LogoWall | Grilla con subgrid en columnas y filas: placas 5:3 idénticas y cabeceras alineadas aunque una ocupe 2 líneas. Área óptica: 68 % × 40 % para logotipos apaisados y 68 % × 76 % para emblemas, centrados. El emblema del Rally va sobre placa oscura para que se funda su cuadrado negro. LAUNCH y Autel quedan lado a lado. | ✅ |

### Verificación

- **axe-core 4.14** con las etiquetas `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice` en `/design-system` a **390 y 1280 px**: **0 violaciones**, con `prefers-reduced-motion` y sin él. También dio 0 en `/`. axe se ejecutó desde una carpeta temporal fuera del repo, así que no añadí dependencias.
- `npm run check` (contraste + datos + `tsc` + ESLint): ✅ sin errores ni advertencias.
- `npm run build`: ✅ sin errores.
- Interacciones (máscara de placa, error accesible, comparador con teclado, FAQ con Enter y URL de WhatsApp): siguen funcionando igual.
- La tabla de contraste de `DECISIONES.md` no cambió de valores (los ratios son los mismos). Se añadieron las decisiones R1–R12.

### Commits de esta ronda

```
561b4c9 docs: decisiones de la ronda de corrección 1
edb2ba6 fix(a11y): /design-system sin violaciones axe
4da637d feat(ui): PlanCard como ficha de inspección y LogoWall con placas uniformes
e4d1474 fix(ui): quita la cursiva sintética del acento en titulares
4652bee fix(ui): FindingMeter se renderiza lleno sin JS y solo anima fuera de pantalla
e14ec67 fix(content): pies de foto honestos desde /content y alt literales
e0bcda0 chore: ignora salidas del orquestador y no formatea docs ni README
```

Más el commit de esta sección. Nota: verifiqué el build y los checks en el último commit (HEAD). Algunos commits intermedios no compilan por sí solos, porque `/design-system` se actualiza en `edb2ba6`.

### Pendientes o dudas nuevas

- Las fotos de «kilometraje bajado» y «airbags reventados» no muestran su hallazgo. Se piden fotos reales al cliente (ya está en PENDIENTES).
- El emblema del Rally Caminos del Inca es un PNG cuadrado con fondo negro. Si el cliente tiene una versión con transparencia o en SVG, se vería mejor sobre cualquier placa.
