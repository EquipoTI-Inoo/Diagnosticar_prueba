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
