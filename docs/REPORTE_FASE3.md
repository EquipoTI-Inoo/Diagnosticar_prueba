# Reporte · Fase 3 — Servicios y conversión

Fecha: 16/11/2026 · Rama: `master`. **Me detuve aquí. No empecé la Fase 4, no desplegué, no publiqué y no hice push.**

Este reporte incluye la **ronda de corrección del revisor** (puntos 1–9), que se aplicó sobre los commits hasta `77c2ac2`.

## Qué hice

### Páginas nuevas (todas estáticas)

| Ruta | Contenido |
|---|---|
| `/servicios` | H1 «Planes y precios» y resumen-respuesta con precios del JSON. Los 5 planes en carrusel (móvil) o rejilla (escritorio). **Tabla comparativa** con las 16 filas del §5.2, más «Qué recibes» y «Reservar». Notas: Antecedentes Completo descontable; IGV `[PENDIENTE CLIENTE]`; «Por confirmar». Tarjetas de Asesoría online y Certificación con precio `[PENDIENTE CLIENTE]`. Bloque «Lo que NO hacemos» (compresión, según T&C). JSON-LD `OfferCatalog`. |
| `/servicios/[slug]` × 6 | Antecedentes Básico, Antecedentes Completo, Diagnóstico Básico, DiagnostiCAR, DiagnostiCAR Plus y Asesoría precompra online. Cada una con: migas; H1 y resumen-respuesta de 40–60 palabras (validado en build); precio tachado/vigente; «Programa tu cita con el 50 % del servicio»; CTA de WhatsApp con el servicio y `track`; «Todo lo que revisamos» desde el JSON (`incluye_detalle` en Antecedentes Completo); **imagen real** con pie honesto; «Qué recibes»; proceso (4 pasos con visita, o pasos 01–02 y plazo pendiente sin visita); FAQ del JSON solo donde existen; comparar planes; relacionados. JSON-LD `Service`/`Offer` y `FAQPage`. |
| `/vende-tu-auto` | H1 y sub del §5.4. Beneficios (4), «¿Qué incluye?» (4 bloques de la fuente), sello «Vehículo verificado» con QR SVG ilustrativo, «Cómo funciona» (4), FAQ de certificación (6). Precio `[PENDIENTE CLIENTE]`; las cifras de leads y seguidores llevan `[CONFIRMAR CLIENTE]`. |
| `/como-funciona` | Los 4 pasos, «Qué necesitamos» (de `/como-comprar/`), reserva del 50 % con medios de pago `[PENDIENTE CLIENTE]` (no se publican cuentas), 6 políticas en lenguaje simple tomadas de los T&C (el script verifica que cada texto exista en ellos) y enlace a los T&C. JSON-LD `HowTo`. |
| `/cobertura` | Los 10 distritos sin recargo como chips, esquema SVG propio sin escala (sin Google Maps), «¿Otro distrito?» con WhatsApp y vigencia de la lista `[CONFIRMAR CLIENTE]`. |
| `/informe-de-ejemplo` | H1 y texto del scrape, visor de las páginas 1–3 del PDF de la fuente (renderizadas con `pdftoppm`), «Descargar PDF» (evento `informe_descarga`), aviso «Placa de ejemplo — los datos son ilustrativos» y `[PENDIENTE CLIENTE: informe actualizado] — este PDF es de 2022`. |
| `/contacto` | Botón grande de WhatsApp, teléfono, oficina (con la aclaración de que el servicio es a domicilio), horario y correo `[PENDIENTE CLIENTE]`, redes, grupo de Facebook y formulario. |
| `/guia/consulta-placa-gratis` | Sigue siendo marcador de la Fase 4, pero ya incluye el **mismo** formulario de placa que la Home. |

### Formularios (§3, §7)

- **Server Actions** (`app/(site)/acciones.ts`) validan con **Zod en el servidor**. En el cliente hay una validación ligera con las mismas reglas y mensajes (`lib/validacion-cliente.ts` + `MSG`).
- Reglas: placa peruana con máscara `ABC-123`/`A1B-234`; celular de 9 dígitos que empieza por 9; consentimiento obligatorio; honeypot.
- Accesibilidad: `aria-invalid` y `aria-describedby` por campo, resumen en una región `aria-live`, foco al primer error y panel de éxito o de error que recibe el foco.
- Fallback a WhatsApp prellenado tanto en el éxito como en el error de envío.
- Funciona **sin JavaScript**.
- Los leads se guardan en `.data/leads.jsonl` (local y fuera de git) y en el log del servidor. El destino real está `[PENDIENTE CLIENTE]`.

