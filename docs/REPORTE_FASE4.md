# Reporte · Fase 4 — Contenido educativo, blog y legal

Fecha: 16/11/2026 · Rama: `master`. **Me detuve aquí. No empecé la Fase 5, no desplegué, no publiqué y no hice push.**

Claude Code dejó la fase a medias, sin commitear, al llegar a su límite semanal. Francisco decidió que la terminara Dev Web UX sin Claude Code. Revisé ese trabajo, conservé lo correcto, completé lo que faltaba y corregí lo que salió en la revisión.

## Páginas (§5.8–§5.14)

| Ruta | Contenido |
|---|---|
| `/tecnologia` | 6 herramientas del scrape (escaneo, electromagnético, videoscopia, +200 puntos, prueba de manejo, PaintSCAN/TintSCAN/láser), con imagen real y pie honesto donde existe. |
| `/guia` | «Cómo comprar un auto usado en Perú sin sorpresas (guía 2026)». Incluye un resumen-respuesta de 51 palabras, un índice lateral, las secciones 1. Estado legal (10 subsecciones) y 2. Inspección (4), cajas «Dónde se consulta» (SUNARP, SAT, ATU, MTC…), «Actualizado: 16 de noviembre de 2026» y JSON-LD `Article`. |
| `/guia/checklist` | 7 puntos, botón «Imprimir» y hoja con campos de placa y fecha. Al imprimir se ocultan el header, el footer, el banner y los CTA, y cabe en 1 hoja A4. JSON-LD `HowTo`. |
| `/guia/problemas-comunes` | 7 hallazgos con su barra «X de cada 10», foto real con pie honesto y enlace al plan que lo revisa. |
| `/guia/consulta-placa-gratis` | Formulario (Server Action), «Qué te respondemos gratis» y enlace al Antecedentes Completo y a la guía. |
| `/blog` + `/blog/[slug]` ×21 | Índice por categoría (Diagnósticos 10, Tips mecánicos 6, Novedades 5), el artículo más reciente destacado y una lista tipo informe. Cada artículo tiene ficha (categoría, fecha, lectura, servicio), tarjeta del servicio relacionado, «Más en…» y JSON-LD `BlogPosting`. |
| `/nosotros` | Historia, misión, visión y foto del equipo (aparece **una sola vez** en el sitio). |
| `/preguntas-frecuentes` | 14 preguntas en 4 grupos (Servicio, Reserva y pagos, Certificación, Alcances técnicos), con JSON-LD `FAQPage`. |
| `/legal/terminos-y-condiciones` | Texto **literal** del JSON con un índice lateral de 17 secciones. |
| `/legal/privacidad`, `/legal/cookies` | `[PENDIENTE CLIENTE]`. |
| `/libro-de-reclamaciones` | Razón social, RUC y domicilio. Los campos del formulario original, con la sección del tutor solo para menores, las definiciones (1)/(2) y las declaraciones literales. Validación en cliente y en servidor y **envío simulado**. |

## Verificación

| Prueba | Resultado |
|---|---|
| `npm run check` + `npm run build` | EXIT 0, con 21 artículos SSG. First Load JS: Home 121 kB, artículo 108 kB. |
| Blog contra el JSON | 21/21 OK: slugs sin emojis, fechas originales, texto con ratio normalizado 1,0. |
| T&C, diff normalizado | Idénticos (13 277 caracteres). |
| `check:paginas` (ampliado) | Todas las cifras de 25 páginas y 21 artículos existen en el JSON. Los 5 precios son idénticos en todas partes. |
| axe (wcag2a/aa, 2.1, 2.2, best-practice) | **0 violaciones de cualquier nivel** en 14 rutas, tanto a 390 como a 1280 px. Las 2 moderadas (landmark duplicado) quedaron corregidas. |
| Scroll horizontal | Ninguno: `scrollWidth` es igual al viewport en todas las rutas. Cada página tiene 1 H1. |
| Años 2023/2024 | Solo queda «informes propios 2024-2026», que es la fuente de las cifras. |
| Libro: errores | Al enviar vacío, 19 campos quedan con `aria-invalid` y el foco va a «Nombre». Igual sin JavaScript (validación del servidor). |
| Libro: éxito | Muestra «Envío simulado correctamente» y el log no guarda datos personales. |
| Lighthouse móvil (2 corridas) | `/guia`: 98/100/100/66 y 98/100/100/66, LCP 2,2 s, CLS 0. Artículo: 98/100/100/66 y 96/100/100/66, LCP 2,2–2,7 s. El SEO de 66 se debe al `noindex` intencional del preview; con `SITE_ENV=production` da 100 (Fase 3). |

## Crítica visual (capturas revisadas) y correcciones

1. **Blog repetitivo**: había 21 tarjetas oscuras idénticas que repetían el título dos veces. Lo cambié por una portada destacada y una lista tipo índice con ficha N.º y código de categoría.
2. **Portada del artículo**: duplicaba el H1 y se cortaba («Comprobarlo»). La reemplacé por una ficha de datos.
3. **Portada destacada en móvil**: el texto se desbordaba. Ahora usa proporción 4:3 en móvil y `line-clamp`.
4. **Fotos con botón de reproducción y subtítulo quemados** (kilometraje y airbag): las recorté. El pie del airbag decía «habitáculo», pero la imagen es del motor; quedó corregido.
5. **Consulta de placa**: la página solo tenía el formulario. Le agregué contenido de la fuente.
6. **Libro**: las leyendas de los fieldsets tenían un peso demasiado bajo, la fecha de éxito salía en formato ISO y al «N.º de documento» no se le marcaba el error si faltaba el tipo. Corregí los tres.

Lo que sigue débil, sin poder resolverlo con lo disponible:
- Las fotos de «Choques ocultos» y «Problemas documentarios» muestran al equipo, no el hallazgo.
- La del videoscopio se repite en 2 páginas, porque es la única.
- Los títulos del blog conservan el «Title Case» del original para mantenerse fieles.
- En el headless, los campos de fecha muestran «mm/dd/yyyy»; en un navegador es-PE se ven como dd/mm/aaaa.

## Pendientes nuevos

Están en `docs/PENDIENTES.md`:
- Autor con bio.
- Textos de privacidad y cookies.
- Sistema real para el libro y listas de provincias y distritos.
- Plazo «quince días naturales» del texto original, a revisar con asesoría legal.
- «+200» frente a «320 puntos».
- Fotos de hallazgos.
- Fechas de 2025 de los artículos.

## Capturas

Están en `docs/capturas/fase4/`: las 14 rutas a 390 y 1280 px (`*-390.jpg`, `*-1280.jpg`), `articulo-kilometraje-*`, `articulo-checklist-*`, `libro-error-*`, `libro-exito-*` y `checklist-print.jpg`.
