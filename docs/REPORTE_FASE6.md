# Reporte · Fase 6 — QA y entrega final

Fecha: 16/11/2026 · Rama: `master`. **Me detuve aquí. No desplegué, no publiqué, no hice push y no contacté al cliente.** El build que queda en `.next` es el de **preview** (`noindex`).

Programada directamente por Dev Web UX, sin Claude Code. Detalle de pruebas y puntuaciones en `docs/QA.md`; pendientes del cliente en `docs/PENDIENTES.md`.

## Qué se entrega

Prototipo navegable completo del nuevo sitio de DiagnostiCAR (Next.js 15 + TypeScript + Tailwind v4):

- **46 páginas indexables**: home, 6 fichas + listado de servicios, vende tu auto, cómo funciona, cobertura, informe de ejemplo, contacto, tecnología, guía + 3 subpáginas, blog + 21 artículos, nosotros, preguntas frecuentes, 3 legales y Libro de Reclamaciones. Además: 404 útil, 30 rutas 410, 85 redirecciones 301 y `/design-system` (interno).
- **Conversión**: WhatsApp con mensaje por servicio en todas las páginas, consulta gratis por placa, contacto y Libro de Reclamaciones (envío simulado) con validación accesible en cliente y servidor, también sin JavaScript.
- **SEO/GEO/AEO**: metadata única por página, OG, sitemap, robots por entorno, JSON-LD validado, `llms.txt`, resúmenes-respuesta.
- **Calidad**: suite Playwright + axe, Lighthouse CI con presupuestos, scripts de verificación de datos, contraste, SEO, schema y redirecciones.

## Resultados (detalle en `docs/QA.md`)

| Prueba | Resultado |
|---|---|
| `npm run check` · `npm run check:build` | ✅ EXIT 0 |
| `npm run test:e2e` (46 pruebas, 390 y 1280 px) | ✅ preview **42 pasan / 0 fallan** (4 omitidas por diseño) · producción **42 / 0** |
| axe en la suite | ✅ 0 violaciones en 48 rutas × 2 viewports + menú móvil |
| Lighthouse CI móvil (5 URLs, build producción) | ✅ 100/100/100/100 en las 5 · LCP 0,90–1,09 s |
| URLs antiguas | ✅ 113/113 con el código correcto |
| `[PENDIENTE CLIENTE]` | ✅ amarillo en preview, neutro en producción |

**F26 (LCP):** con Lighthouse 13.6 el LCP simulado está bajo 2,0 s en home, ficha y artículo (1,09 / 0,90 / 0,91 s). Con Lighthouse 12.8 sigue en ~2,4 s porque su modelo suma el JS de React/Next al LCP de texto. La optimización de fuentes (79 → 39 KB) bajó el FCP de LH 12 de ~1,5 a ~1,1 s. La explicación completa y las mediciones de antes y después están en `docs/QA.md` §4.

## Commits de la fase

| Commit | Qué |
|---|---|
| `d9bb781` | perf(F26): Inter Tight y JetBrains Mono autohospedadas con subset a medida |
| `40410a5` | perf(F26): subset incluye ← y ≥ |
| `045a8b8` | badge `[PENDIENTE CLIENTE]` amarillo en preview / neutro en producción (también JSON-LD y llms.txt) |
| `c4c07b2` | suite Playwright con axe integrado |
| `3a0684e` | Lighthouse CI (`lighthouserc.json`) |
| `ce62a48` | lista final consolidada de pendientes |
| `446d924` | README y `.env.example` |
| (último) | `docs/QA.md`, este reporte y capturas de `docs/capturas/fase6/` |

## Cómo construir y ejecutar

Requisitos: Node.js 18.18+ (recomendado 20 LTS o superior), npm y, para las pruebas, Google Chrome.

