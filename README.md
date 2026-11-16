# DiagnostiCAR — prototipo web

Prototipo navegable del nuevo sitio de DiagnostiCAR (Diagnosticar S.A.C.). La instrucción completa está en `docs/PROMPT_MAESTRO.md`.

## Requisitos y arranque

Node.js 18.18+ (recomendado 20 LTS o superior) y npm.

```bash
npm install
npm run dev                               # http://localhost:3000 · sistema de diseño en /design-system
npm run build && npm run start            # build de PREVIEW (por defecto): noindex + badges amarillos
SITE_ENV=production npm run build         # build de PRODUCCIÓN: indexable, pendientes neutros
SITE_ENV=production npm run start
```

`SITE_ENV` se lee **en el build**: decide robots.txt, la meta robots, el aspecto de los
`[PENDIENTE CLIENTE]` (amarillo en preview, «Por confirmar» en producción) y el texto de
`llms.txt`. IDs opcionales de terceros (solo cargan con consentimiento): `NEXT_PUBLIC_GTM_ID`,
`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` (ver `.env.example`; nunca
subir `.env`).

## Scripts

| Script | Qué hace |
|---|---|
| `npm run check` | Contraste AA de tokens + cifras de `/content` contra `contenido.json` + `tsc` + ESLint. |
| `npm run check:build` | Build + `check:paginas` (cifras y precios en el HTML) + `check:seo` (titles, descriptions, canonical, OG, sitemap, AEO, duplicados) + `check:schema` (JSON-LD contra el vocabulario de schema.org). |
| `npm run test:e2e` | Suite Playwright + axe contra `next start` (requiere build previo). 390 y 1280 px. |
| `npm run test:e2e:prod` | Build de producción + suite (verifica pendientes neutros y robots indexable). |
| `npm run lhci` / `npm run lhci:prod` | Lighthouse CI (móvil, 3 corridas) en 5 URLs clave; reportes en `.lighthouseci/` (local, sin subir a ningún servicio). Usar con build de producción. |
| `npm run check:redirecciones` | Con el servidor en marcha (`BASE=http://localhost:3921`): 301/410 de todas las URLs antiguas. |
| `npm run docs:redirects` | Regenera `docs/REDIRECTS.md`. |
| `npm run build:llms` | Regenera `public/llms.txt` y `llms-full.txt` (corre solo en `prebuild`). |
| `npm run import:content` | Regenera `content/*.ts` y `docs/PENDIENTES-fuente.md` desde `docs/fuente/contenido.json`. |

La suite usa el Chrome del sistema (`channel: "chrome"`). Sin Chrome: `npx playwright install chromium`
y `PW_CHANNEL= npm run test:e2e`. Lighthouse CI busca Chrome en `CHROME_PATH`.

## Estructura

- `app/` — rutas (App Router). `app/globals.css` contiene los tokens de Tailwind v4.
- `components/ui/` — componentes base del sistema de diseño.
- `content/` — contenido tipado y validado con Zod (fuente para un futuro CMS).
- `lib/` — tokens, contraste, WhatsApp, analítica y validaciones.
- `scripts/` — importación de contenido y verificaciones.
- `e2e/` — pruebas Playwright + axe. `lighthouserc.json` — Lighthouse CI.
- `docs/` — fuente (`fuente/`), decisiones, pendientes, QA (`QA.md`) y reportes por fase.
