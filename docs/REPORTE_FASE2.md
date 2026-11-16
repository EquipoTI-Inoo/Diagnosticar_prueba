# Reporte · Fase 2 — Layout y Home

Fecha: 16/11/2026 · Rama: `master`. **Me detuve aquí. No empecé la Fase 3, no desplegué, no publiqué y no hice push.**

Decisiones de Francisco aplicadas:
- Seguimos en Next 15.
- Precios en duda: los de la home 2026 (S/ 49 y S/ 549), marcados como por confirmar en `PENDIENTES.md`.
- Donde falta información va `[PENDIENTE CLIENTE]`.
- Los umbrales del semáforo y el copy redactado siguen como provisionales en `DECISIONES.md`.

## Qué hice

### Layout (`app/(site)/layout.tsx` + `components/layout/`)

- **Header fijo.** Transparente sobre el hero; al hacer scroll pasa a sólido y se compacta (de 80 a 64 px). Lleva un CTA doble: WhatsApp (secundario) y «Agendar diagnóstico» (primario).
- **Mega-menú de servicios.** Muestra los 6 servicios numerados, con «desde S/ x» o `[PENDIENTE CLIENTE]`, más un bloque que lleva a la comparativa. Se maneja con teclado: Enter lo abre, Tab entra en él, y Escape o un clic fuera lo cierran y devuelven el foco.
- **Móvil.** Header compacto con logo, WhatsApp y menú. El menú es un diálogo a pantalla completa con el foco atrapado.
- **Barra inferior fija en móvil** con «WhatsApp» y «Ver precios». En escritorio hay un **botón flotante de WhatsApp**.
- **Footer.**
  - 4 columnas: Servicios, Aprende, Empresa y Contacto.
  - Redes y el grupo de Facebook (URL `[PENDIENTE CLIENTE]`).
  - Libro de Reclamaciones con un ícono lineal: no existe el ícono oficial en la fuente, así que quedó en PENDIENTES.
  - Razón social y RUC, «Preferencias de cookies» y la marca de agua grande del logotipo.
- **Banner de cookies** con Aceptar, Rechazar y Configurar (Analítica y Publicidad). El consentimiento es real:
  - Sin una elección guardada, `track()` no envía nada.
  - GTM solo se carga con *analítica*; Meta Pixel y TikTok Pixel solo con *publicidad*, y únicamente si su ID está configurado (hoy no lo está: `[PENDIENTE CLIENTE]`).
  - Si el usuario retira el consentimiento, la página se recarga sin los scripts.
- **Rutas de las fases 3 y 4.** Muestran un marcador «en construcción» con `noindex`, para que el prototipo sea navegable y no haya 404 internos. Las rutas fuera del mapa del sitio sí dan 404.

### Home completa (§5.1), en ritmo oscuro/claro

1. **Hero.** El copy del §5.1 tal cual; la segunda línea del H1 va en color de acento, sin cursiva. Incluye los 2 CTA, la foto real del equipo con recorte de ficha, el video con *facade* (no carga nada de YouTube hasta el clic) y la columna de 4 métricas con contador.
2. **Consulta gratis por placa** (placa, celular y privacidad). Valida los datos, registra `lead_placa` y abre WhatsApp con la placa prellenada, como pide el §5.1 mientras no haya endpoint.
3. **Problemas más comunes.** Una hoja de inspección con 7 medidores X/10, la frase-dato citable, 2 fotos reales del hallazgo, la fuente («informes propios 2024-2026») y el enlace «¿Cómo evitarlos?».
4. **Comparador** «Sin diagnóstico / Con DiagnostiCAR».
5. **Planes.** Las 5 fichas, con «Más elegido» en oscuro. En móvil y tablet van en carrusel con snap y en escritorio en una rejilla de 5. Debajo, la nota del 50 % y el enlace «Comparar todo en tabla».
6. **¿En qué etapa estás?** Las 4 etapas con barra de progreso; la 3 («Ya encontré el auto») lleva el CTA de WhatsApp.
7. **De la duda al veredicto, en 4 pasos.**
8. **Tecnología.** Texto del scrape, lista, el dato «6 escáneres» y los logos de LAUNCH y Autel.
9. **Confianza técnica.** 4 puntos con fotos propias y una línea de dato real por punto.
10. **Prueba social.** Rating 4.9, +575 reseñas, 6 reseñas con nombre, Gestión y Rally Caminos del Inca. El enlace a la ficha de Google queda `[PENDIENTE CLIENTE]`.
11. **Tips antes de comprar.** Los 3 reels con su miniatura real, enlazados a Instagram.
12. **FAQ.** Las 5 de la home, más el enlace a `/preguntas-frecuentes`.
13. **CTA final.** Los 2 botones de WhatsApp (el segundo con el texto exacto de la fuente), el teléfono y la cobertura sin recargo.

