# QA · Fase 6 — Pruebas, accesibilidad, rendimiento y entrega

Fecha: 16/11/2026 (hora de Lima) · Rama `master` · Next 15.5 · Lighthouse CI 0.16.1 (Lighthouse 13.6.0) · Playwright 1.65 · axe-core vía `@axe-core/playwright`.

Todo se ejecutó en local contra `next start` (puerto 3921). No se desplegó nada y no se envió el sitio a servicios externos.

## 1. Resumen

| Verificación | Resultado |
|---|---|
| `npm run check` (contraste, datos, tsc, ESLint) | ✅ EXIT 0 |
| `npm run check:build` (build + `check:paginas` + `check:seo` + `check:schema`) | ✅ EXIT 0 · 46 páginas, 0 duplicados de title/description, JSON-LD 0 errores / 0 avisos |
| `npm run test:e2e` · build **preview** | ✅ **42 pasan, 0 fallan**, 4 omitidas a propósito (pruebas solo-móvil en escritorio y viceversa) · 53 s |
| `npm run test:e2e` · build **producción** | ✅ **42 pasan, 0 fallan**, 4 omitidas · 50 s |
| axe (WCAG 2.0/2.1/2.2 A-AA + best-practice), integrado en la suite | ✅ **0 violaciones de cualquier nivel** en 48 rutas × 2 viewports + menú móvil abierto |
| Lighthouse CI móvil, build de producción, 5 URLs × 3 corridas | ✅ **100 / 100 / 100 / 100** en las 5 URLs (mediana) · todas las aserciones pasan |
| URLs antiguas (`check:redirecciones`) | ✅ 113/113 (82 × 301 en un salto, 30 × 410, 1 × 200) |
| `[PENDIENTE CLIENTE]` | ✅ amarillo en preview, neutro en producción (verificado por la suite en ambos builds) |

## 2. Suite E2E (`e2e/`, 46 pruebas en 7 archivos; proyectos «movil» 390×844 y «escritorio» 1280×900)

| Archivo | Qué comprueba |
|---|---|
| `navegacion.spec.ts` | Las 46 rutas del sitemap: 200, un solo H1, title «… \| DiagnostiCAR Lima», canonical absoluto, sin desborde horizontal y **sin errores de consola ni de JS**. Todos los enlaces internos del header y del footer responden 200 sin redirección. Migas visibles con «Inicio» y `aria-current`. |
| `whatsapp.spec.ts` | En **todas** las rutas, cada enlace `wa.me` usa el número **51923374470** y un texto de la lista permitida (§3: reserva genérica, reserva por servicio y mensajes propios de consejos, venta, cobertura y FAQ). Cada ficha, artículo y guía lleva el mensaje de **su** servicio. Los CTA abren en pestaña nueva con `noopener` y registran `whatsapp_click` en `dataLayer` (con consentimiento). |
| `formularios.spec.ts` | Consulta por placa (home y `/guia/consulta-placa-gratis`): errores con `aria-invalid` y foco en el primer campo, máscara `ABC-123`, envío y enlace de WhatsApp con placa y celular. Contacto: errores, correo inválido, éxito. **Libro de Reclamaciones**: ≥15 campos obligatorios marcados, foco en «Nombre», llenado completo → «Envío simulado correctamente»; **sin JavaScript** el servidor valida y devuelve los errores. |
| `menu-movil.spec.ts` | Menú móvil como diálogo modal: `aria-expanded`, foco atrapado tras 40 Tab, Escape cierra y devuelve el foco, navegación a ficha y a Guía, barra inferior y CTA del menú. Mega-menú de escritorio: abre y cierra con Escape. |
| `errores-redirecciones.spec.ts` | 404 (estado, H1, noindex, buscador filtra «antecedentes», CTA). Las 30 rutas 410 con `x-robots-tag: noindex`. Las 85 redirecciones de `lib/redirecciones.ts` + blog (78 con origen distinto del destino; las otras 7 solo quitan la barra final): **301 en un salto** al destino exacto. Redirecciones clave hasta una página 200. Barra final → 301. |
| `pendientes.spec.ts` | Preview: cada `[data-pendiente]` en 13 páginas tiene fondo **#E0A100** (rgb 224,161,0) y texto de marca; ninguna marca suelta fuera de un badge. Producción: ninguna marca visible, sin amarillo. robots.txt y meta robots según el entorno. |
| `accesibilidad.spec.ts` | axe en 46 rutas + 404 + 410, en los dos viewports; falla con cualquier violación (hoy 0). axe con el menú móvil abierto. |

Salidas: `docs/capturas/fase6/e2e-preview.txt` y `e2e-produccion.txt`. Reporte HTML local en `playwright-report/` (fuera de git).

## 3. Lighthouse CI (`lighthouserc.json`, `npm run lhci:prod`)

Móvil (Moto G Power emulado, throttling simulado 150 ms RTT / 1,6 Mbps / CPU ×4), build `SITE_ENV=production`, 3 corridas por URL, mediana. Presupuestos de la §9 como aserciones: Perf ≥ 95, A11y ≥ 98, BP ≥ 95, SEO = 100, CLS ≤ 0,05 (error); LCP ≤ 2,0 s y TBT ≤ 200 ms (aviso).

| URL | Perf | A11y | BP | SEO | LCP (mediana; 3 corridas) | FCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 | 1.09 s (1.07, 1.09, 1.09) | 1.09 s | 23 ms | 0.000 |
| `/servicios` | 100 | 100 | 100 | 100 | 0.91 s (0.91, 0.91, 0.91) | 0.91 s | 62 ms | 0.000 |
| `/servicios/diagnosticar` | 100 | 100 | 100 | 100 | 0.90 s (0.90, 0.90, 0.91) | 0.90 s | 53 ms | 0.000 |
| `/guia` | 100 | 100 | 100 | 100 | 0.91 s (0.90, 0.91, 0.91) | 0.91 s | 54 ms | 0.000 |
| `/blog/cuidado-con-el-kilometraje-aprende-a-comprobarlo` | 100 | 100 | 100 | 100 | 0.91 s (0.90, 0.91, 0.91) | 0.91 s | 46 ms | 0.000 |

