# Reporte · Fase 5 — SEO, GEO y AEO (§8 y §10)

Fecha: 16/11/2026 · Rama: `master`. **Me detuve aquí. No empecé la Fase 6, no desplegué, no publiqué y no hice push.**

Programada directamente por Dev Web UX, sin Claude Code. Las decisiones están en `docs/DECISIONES.md` (I1–I11) y lo pendiente en `docs/PENDIENTES.md`.

## Qué se hizo

| Área | Implementación |
|---|---|
| Metadata | `lib/seo.ts → metadatos()` en las 21 rutas: title «{Tema} \| DiagnostiCAR Lima» ≤ 60, description única ≤ 155, canonical absoluto en `https://diagnosticarperu.com`, Open Graph (es_PE, 1200×630) y Twitter `summary_large_image`. El build falla si algo excede el límite. |
| Imágenes OG | `app/opengraph-image.tsx` (global) y `og.png` estáticos para 6 fichas, 21 artículos y la guía (logo real, lema, precio cuando aplica). |
| robots / sitemap | `app/robots.ts`: `Disallow: /` salvo con `SITE_ENV=production`; en producción permite `*` y 8 bots de IA y declara el sitemap. `app/sitemap.ts`: 46 URLs. |
| Breadcrumbs | Visibles en todas las páginas internas + `BreadcrumbList` coherente (posiciones, último ítem = página actual). |
| JSON-LD (`lib/schema.ts`, schema-dts) | Entidad global `AutomotiveBusiness` + `Organization` (NAP, geo, areaServed, priceRange, slogan, RUC, sameAs; **sin horario y sin AggregateRating**) y `WebSite`; `Service` + `Offer` en fichas, `OfferCatalog` en `/servicios`, `FAQPage` solo con FAQs visibles, `HowTo` en `/como-funciona` y `/guia/checklist`, `Article` (guía) y `BlogPosting` (21). |
| GEO | `public/llms.txt` (~9 k caracteres) y `public/llms-full.txt` (~13 k), generados en `prebuild` desde el contenido. |
| AEO | Resumen-respuesta de 40–60 palabras bajo el H1 en `/servicios`, 6 fichas y 4 páginas de guía; encabezados-pregunta (FAQ de fichas, guía). |
| Redirecciones | 301 de la §4 + 21 artículos con slug nuevo + categorías y landings, en `next.config.ts`; 410 (middleware) para 30 rutas basura. Normalización de barra final con 301 en un solo salto. Tabla completa en `docs/REDIRECTS.md` (85 × 301, 30 × 410). |
| 404 | Página útil con buscador de servicios y guías y CTA de WhatsApp (`noindex, follow`). |
| Scripts | `check:seo`, `check:schema`, `check:redirecciones`, `docs:redirects`, `build:llms`, `check:build`. |

## Verificación

| Prueba | Resultado |
|---|---|
| `npm run check` + `check:build` (build + `check:paginas` + `check:seo` + `check:schema`) | EXIT 0 |
| `check:seo` | 46 páginas · 46 titles únicos · 46 descriptions únicas · sitemap 46 URLs · **0 duplicados · 0 errores**. Resúmenes AEO de 46–57 palabras. |
| `check:schema` (vocabulario oficial schema.org + reglas Google) | 46 páginas · **0 errores · 0 avisos**. |
| Validador oficial Schema.org (POST del HTML servido por `next start`) | Home, `/servicios/diagnosticar`, `/preguntas-frecuentes`, un artículo, `/como-funciona` y `/guia/checklist`: **0 errores, 0 avisos**; reconoce AutomotiveBusiness, Organization, Service, FAQPage, BlogPosting, HowTo y BreadcrumbList. |
| `structured-data-testing-tool` (preset Google) | BlogPosting de Google completo (image, publisher, author, fechas). Único ✕: la herramienta no admite `@type` múltiple (limitación suya; es JSON-LD válido). |
| Google Rich Results Test | **No ejecutado**: exige URL pública o sesión en navegador y el prototipo solo corre en local. Queda para staging/lanzamiento. |
| URLs antiguas (`contenido.json → paginas[].url`) con curl contra `next start` | **113/113 correctas**: 82 × 301 (un salto), 30 × 410, 1 × 200 (la home). Los 42 destinos responden 200. |
| robots | Preview: `Disallow: /` + `noindex, nofollow`. Producción: `Allow: /`, bots de IA, sitemap y `index, follow`. |
| Lighthouse 12.8 móvil con `SITE_ENV=production` | `/` 97/100/100/**100** · `/servicios/diagnosticar` 98/100/100/**100** · artículo 96/100/100/**100** (Perf/A11y/BP/SEO). LCP 2,2–2,7 s, CLS ≤ 0,012. |
| axe-core (WCAG 2.2 AA + best-practice) | **0 violaciones** en 48 URLs (46 del sitemap + 404 + 410) a 390 y 1280 px; sin desborde horizontal. La página 410 tenía 2 moderadas (sin `<main>`): corregidas. |

El build que queda en `.next` es el de preview (`noindex`).

## Commits

`affde17` redirecciones y REDIRECTS.md · `e2749b1` metadata por página · `e773189` imágenes OG · `cf415a1` robots y sitemap · `d35db5a` entidad global y headline · `def5da6` 404 · `bbcd0c1` llms.txt · `a1b6226` check:seo y check:schema · `3ae5f4a` og.png estables + image/publisher en BlogPosting · `da0f5d5` a11y de la 410 · docs y capturas (este commit).

## Capturas (`docs/capturas/fase5/`)

- OG: `og-global.png`, `og-servicio-diagnosticar.png`, `og-articulo.png`, `og-guia.png`
- Breadcrumbs: `breadcrumbs-servicio-{1280,390}.png`, `breadcrumbs-articulo-{1280,390}.png`
- 404 y 410: `404-1280.png`, `404-390.png`, `404-filtrado-1280.png`, `410-1280.png`
- Salidas: `check-seo.txt`, `check-schema.txt`, `check-redirecciones.txt`, `redirecciones-curl.txt`, `validacion-jsonld.txt`, `robots-preview.txt`, `robots-produccion.txt`, `lighthouse.txt`, `lighthouse-servicio-diagnosticar.html`, `axe.txt`

## Pendientes

- Rich Results Test y Search Console cuando haya URL pública.
- Horario de atención (sin `openingHours`), @usuario de TikTok para `sameAs`, IGV en los precios.
- Confirmar con el cliente: 410 del área de usuario, destino de landings de campaña, página de gracias y medición, política de bots de IA.
- Los artículos no tienen foto propia (se usa la portada tipográfica `og.png` como `image`).
- Publicar siempre con `SITE_ENV=production`.
