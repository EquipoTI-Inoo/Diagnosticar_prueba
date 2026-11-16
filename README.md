# DiagnostiCAR — prototipo web

Prototipo navegable del nuevo sitio de DiagnostiCAR (Diagnosticar S.A.C.). La instrucción completa está en `docs/PROMPT_MAESTRO.md`.

## Requisitos y arranque

```bash
npm install
npm run dev            # http://localhost:3000  ·  sistema de diseño en /design-system
npm run build          # build estático de producción
```

## Scripts

| Script | Qué hace |
|---|---|
| `npm run import:content` | Regenera `content/*.ts` y `docs/PENDIENTES-fuente.md` desde `docs/fuente/contenido.json`. |
| `npm run check:contrast` | Verifica el contraste AA de los tokens y su sincronía con `globals.css`. |
| `npm run check:datos` | Comprueba que toda cifra de `/content` exista en `contenido.json`. |
| `npm run check` | Contraste + datos + `tsc` + ESLint. |

## Estructura

- `app/` — rutas (App Router). `app/globals.css` contiene los tokens de Tailwind v4.
- `components/ui/` — componentes base del sistema de diseño.
- `content/` — contenido tipado y validado con Zod (fuente para un futuro CMS).
- `lib/` — tokens, contraste, WhatsApp, analítica y validaciones.
- `scripts/` — importación de contenido y verificaciones.
- `docs/` — fuente (`fuente/`), decisiones, pendientes y reportes por fase.