### Contenido y datos

- `content/home.ts` tiene el copy de la Home validado con Zod.
- `content/medios.ts` lo genera el script desde la fuente: los reels salen del JSON, cruzados con `raw/home.html`; el ID de YouTube, de `raw/servicio-diagnosticar.html`; y las fotos de confianza llevan pies honestos.
- `npm run check:datos`: todas las cifras de `/content` existen en `contenido.json`.
- En PENDIENTES se añadieron:
  - IDs de pixels.
  - Fotos reales para «Confianza».
  - Certificaciones de los técnicos.
  - Ícono oficial del Libro de Reclamaciones.
  - Validación del copy de la Fase 2.

### Fotos que no usé (§6)

El sitio actual ilustra «Confianza técnica» con 3 imágenes (`fg-min`, `gh-1` y `Diseno-sin-titulo-6`) que parecen de banco de imágenes o generadas con IA: un mecánico genérico, unos guantes haciendo el gesto de OK y un volante envuelto en plástico. No las usé. En su lugar puse fotos propias: el equipo, el videoscopio, una página del informe de ejemplo de 2022 y las camionetas con marca. Está anotado en DECISIONES (F12) y en PENDIENTES.

## Cómo verlo

```bash
npm install
npm run dev                      # http://localhost:3000
# producción (noindex por defecto):
npm run build && npm start
# producción indexable (para medir SEO en Lighthouse):
SITE_ENV=production npm run build && npm start
```

Para ver el banner de cookies otra vez, borra `dc-consent` del localStorage o usa «Preferencias de cookies» en el footer.

## Criterios de aceptación

| Criterio | Estado | Evidencia |
|---|---|---|
| Home fiel al copy | ✅ | Están los 13 bloques del §5.1 con su copy. Las únicas desviaciones son la sección de problemas como hoja de inspección en vez de 7 tarjetas con foto (F11), por honestidad de las fotos, y el copy añadido que figura como provisional en DECISIONES. |
| Todos los CTA de WhatsApp con mensaje prellenado por servicio y evento `track` | ✅ | Playwright: los **16 enlaces `wa.me`** de la Home llevan `?text=`, con 7 mensajes distintos (uno por cada uno de los 5 planes, el general y el de «consejos gratis»). Un clic, con consentimiento, envía `{event: "whatsapp_click", servicio: "DiagnostiCAR", ubicacion: "home-planes"}`; sin consentimiento, `dataLayer` queda vacío. |
| Lighthouse móvil cumple §9 | ⚠️ **Casi** | Ver la tabla siguiente. Performance, Accesibilidad, Buenas prácticas, SEO y CLS cumplen. **El LCP simulado oscila entre 1.9 y 2.7 s** frente al objetivo de < 2.0 s. |
| Se ve bien en 360, 768 y 1280 px, con capturas | ✅ | 13 capturas en `docs/capturas/fase2/`: primera pantalla con banner, página completa, header compacto sobre planes, mega-menú o menú móvil, y banner en «Configurar». En las capturas de página completa oculté la barra móvil y el botón flotante para que no se repitan; aparecen en las demás. |

### Lighthouse (móvil, throttling simulado de 4G, Chrome headless local)

| Corrida | Performance | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| 1 (`SITE_ENV=production`) | 96 | 100 | 100 | 100 | 1.9 s | 0 | 200 ms |
| 2 (`SITE_ENV=production`) | 96 | 100 | 100 | 100 | 2.7 s | 0 | 20 ms |
| 3 (`SITE_ENV=production`) | 98 | 100 | 100 | 100 | 2.3 s | 0 | 30 ms |
| Preview (noindex, por defecto) | 97 | 100 | 100 | 66 | 2.2 s | 0 | 120 ms |

Objetivos del §9: Performance ≥ 95 ✅, Accesibilidad ≥ 98 ✅, Buenas prácticas ≥ 95 ✅, SEO = 100 ✅ (solo con `SITE_ENV=production`: en preview el `noindex` es intencional), CLS < 0.05 ✅, LCP < 2.0 s ⚠️. INP no se mide en una carga de laboratorio; el TBT, que sirve de indicador, está entre 20 y 200 ms.

**Sobre el LCP.** El elemento LCP es el H1 del hero, que es texto. Lighthouse lo calcula en simulación con todo lo que se descargó antes de pintarlo en la carga real, y hoy eso es básicamente el runtime de Next 15 y React (~100 KB comprimidos) más el HTML.