Los reportes se guardan en disco (`.lighthouseci/`, `upload.target: filesystem`); **no** se usa el almacenamiento público temporal de Google. Copias: `docs/capturas/fase6/lighthouse-ci-home.html`, `lighthouse-ci-ficha-diagnosticar.html`, `lighthouse-ci.md`, `lighthouse-ci.log`.

## 4. F26 · LCP móvil simulado

**Objetivo:** LCP < 2,0 s en home, una ficha y un artículo.

**Resultado:** con Lighthouse 13.6 (el de Lighthouse CI) se cumple holgadamente: **1,09 s / 0,90 s / 0,91 s**. Con el Lighthouse 12.8.2 de las fases anteriores **no** se cumple: ~2,4 s. Hay que leerlo con honestidad: la diferencia viene sobre todo del **cambio de motor de simulación** entre versiones, no de la optimización.

| Medición (móvil simulado, build producción, mediana de 3) | `/` | ficha DiagnostiCAR | artículo |
|---|---|---|---|
| LH 12.8.2 · antes (fuentes de Google) | LCP 2,56 s · FCP 1,66 s | LCP 2,19 s · FCP 1,51 s | LCP 2,66 s · FCP 1,51 s |
| LH 12.8.2 · después (fuentes a medida) | LCP 2,44 s · FCP 1,21 s | LCP 2,43 s · FCP 1,06 s | LCP 2,50 s · FCP 1,06 s |
| LH 13.6.0 · antes (commit `2e6c2b5`, worktree aparte) | LCP 1,15 s | LCP 0,91 s | LCP 0,92 s |
| LH 13.6.0 · después (Lighthouse CI) | LCP 1,09 s | LCP 0,90 s | LCP 0,91 s |

**Qué se hizo:** Inter Tight y JetBrains Mono dejaron de servirse con los subsets «latin» de Google y pasaron a ser autohospedadas con un subset a medida (latín + español + ← → ≥ ★ ✓ ✗ ×, verificado contra todo el texto del sitio), Inter recortada a wght 400–500 y sin hinting, Mono estática 500 sin ligaduras de código: **fuentes de 79 KB a 39 KB**, y la de texto se precarga porque en las fichas el LCP es un párrafo. Sin cambio visual (mismas familias y pesos). Se probó también el CSS en línea (`experimental.inlineCss`): no mejoró y se revirtió.

**Por qué LH 12 sigue en ~2,4 s:** el elemento LCP es **texto** (H1 o resumen), que se pinta junto con el FCP (en la traza real, LCP = FCP en todas las corridas). El modelo «Lantern» de LH 12 incluye en el grafo del LCP **todos los recursos que terminan antes de ese primer pintado**, también los scripts de baja prioridad. En local, los ~128 KB de JS (≈105 KB son el runtime de React y Next 15, imprescindible) terminan antes del primer pintado, así que el LCP simulado suma su descarga y su ejecución a ×4 de CPU. Prueba: bloqueando los scripts, el LCP de la ficha baja a 1,7 s. Bajar de 2,0 s con LH 12 exigiría quitar la hidratación de React (los componentes interactivos: menú, formularios, comparador, cookies), lo que degrada la funcionalidad. LH 13 modela el LCP de texto sin esa penalización y coincide con lo que ve el usuario. Los datos reales (CrUX) se revisarán tras publicar.

## 5. `[PENDIENTE CLIENTE]` por entorno

- Implementación: `components/ui/pendiente.tsx` (`<Pendiente>` y `<ConPendientes>` para marcas en medio de un texto), `lib/entorno.ts` (`NEXT_PUBLIC_SITE_ENV`, expuesto en `next.config.ts` desde `SITE_ENV`). En producción también se neutralizan las marcas dentro del JSON-LD y de `llms.txt`.
- **Preview:** badge amarillo `warn` #E0A100 con texto ink (8,34:1, en `check:contrast`). **Producción:** «Por confirmar» en el gris secundario, sin borde; el autor pendiente del blog se oculta.
- Verificado en los dos builds por `pendientes.spec.ts` y en capturas: `pendiente-preview-*.png` y `pendiente-produccion-*.png`.

## 6. Revisión visual final (390 y 1280 px)

Capturas de página completa en `docs/capturas/fase6/{home,servicios,ficha-diagnosticar,guia,blog,articulo,contacto,libro}-{390,1280}.png` (build preview). Revisadas una por una: jerarquía y espaciado coherentes con las fases 2–5, sin desbordes ni solapes, badges amarillos legibles sobre claro y oscuro, barra inferior móvil y botón flotante sin tapar contenido. (En las capturas de página completa la barra fija móvil aparece a mitad de página: es un efecto del modo «full page», no del sitio.) Las fechas del Libro se ven como mm/dd/yyyy porque el navegador de captura está en inglés; con un navegador en español se muestran dd/mm/aaaa.

## 7. Limitaciones conocidas

- **Rich Results Test** de Google y Search Console: requieren URL pública; quedan para después de publicar (el JSON-LD pasó el validador oficial de Schema.org en la Fase 5).
- Los formularios de placa y contacto guardan leads en `.data/leads.jsonl` (local); la suite agrega filas ahí en cada corrida.
- La suite necesita un build previo y Chrome del sistema (o Chromium de Playwright).