### Ajustes pendientes de la Fase 2

1. **(a)** Logo del header de escritorio a **96 px** en estado inicial (header de 112 px; «DIAGNOSTICAR» ≈ 14 px de alto) y 48 px compacto. Móvil sin cambios. Captura: `header-desktop-logo-1280.jpg` y `header-desktop-compacto-1280.jpg`.
2. **(b)** Carrusel de planes con tarjetas al 82 %: la siguiente asoma ~70 px (`carrusel-planes-390.jpg`).
3. **(c)** Marca de agua del footer más baja (62 % del ancho, máximo 600 px).

### Calidad y datos

- `npm run check:paginas` (nuevo) audita el texto **renderizado** de la Home y de las 12 páginas nuevas: todas las cifras existen en el JSON.
- También verifica que los **5 precios** son idénticos en el JSON, la Home, `/servicios`, cada ficha, el JSON-LD `Service` y el `OfferCatalog`.

## Ronda de corrección del revisor

| # | Problema | Corrección | Verificación |
|---|---|---|---|
| 1 | `/servicios` con scroll horizontal de página (915 px a 390) | La causa real era la **tabla**, no el carrusel: los `.sr-only` (posición absoluta) de las celdas escapaban del contenedor de scroll, que no estaba posicionado. Las regiones con scroll (tabla, carrusel y tabla de `/design-system`) ahora son `relative`. | `scrollWidth == innerWidth` en **todas** las páginas nuevas, la Home y `/design-system` a 360, 390, 768 y 1280 px. |
| 2 | axe `definition-list` y `dlitem` en `/como-funciona` | Cada `div` del `<dl>` contiene solo `dt` y `dd`; el número va dentro del `dt`. | axe 0. |
| 3 | Tabla con `max-height` y scroll anidado; primera columna estrecha | Quité el `max-height`. En escritorio la tabla se ve completa con `overflow` visible y cabecera sticky respecto de la página, bajo el header compacto. En móvil: scroll horizontal accesible, `table-fixed` y `colgroup` con **144 px** para la característica y 120 px por plan (se ven ~1,6 planes), celdas más compactas y primera columna fija. | Medido: columnas 144/120×5 a 360 y 390 px; la cabecera queda en `top = 64 px` al hacer scroll a 1280. Capturas `tabla-movil-390`, `tabla-movil-desplazada-390`, `tabla-cabecera-sticky-1280` y `servicios-1280` (tabla entera). |
| 4 | Etiquetas solapadas en el esquema de cobertura | Cada distrito tiene su propio anclaje de etiqueta (Pueblo Libre debajo, San Miguel y San Isidro a la izquierda) y subí la letra para que se lea a 390 px. No cambió ninguna posición geográfica. | `cobertura-esquema-390.jpg` y `cobertura-1280.jpg`. |
| 5 | «Comprador» con mayúscula | En la fuente está en mayúscula, pero aquí no se usa como cita literal: lo pasé a minúscula en el script (regla 2). | — |
| 6 | El WhatsApp de «Certifica tu auto» en `/servicios` usaba el mensaje de reserva | Ahora usa «Hola, quiero certificar mi auto para venderlo» y el mismo `track` que `/vende-tu-auto`. | — |
| 7 | Fichas sin evidencia visual | Cada ficha tiene ahora una imagen real junto a «Todo lo que revisamos», con pie honesto y sin texto quemado (ver DECISIONES G6). | Capturas `ficha-*-1280/390`. |
| 8 | La Home pasó de 120 a 146 kB de JS | Zod sale del cliente: queda la validación ligera en el navegador y Zod solo en la Server Action. | First Load JS de la Home: **121 kB**; `/contacto`: 112 kB. |
| 9 | Número de WhatsApp partido en `/contacto` | El número va en un `span` con `whitespace-nowrap`: si hace falta, baja completo a la segunda línea. | `contacto-390.jpg`. |

## Cómo verlo

```bash
npm install
npm run dev              # http://localhost:3000/servicios, /servicios/diagnosticar, /vende-tu-auto, /como-funciona, /cobertura, /informe-de-ejemplo, /contacto
npm run check            # contraste + datos + tsc + eslint
npm run check:build      # build + check:paginas (cifras y precios en el HTML renderizado)
```