Lo que hice (DECISIONES F17, F20):
- Pasé Archivo de 90 KB a 11.7 KB.
- Quité la precarga de las fuentes de texto y de la foto del hero.
- Añadí un favicon (eliminó un 404).
- Probé `inlineCss` y lo descarté.

Con eso pasamos de 3.0 s a 1.9–2.7 s. Bajar de 2.0 s de forma estable probablemente requiere recortar el JS del cliente, por ejemplo convertir el header en un componente de servidor con islas más pequeñas. **Propongo revisarlo en la Fase 6 (QA, con Lighthouse CI y varias corridas)**, salvo que prefieras atacarlo antes.

### Otras verificaciones

- **axe-core 4.14** (`wcag2a/aa`, `wcag21a/aa`, `wcag22aa`, `best-practice`): **0 violaciones** en `/` a 360, 768 y 1280 px, con el banner visible y sin él. También dio 0 en un marcador (`/servicios`) y en `/design-system`.
- **Consentimiento con IDs de prueba** (build temporal con `NEXT_PUBLIC_GTM_ID`, `META` y `TIKTOK` falsos, y la red de terceros bloqueada):
  - Antes de decidir: 0 scripts y 0 peticiones a terceros.
  - Solo analítica: carga solo GTM.
  - Al recargar, se respeta la elección.
  - Con publicidad: se suman Meta y TikTok.
  - Al rechazar: se recarga sin scripts.
- **Pruebas funcionales (19/19 en verde):**
  - Banner en la primera visita; Rechazar y Configurar funcionan, y las preferencias se reabren desde el footer.
  - Mega-menú con teclado (Enter, Tab y Escape).
  - Formulario de placa: errores con el formulario vacío, error si el celular no empieza en 9, y apertura de `wa.me/51923374470` con «…de la placa ABC-123. Mi celular: 987654321».
  - Evento `lead_placa`.
  - En móvil: la barra inferior es visible y el botón flotante está oculto; el menú atrapa el foco y Escape devuelve el foco al botón.
- `npm run check` (contraste, datos, `tsc` y ESLint) y `npm run build` pasan sin errores ni advertencias. La Home pesa 2.65 kB más 120 kB de JS compartido.

Playwright, axe y Lighthouse se ejecutaron **fuera del repo** (carpeta temporal), así que no añadí dependencias. La suite e2e dentro del proyecto es de la Fase 6.

## Commits de la Fase 2

```
e4fbb94 docs: decisiones y capturas 360/768/1280 de la Fase 2
4ada482 feat: marcadores noindex para las rutas de las fases 3 y 4
a3c171d feat(home): Home completa §5.1 con los 13 bloques
f6b6875 feat(layout): header con mega-menú, footer, barra móvil, WhatsApp flotante y cookies
8ca6747 feat(lib): consentimiento real en track(), indexación por entorno y wa.me puro
1dd5b38 perf(fonts): Archivo estática wdth 87.5/wght 800 subset latín y sin preload de texto
4e886d5 feat(content): copy de la Home, medios desde la fuente y rutas planificadas
```

Más el commit de este reporte. Verifiqué el build y los checks en el último commit; algunos commits intermedios podrían no compilar por sí solos. No toqué `docs/capturas/fase1/`, que es del revisor y sigue sin versionar.

## Dudas y pendientes para Francisco

1. **LCP < 2.0 s:** ¿lo dejamos para la Fase 6 o lo atacamos antes? (ver arriba).
2. **Fotos de «Confianza técnica»:** ¿confirmas que no usemos las 3 imágenes que parecen de banco o IA? ¿Hay fotos reales de técnicos trabajando y de un informe actual?
3. **Copy provisional** (listado al final de la sección de Fase 2 en DECISIONES): sobre todo el titular del comparador, «Lo que dice el vendedor contra lo que dicen los datos.».
4. **«Desde S/ x» en el mega-menú:** el documento lo pide así, pero los precios son fijos y no tarifas que arrancan en ese monto. ¿Prefieres mostrar solo «S/ x»?
5. **Datos que siguen pendientes y se ven en la Home o el footer:** horario, email, URL de la ficha de Google, URL del grupo de Facebook, @ de TikTok, certificaciones de los técnicos, IDs de GTM y de los pixels, logo en SVG e ícono oficial del Libro de Reclamaciones.
6. El formulario de placa pide el celular, pero hoy solo se usa dentro del mensaje de WhatsApp. ¿Mantenemos el campo, como pide el §5.1, o lo quitamos hasta tener endpoint?

---

## Ronda de corrección 1