```bash
npm install

# Desarrollo
npm run dev                                   # http://localhost:3000

# Preview para revisión del cliente (noindex, badges amarillos)
npm run build && npm run start                # http://localhost:3000

# Producción (lo que se publica)
SITE_ENV=production npm run build
SITE_ENV=production npm run start             # o el proceso Node del hosting

# Verificaciones
npm run check                                 # contraste, datos, tsc, ESLint
npm run check:build                           # build + cifras + SEO + schema
npm run build && npm run test:e2e             # suite contra preview
npm run test:e2e:prod                         # build de producción + suite
npm run lhci:prod                             # Lighthouse CI (5 URLs) con build de producción
BASE=http://localhost:3921 npm run check:redirecciones   # con el servidor en marcha en 3921
```

- **`SITE_ENV=production` se aplica en el build**, no al arrancar: sin él, el sitio publicado saldría con `noindex`, `Disallow: /` y badges amarillos. Después de `lhci:prod` o `test:e2e:prod`, vuelve a construir sin la variable si quieres un preview.
- El sitio necesita un servidor Node (`next start`): usa Server Actions (formularios), middleware (410 y barra final) y redirecciones. No es un export estático.
- Los IDs de GTM y de los píxeles van en variables de entorno (`.env.example`); sin ellos no se carga ningún tercero. Nunca subir `.env*`.
- Los leads del prototipo se guardan en `.data/leads.jsonl` (fuera de git). Antes de publicar hay que conectar el destino real (CRM, correo u hoja).

## Recomendación: Git LFS para `docs/fuente`

`docs/fuente/` pesa **~120 MB** (assets 78 MB, incluido un MP4 de 45 MB; raw 24 MB; referencias 18 MB; 132 JPG, 97 WebP, 41 PNG) y hoy está en git como objetos normales (`.git` ~118 MB, sin remoto configurado). Antes del primer push a un remoto (GitHub limita archivos a 100 MB y avisa desde 50 MB):

```bash
git lfs install
git lfs track "docs/fuente/assets/**" "docs/fuente/referencias/**" "docs/fuente/raw/**/*.{jpg,jpeg,png,webp,pdf,mp4}"
git add .gitattributes && git commit -m "chore: Git LFS para docs/fuente"
# Para sacar los binarios ya versionados del historial (REESCRIBE el historial: solo con OK de Francisco y antes de compartir el repo):
git lfs migrate import --include="docs/fuente/assets/**,docs/fuente/referencias/**" --everything
```

Alternativa más simple: dejar `docs/fuente/assets` fuera del repositorio (almacenamiento compartido) y versionar solo `contenido.json`, `contenido.md` y los HTML de `raw/`. Lo que usa el sitio ya está copiado en `public/` (`img/`, `logos/`, `docs/`); los scripts de verificación solo leen `contenido.json`.

## Capturas (`docs/capturas/fase6/`)

- Páginas finales (build preview): `{home,servicios,ficha-diagnosticar,guia,blog,articulo,contacto,libro}-{390,1280}.png`
- Pendientes por entorno: `pendiente-preview-contacto.png`, `pendiente-produccion-contacto.png`, `pendiente-preview-ficha-asesoria.png`, `pendiente-produccion-ficha-asesoria.png`
- Salidas: `e2e-preview.txt`, `e2e-produccion.txt`, `lighthouse-ci.md`, `lighthouse-ci.log`, `lighthouse-ci-home.html`, `lighthouse-ci-ficha-diagnosticar.html`, `check-redirecciones.txt`, `check-seo-schema.txt`

## Pendientes

Lista completa y agrupada en `docs/PENDIENTES.md`: datos del negocio (horario, email, redes, cifras), precios (S/ 49 y S/ 549 por confirmar, IGV, asesoría y certificación), legales (privacidad, cookies, sistema real del Libro), fotos y medios (SVG del logo, fotos de hallazgos y equipo), medición (GTM/píxeles, página de gracias, hosting), decisiones (410 del área de usuario, landings, bots de IA) y, tras publicar, Rich Results Test y Search Console.