## Criterios de aceptación (§10, Fase 3)

| Criterio | Estado | Evidencia |
|---|---|---|
| Precios idénticos a `contenido.json` | ✅ | `check:paginas`: S/ 19, 49, 239, 349 y 549 coinciden en el JSON, la Home, `/servicios`, las fichas, el JSON-LD `Service` y el `OfferCatalog`. El mega-menú muestra «desde S/ x» con los mismos valores. Asesoría y Certificación: `[PENDIENTE CLIENTE]` (no se muestra S/ 99). |
| Tabla comparativa accesible con teclado y lector de pantalla | ✅ | `<caption>`, `colgroup`, 6 `th[scope=col]` y 17 `th[scope=row]`. Iconos con texto `sr-only` («Incluido» / «No incluido»), precios con «Antes / Ahora». Playwright: la región recibe el foco con Tab y las flechas la desplazan; la primera columna es sticky de 144 px. axe 0. |
| Formularios validan (placa peruana, celular de 9 dígitos que empieza por 9) y muestran estados de éxito/error | ✅ | Pruebas Playwright (**21/21 en verde**): foco al primer error con Enter; 3 campos con `aria-invalid` en placa y 5 en contacto; error asociado por `aria-describedby`; resumen en `aria-live`; correo inválido → error y foco; éxito con el foco en el panel; fallback de WhatsApp con «…placa ABC-123. Mi celular: 987654321»; lead guardado por el servidor; eventos `lead_placa` y `lead_contacto`; el honeypot no guarda; **sin JS**, el servidor (Zod) devuelve los errores de placa, celular y consentimiento, y acepta `A1B-234`. El error de envío lo probé dejando `.data` en solo lectura: aparece el panel con el fallback a WhatsApp (`form-contacto-error-envio-390.jpg`). |
| Nada inventado | ✅ | `check:datos` (contenido) y `check:paginas` (HTML renderizado) en verde. El copy redactado está listado en DECISIONES y PENDIENTES para que lo validen. |

### Otras verificaciones

- `npm run check` y `npm run build`: ✅ sin errores ni advertencias.
- **axe-core 4.14** (`wcag2a/aa`, `wcag21a/aa`, `wcag22aa`, `best-practice`): **0 violaciones** en las 13 páginas nuevas y la Home a 390 y 1280 px. También 0 en `/design-system`.
- **Sin scroll horizontal** en ninguna página a 360, 390, 768 y 1280 px.
- La suite e2e de la Fase 2 sigue en verde en lo que aplica. Los 4 chequeos de placa de esa suite esperaban el comportamiento anterior (`window.open` directo y errores con `role="alert"`), que esta fase reemplazó a propósito por la Server Action con panel y foco; la suite de la Fase 3 los cubre.

### Lighthouse (móvil, Lighthouse 12)