Fecha: 16/11/2026. Sigo en la Fase 2: no empecé la Fase 3, no desplegué, no publiqué ni hice push. No toqué `docs/capturas/fase1/`.

### Qué cambió

| # | Pedido | Cambio | Verificación |
|---|---|---|---|
| 1 | **Logo real (obligatorio)** | `components/ui/logo.tsx` reescrito: props `on="dark"\|"light"` y `mark="full"\|"isotipo"`, `next/image` con el ancho y alto reales de cada archivo, alt «DiagnostiCAR» y `sizes` ajustado; ya no existe la prop `wordmark` ni ningún texto tipográfico. **Header** (escritorio, móvil y diálogo del menú): logo completo `dark`, de 56 px de alto con el header de 80 px y de 48 px compacto y en móvil. **Footer**: logo completo `dark` de 72 px. **Marca de agua**: el logo real completo, al 7 % de opacidad, grande (78 % del ancho, máx. 880 px), decorativo y `aria-hidden`. **/design-system**: las 3 variantes (dark sobre ink, light sobre paper, isotipo). Borré `public/logos/logosaaa-02-2.*`. No modifiqué los archivos que preparaste ni los íconos de `app/`. | `rg -n "wordmark\|Diagnosti</\|tspan" app components` no devuelve nada. Revisé las capturas `home-1280-04-header-logo`, `-05-mega-menu`, `-06-footer`, `home-390-01` y `home-390-04`. En móvil el logo completo se lee a 48 px, así que no hizo falta el isotipo. |
| 1 · docs | DECISIONES, ENTENDIMIENTO, REPORTE_FASE1, PENDIENTES | Eliminé S9 y F5 y añadí **F21 «Logo real»**: fuente, resolución, las 3 variantes, cómo se generaron, dónde se usa cada una y que el SVG sigue `[PENDIENTE CLIENTE]`. En ENTENDIMIENTO (línea 27) y REPORTE_FASE1 dejé una nota de que el logotipo tipográfico fue reemplazado. En PENDIENTES, el logo SVG y la versión oficial para fondo claro siguen pendientes. | — |
| 2 | Fotos con texto quemado | Nuevo campo `imagen.escala` en `/content`: un zoom con origen en `posicion`, declarado por el script sin editar los archivos. **Videoscopio** (en Problemas y en Confianza 02): el subtítulo ocupa el 86–100 % inferior; con zoom 1.25 desde arriba se ve el 80 % superior. **Reels 1 y 2** (Tips): tenían el subtítulo a ~66–78 % de alto, el caption de Instagram y una franja negra a la derecha; con zoom 1.4 desde la esquina superior izquierda quedan fuera. Revisé el resto de fotos de la Home (fuga, equipo, informe, camionetas y reel 3): no tienen texto quemado. | Medí la posición del texto en cada imagen y revisé las capturas. |
| 3 | Precios desalineados | `PlanCard` con `grid-rows-subgrid` desde 1024 px: el código, el nombre, el precio (con la fila del tachado siempre reservada), «Incluye» y los botones caen a la misma altura en las 5 tarjetas. Los botones usan el tamaño nuevo `sm` (44 px con o sin flecha). También corregí un efecto colateral: en el carrusel móvil el precio quedaba alineado a la derecha. | Medido con Playwright: «Incluye» en y = 342 y los botones en y = 903 y 957 en las 5 tarjetas a 1280 px; a 1024 px, 274, 981 y 1035. |
| 4 | Contadores | Solo se animan los enteros (+6,000, +575, 100 %). La calificación 4.9 se muestra fija en el hero y en reseñas. | Muestreé 14 veces durante la animación: siempre «4.9». |
| 5 | TikTok | `https://vt.tiktok.com/ZSPVKqXRd/`, leído de `raw/venta-sin-consignar.html`. El script verifica que el código coincida con el del JSON. El @usuario sigue en PENDIENTES. | `content/negocio.ts` y PENDIENTES actualizados. |
| 6 | LCP < 2.0 s | Ver la siguiente sección. | — |

### LCP: qué probé

| Medición (móvil, Lighthouse 12) | Perf. | Acc. | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Preview, throttling **simulado**, corrida 1 | 98 | 100 | 100 | 66* | 2.4 s | 0 | 30 ms |
| Preview, simulado, corrida 2 | 96 | 100 | 100 | 66* | 2.7 s | 0 | 20 ms |
| Preview, simulado, corrida 3 | 98 | 100 | 100 | 66* | 2.3 s | 0 | 30 ms |
| `SITE_ENV=production`, simulado (3 corridas) | 98 · 98 · 98 | 100 | 100 | 100 | 2.3 · 2.3 · 2.3 s | 0 | 20–40 ms |
| `SITE_ENV=production`, throttling **real** (`--throttling-method=devtools`, 2 corridas) | 98 · 98 | 100 | 100 | 100 | **1.7 · 1.7 s** | 0.002 | 90–100 ms |
| Tras los últimos ajustes, preview simulado (2 corridas) | 96 · 98 | 100 | 100 | 66* | 2.7 · 2.3 s | 0 | 20–30 ms |

\* En preview el `noindex` es intencional; con `SITE_ENV=production` el SEO es 100.

- **Ya estaba hecho:** Archivo estática de 11.7 KB, que es la **única** fuente precargada (comprobado en el `<head>`). Sin preload de Inter Tight ni JetBrains Mono, foto del hero sin preload, favicon.
- **Diagnóstico:** el elemento LCP es el H1, que es texto. En la carga real el primer pintado ocurre a ~200 ms, *después* de que ya se descargaron el CSS (10 KB) y todo el JS de Next y React (~120 KB). Por eso el modelo simulado de Lighthouse los suma al LCP. Con throttling real el LCP es **1.7 s**: el objetivo se cumple en una carga real limitada, pero no en la simulación.
- **Probado y descartado:** `experimental.inlineCss` (F20): no mejoró y el HTML creció.
- **Lo que queda no es un cambio acotado:** el HTML pesa 39 KB comprimidos, la mitad es el payload RSC de Next. Habría que recortarlo y convertir el header en un componente de servidor con islas de cliente. **Lo dejo para la Fase 6**, como pediste para este caso (DECISIONES F26).

### Verificación final

- `npm run check` (contraste, datos, `tsc` y ESLint) y `npm run build`: ✅ sin errores ni advertencias.
- axe-core 4.14 (`wcag2a/aa`, `wcag21a/aa`, `wcag22aa`, `best-practice`): **0 violaciones** en `/` a 360, 768 y 1280 px, con el banner visible y sin él, y en `/design-system` a 390 y 1280 px.
- Pruebas funcionales: 19/19 en verde. Incluyen WhatsApp con mensaje en los 16 enlaces, el consentimiento, el mega-menú y el menú móvil con teclado, y el formulario de placa.
- **Capturas regeneradas** en `docs/capturas/fase2/` (19 archivos):
  - 360, 390, 768 y 1280 px: primera pantalla con banner, página completa y planes con el header compacto.
  - Menú móvil a 360, 390 y 768 px.
  - Banner en «Configurar» a 360 px.
  - A 1280 px, además: `home-1280-04-header-logo`, `home-1280-05-mega-menu` y `home-1280-06-footer`.

  En las capturas de página completa oculté la barra móvil y el botón flotante para que no se repitan. En la del footer oculté también el header fijo.

### Commits de esta ronda

```
f33646f docs: capturas de la Fase 2 (ronda 1) en 360/390/768/1280
0f883a7 fix(planes): precio alineado a la izquierda en el carrusel móvil
b0b2e7a fix(logo): marca de agua del footer completa y logo del menú móvil sin deformar
d635509 docs: logo real (F21) en lugar del logotipo tipográfico y decisiones F22–F26
ce9d560 fix(contador): no anima cifras con decimales (calificación 4.9)
9c8a470 fix(planes): precio, «Incluye» y botones alineados entre tarjetas con subgrid
cc46a96 fix(check): check:datos ignora el zoom de recorte de imágenes
5db9378 fix(fotos): recorte sin subtítulos quemados (videoscopio y reels) y TikTok vt.tiktok.com de la fuente
3dad0d8 fix(logo): usa solo el logo real (dark, light e isotipo) y elimina el logotipo tipográfico
```

Más un commit de formato y el de esta sección. Nota sobre la autoría: desde `d635509` los commits salen como `asesoria <prototipo@localhost>`. Un hook de privacidad de este entorno bloqueó el uso del email de la cuenta en la línea de comandos. Si quieres unificar la autoría, se puede reescribir antes de subir el repo.

### Pendientes y dudas

1. **LCP en la simulación de Lighthouse:** queda para la Fase 6 (header como componente de servidor y recorte del payload RSC). ¿De acuerdo?
2. **Logo SVG** y versión oficial para fondo claro: siguen `[PENDIENTE CLIENTE]`. El laptop gris claro (#E4E3E2) del original se ve tenue sobre `paper`.
3. Siguen abiertas las dudas 2–6 de la entrega anterior: fotos de «Confianza», copy provisional, «desde S/ x» en el mega-menú y el celular en el formulario de placa.