| Página · modo | Perf. | Acc. | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/servicios` · preview · simulado | 96 · 97 · 98 | 100 | 100 | 66* | 2.7 · 2.6 · 2.3 s | 0 | 30–50 ms |
| `/servicios/diagnosticar` · preview · simulado | 98 · 98 · 97 | 100 | 100 | 66* | 2.2 · 2.2 · 2.6 s | 0.012 | 40–50 ms |
| `/servicios` · `SITE_ENV=production` · simulado | 96 · 98 | 100 | 100 | 100 | 2.7 · 2.3 s | 0 | 20–30 ms |
| `/servicios/diagnosticar` · `SITE_ENV=production` · simulado | 97 · 97 | 100 | 100 | 100 | 2.6 · 2.6 s | 0.012 | 40 ms |
| `/servicios` · producción · throttling **real** (devtools) | 99 | 100 | 100 | 100 | **1.7 s** | 0.002 | 80 ms |
| `/servicios/diagnosticar` · producción · throttling **real** | 99 | 100 | 100 | 100 | **1.6 s** | 0.021 | 40 ms |

\* En preview el `noindex` es intencional.

Performance (≥ 95), Accesibilidad (≥ 98), Buenas prácticas (≥ 95), SEO (100 en producción) y CLS (< 0.05) cumplen. **El LCP simulado sigue entre 2.2 y 2.7 s**, la misma limitación documentada en F26: la simulación suma el JS de Next que llega antes del primer pintado. Con throttling real da 1.6–1.7 s. Queda para la Fase 6, como se acordó.

### Capturas (`docs/capturas/fase3/`, 42 archivos, revisadas visualmente)

- **Página completa a 390 y 1280 px:** `/servicios`, las 6 fichas, `/vende-tu-auto`, `/como-funciona`, `/cobertura`, `/informe-de-ejemplo`, `/contacto` y `/guia/consulta-placa-gratis`. En las de página completa oculté la barra móvil y el botón flotante.
- **Formularios:**
  - Placa: error y éxito a 390 y 1280 px.
  - Contacto: error y éxito a 390 y 1280 px.
  - Contacto: error de envío a 390 px.
- **Header:** de escritorio con el logo agrandado y compacto.
- **Carrusel móvil:** `carrusel-planes-390`.
- **Tabla:** en móvil (sin desplazar y desplazada) y con la cabecera sticky a 1280 px.
- **Cobertura:** el esquema a 390 px.

## Commits de la Fase 3

```
c5dc28e docs: capturas de la Fase 3 (390/1280, formularios, header, carrusel y tabla)
374dcd6 docs: decisiones G1–G18 y pendientes de la Fase 3
5d95f87 fix(cobertura): etiquetas del esquema legibles a 390 px
4653fc0 fix(servicios): en móvil la tabla muestra ~1,6 planes (144 px + 120 px por plan)
23b8a4c feat(check): check:paginas audita cifras y precios en el HTML renderizado y el JSON-LD
0fcdf1e fix(contacto): el número de WhatsApp no se parte en el botón
ea6ab7d perf(forms): validación ligera en cliente y Zod solo en la Server Action (−25 kB de JS)
1c71dc8 feat(fichas): foto real o página del informe por servicio, con pie honesto
1a20b39 fix(servicios): WhatsApp de «Certifica tu auto» con el mensaje de certificación
a1dde6e fix(cobertura): etiquetas del esquema sin solapes
32389eb fix(como-funciona): estructura válida de <dl> y «comprador» en minúscula
2d7ada3 fix(servicios): tabla sin scroll anidado, cabecera sticky en escritorio y sin desborde horizontal en móvil
77c2ac2 feat: /contacto con formulario y marcadores solo para la Fase 4
cc9ce60 feat: /informe-de-ejemplo con visor de 3 páginas y descarga del PDF
2002514 feat: /cobertura con distritos y esquema SVG de Lima
420375b feat: /como-funciona con pasos, datos para agendar, reserva y políticas
d8adf82 feat: /vende-tu-auto con certificación, sello verificado y FAQ
655c8b7 feat(servicios): 6 fichas con resumen-respuesta, precio, revisión, entregables, FAQ y relacionados
aeb34ac feat(servicios): /servicios con tabla comparativa accesible, notas y «Lo que NO hacemos»
99ab450 feat(seo): JSON-LD tipado (Service, OfferCatalog, FAQPage, HowTo, BreadcrumbList) y migas visibles
8684f55 fix(layout): logo de 96 px en el header de escritorio, carrusel que asoma y marca de agua más baja
be06eb7 feat(forms): Server Actions con Zod, honeypot y fallback WhatsApp para placa y contacto
5c3a1bb feat(content): copy de conversión, comparativa trazada al JSON y páginas del informe
```

Más el commit de este reporte. Los commits siguen saliendo como `asesoria <prototipo@localhost>` (ver el reporte de la Fase 2, ronda 1). No toqué `docs/capturas/fase1/` ni `docs/capturas/fase3-prelim/`, que son del revisor y siguen sin versionar.

## Pendientes y dudas para Francisco

1. **Antecedentes en DiagnostiCAR y Plus:** ¿el reporte incluido es el básico o el completo? Hoy la tabla dice «Por confirmar» en 4 filas.
2. **Plazo de entrega** del informe de antecedentes y de la asesoría online.
3. **Destino de los leads:** ¿CRM, correo u hoja de cálculo? Mientras tanto se guardan en local y siempre se ofrece WhatsApp.
4. **Precios** de la Asesoría online y de la Certificación, y si los precios incluyen IGV.
5. **Medios de pago:** no se publica ninguno hasta que lo confirmen.
6. **Sello verificado:** falta la URL pública de verificación (el QR es ilustrativo).
7. **Informe de ejemplo actualizado:** el PDF es de 2022.
8. **Copy redactado** en esta fase (resúmenes-respuesta, políticas en lenguaje simple, textos de formularios): validar.
9. **LCP simulado:** sigue para la Fase 6.
