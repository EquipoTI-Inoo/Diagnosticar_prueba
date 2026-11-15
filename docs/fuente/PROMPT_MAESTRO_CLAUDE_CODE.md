# PROMPT MAESTRO — Prototipo web DiagnostiCAR (Diagnosticar Perú)

> Pega este documento completo en Claude Code como instrucción inicial. Trabaja **por fases**: al terminar cada fase, detente, muestra qué hiciste, cómo verlo (`npm run dev`) y espera mi OK antes de seguir.

---

## 0. Rol y reglas de trabajo

Eres un equipo senior de producto web (dirección de arte + front-end + SEO técnico) que construye el **prototipo navegable** del nuevo sitio de DiagnostiCAR. Reglas:

1. **No inventes datos.** Precios, cifras, direcciones, teléfonos, nombres de clientes y aliados salen SOLO de `docs/fuente/contenido.json` y `contenido.md`. Lo que falte se escribe literalmente como `[PENDIENTE CLIENTE]` y se lista en `docs/PENDIENTES.md`.
2. **Puedes mejorar la redacción** (más clara, más corta, tono consistente) sin cambiar el significado ni las cifras. Corrige ortografía y quita los MAYÚSCULAS/«¡¡!!» del sitio viejo.
3. Todo el contenido vive en archivos de datos tipados (`/content`), nunca hardcodeado en componentes, para que luego se conecte a un CMS.
4. Idioma: **español de Perú** (tuteo, «auto»/«carro», «papeletas», «placa», «S/»). `lang="es-PE"`.
5. Commits pequeños y descriptivos por fase. Nada de dependencias innecesarias.
6. Si una decisión no está en este documento, elige la opción más simple y anótala en `docs/DECISIONES.md`.

## 1. Archivos fuente (úsalos)

Copia la carpeta entregada `diagnosticar/` dentro del repo como `docs/fuente/`:

| Ruta | Qué es |
|---|---|
| `docs/fuente/contenido.json` | Fuente de verdad estructurada: `negocio`, `servicios`, `recursos_gratis`, `proceso`, `problemas_comunes`, `faqs`, `testimonios`, `inconsistencias_detectadas`, `pendiente_cliente`, y `paginas[]` (119 URLs con SEO, headings, texto, imágenes). |
| `docs/fuente/contenido.md` | Lo mismo, legible, agrupado por tipo de página (rediseño 2026, públicas, legal, landings, legacy, blog). |
| `docs/fuente/assets/_clave/` | Logo (`logosaaa-02-2.png/.webp`), logos de aliados (`logo-autel.png`, `launch-official-v2.png`), medios (`logo-gestion.png`), automovilismo (`caminos-del-inca-logo.png`), fotos reales de hallazgos (`fugas-aceite.jpg`, `choques-ocultos.jpg`, `kilometraje200k.jpg`, `airbag.jpg`, `motor-reparado.jpg`, `carros-clonados.jpg`, `problemas-documentarios.jpg`), equipo (`asi-trabajamos-frame2.jpg`, `IMG_5446.webp`, `fg-min…webp`, `gh-1-min…webp`), miniaturas de video (`reco1-3-frame.jpg`). |
| `docs/fuente/assets/20xx/…` | Todas las imágenes originales del sitio (mismo path que `/wp-content/uploads/`), incluido `2022/06/Reporte-DiagnostiCAR.pdf` (informe de ejemplo, 13 págs., escaneado). |
| `docs/fuente/raw/*.html` | HTML original por si necesitas verificar algo. |
| `docs/fuente/referencias/` | Capturas y `README.md` con qué tomar de cada referencia (inoo.pe, Autofact, Lemon Squad, carVertical, Kavak, competencia Lima). **Léelo antes de diseñar.** |

Optimiza imágenes a AVIF/WebP con `next/image`; nunca uses las imágenes del blog (el propio sitio admite que son generadas con IA).

## 2. Contexto del negocio

- **Marca:** DiagnostiCAR · **Razón social:** Diagnosticar S.A.C. · **RUC:** 20609649420 · Lema: «Las máquinas no mienten».
- **Qué hace:** diagnóstico vehicular **pre-compra a domicilio** en Lima Metropolitana para autos usados: (a) **antecedentes legales/registrales** (SUNARP, SAT, papeletas a nivel nacional, SUTRAN, ATU, gravámenes, garantías mobiliarias, robo, pérdida total, siniestralidad SOAT, boleta informativa) y (b) **inspección técnica** con 6 escáneres profesionales (LAUNCH, Autel), escaneo electromagnético de carrocería (detecta masilla/choques), videoscopía, verificación de kilometraje real, N.° VIN y motor, PaintSCAN/TintSCAN y escaneo láser de frenos y llantas. Además **certifica autos para la venta** (sello «Vehículo verificado por DiagnostiCAR» con QR) y ofrece **asesoría precompra online**.
- **Prueba social:** +6,000 diagnósticos · 4.9★ en Google con +575 reseñas · 100 % independientes del vendedor · 4 años de experiencia · aparición en **Gestión** · apoyo al **Rally Caminos del Inca**.
- **Oficina:** Av. José Pardo 1167, of. 303, Miraflores, Lima. **WhatsApp/teléfono:** +51 923 374 470. **Horario:** lunes a domingo, horas `[PENDIENTE CLIENTE]`. **Email:** `[PENDIENTE CLIENTE]` (en T&C figura info@diagnosticar.com, dominio distinto: confirmar).
- **Redes:** Instagram @diagnosticar.peru · YouTube @diagnosticarperu · Facebook (profile id 100083559722874) · TikTok `[PENDIENTE CLIENTE @]` · Grupo FB «Compra Segura Autos Usados Lima» (URL `[PENDIENTE CLIENTE]`).
- **Cobertura sin recargo:** Magdalena, San Miguel, Jesús María, Pueblo Libre, Lince, San Isidro, Miraflores, Barranco, Surco, San Borja. Otros distritos: recargo de traslado a coordinar (confirmar lista vigente).
- **Modelo de reserva:** se agenda por WhatsApp con **50 % de adelanto**; el saldo al terminar. Reprogramación con ≥48 h; sin reembolso una vez agendado (salvo incumplimiento de la empresa). Tolerancia 15 min.

### Públicos (por prioridad)
1. **Comprador de auto usado en Lima** (25–45 años, primera o segunda compra, miedo a la estafa, no sabe de mecánica, compra en Marketplace/particulares/concesionarios). Necesita: saber qué revisar, cuánto cuesta, que vayan a donde está el auto, y un veredicto claro.
2. **Comprador que ya tiene placa** y quiere decidir HOY (alta intención → WhatsApp inmediato).
3. **Vendedor particular** que quiere vender más rápido y mejor (certificación + QR).
4. **Comprador fuera de Lima / sin tiempo** (asesoría online, antecedentes 100 % online).
5. **B2B** (concesionarios, flotas, retomas): `[PENDIENTE CLIENTE]` si se ofrece; dejar sección preparada pero oculta.

Las 4 «etapas» que ya usa el sitio (mantener como sistema de navegación): **Recién estoy evaluando → Estoy buscando opciones → Ya encontré el auto (tengo placa) → Quiero vender mi auto.**

## 3. Objetivos y métricas de conversión

- **Conversión primaria:** clic a WhatsApp con mensaje prellenado por servicio (`https://wa.me/51923374470?text=Hola%2C%20quiero%20reservar%20mi%20diagn%C3%B3stico%20{Servicio}`) → evento `whatsapp_click {servicio, ubicacion}`.
- **Secundarias:** formulario «Consulta gratis por placa» (placa + celular + aceptación de privacidad) → lead; formulario de contacto; descarga del informe de ejemplo; clic en teléfono.
- **Micro:** ver tabla comparativa, abrir FAQ, leer guía.
- Implementa una capa `lib/analytics.ts` con `track(evento, props)` que haga `dataLayer.push` (GTM se conecta luego; Meta Pixel y TikTok Pixel existen hoy, IDs `[PENDIENTE CLIENTE]`). Respeta el consentimiento de cookies.
- CTA principal en TODA página: «Agendar diagnóstico» (WhatsApp). CTA secundario: «Consultar placa gratis».

## 4. Arquitectura de información y mapa del sitio

```
/                                   Home
/servicios                          Comparativa de los 7 servicios (tabla + tarjetas)
/servicios/antecedentes-basico
/servicios/antecedentes-completo
/servicios/diagnostico-basico
/servicios/diagnosticar             (plan "Más elegido")
/servicios/diagnosticar-plus
/servicios/asesoria-precompra-online
/vende-tu-auto                      Certificación "Vehículo verificado" + QR (fusiona /servicio-certifica-tu-auto y /venta-sin-consignar)
/como-funciona                      Proceso 4 pasos + reserva 50 % + qué llevar + políticas resumidas
/cobertura                          Distritos sin recargo + mapa estático + recargo
/informe-de-ejemplo                 Visor + descarga PDF
/tecnologia                         Escáneres, electromagnético, videoscopía, láser, PaintSCAN (fusiona páginas legacy escaneo/detector/videoscopo/revision-vehicular/manejo)
/guia                               Guía definitiva para comprar un auto usado en Perú (pilar SEO)
/guia/checklist
/guia/problemas-comunes             (los 7 problemas X/10 con fotos reales)
/guia/consulta-placa-gratis         Lead magnet SOAT/RT/dueños
/blog                               + /blog/[slug] (migrar 21 artículos)
/nosotros
/preguntas-frecuentes
/contacto
/legal/terminos-y-condiciones
/legal/privacidad                   [PENDIENTE CLIENTE: texto]
/legal/cookies                      [PENDIENTE CLIENTE: texto]
/libro-de-reclamaciones             Obligatorio (Indecopi) — formulario
```

**Navegación principal (desktop):** Servicios ▾ (mega-menú con los 7, precio "desde" y CTA comparativa) · Cómo funciona · Vende tu auto · Guía · Nosotros · Contacto · [WhatsApp (secundario)] · [Agendar diagnóstico (primario)].
**Mobile:** header compacto con logo + botón WhatsApp + menú; **barra inferior fija** con «WhatsApp» y «Ver precios».
**Footer:** 4 columnas (Servicios / Aprende / Empresa / Contacto) + redes + Libro de Reclamaciones (con ícono oficial) + razón social y RUC + marca de agua grande del logotipo.

### Redirecciones 301 (crea `redirects` en `next.config`)
`/precios/`, `/servicios-1/`, `/servicios`, `/service/`, `/diagnostico/` → `/servicios` · `/servicio-diagnosticar/`, `/diagnosticar/`, `/reporte-diagnosticar-2/` → `/servicios/diagnosticar` · `/servicio-diagnostico-basico/`, `/reporte-basico/`, `/reporteverbal/` → `/servicios/diagnostico-basico` · `/servicio-diagnosticar-plus/`, `/reporte-diagnosticar-plus/` → `/servicios/diagnosticar-plus` · `/servicio-antecedentes-basico/` → `/servicios/antecedentes-basico` · `/servicio-antecedentes-completo/`, `/antecedentes/`, `/antecedentes-3/`, `/revision-antecedes-boost/` → `/servicios/antecedentes-completo` · `/servicio-asesoria-precompra/`, `/asesoria-virtual/`, `/asesoria-pre-compra-online/` → `/servicios/asesoria-precompra-online` · `/servicio-certifica-tu-auto/`, `/venta-sin-consignar/` → `/vende-tu-auto` · `/nosotros/`, `/about/` → `/nosotros` · `/contact/`, `/contacto/` → `/contacto` · `/guia/`, `/guia-2/`, `/gratis/` → `/guia` · `/checklist-precompra/` → `/guia/checklist` · `/top-5-problemas/`, `/puntos-importantes/` → `/guia/problemas-comunes` · `/centro-de-ayuda/`, `/unico-dueno-2/`, `/verbal-gratis/` → `/guia/consulta-placa-gratis` · `/escaneo/`, `/detector-de-choques/`, `/videoscopo/`, `/revision-vehicular/`, `/manejo/`, `/escrito/`, `/verbal/` → `/tecnologia` · `/como-comprar/` → `/como-funciona` · `/informe-ejemplo/` → `/informe-de-ejemplo` · `/terminos-y-condiciones/` → `/legal/terminos-y-condiciones` · `/AAAA/MM/DD/slug/` → `/blog/slug` (slug sin emojis). Páginas basura (sample-page, borrador, duplicados `[#1505]`/`[#1573]`, `*-legacy`, `home-2`, `preview-*`) → 410 o 301 a home.

## 5. Contenido por página (copy base — usa datos de `contenido.json`)

> El copy siguiente es la versión mejorada. Todo número viene del scrape. Mantén las etiquetas `[PENDIENTE CLIENTE]`.

### 5.1 Home `/`
1. **Hero** — Eyebrow: «Diagnóstico vehicular pre-compra a domicilio · Lima». H1: «Revisa antes de decidir. *Las máquinas no mienten.*» (segunda línea en color de acento). Subtítulo: «Vamos a donde está el auto, revisamos su historia legal y su estado real con equipos profesionales, y te damos un veredicto claro antes de que pagues.» CTAs: [Agendar diagnóstico → WhatsApp] [Ver planes y precios]. Columna de métricas: **+6,000** diagnósticos realizados · **4.9★** en Google · **+575** reseñas · **100 %** independientes del vendedor. Visual: foto real del equipo (`asi-trabajamos-frame2.jpg`) recortada en forma editorial + video corto opcional (YouTube `Wqtfs4rwgoE`, carga diferida con facade).
2. **Consulta gratis por placa** (barra justo bajo el hero, estilo Autofact): input placa (formato `ABC-123`, validación) + celular → «Consultar gratis SOAT y Revisión Técnica». Texto: «Te decimos si el SOAT y la Revisión Técnica están vigentes, sin costo.» (Si el endpoint no existe: envía a WhatsApp con la placa prellenada.)
3. **Los problemas más comunes que encontramos** — «Frecuencia real sobre los vehículos que hemos revisado.» Tarjetas con foto real + barra/medidor X/10: Fugas de aceite **8/10** · Problemas documentarios (garantías, papeletas, robo, pérdida total) **6/10** · Choques ocultos **6/10** · Kilometraje bajado **4/10** · Airbags reventados **3/10** · Motor o caja reparados **2/10** · Carros clonados **1/1000**. Nota: «Fuente: informes propios 2024-2026.» CTA: «¿Cómo evitarlos?» → /guia/problemas-comunes.
4. **Comparador «Sin diagnóstico / Con DiagnostiCAR»** (toggle tipo inoo): Sin → «Confías en lo que dice el vendedor», «Descubres las papeletas de provincia después de la notaría (las notarías solo ven Lima y Callao)», «El kilometraje lo marca el tablero»; Con → «Datos de escáner, partida registral y escaneo de carrocería», «Papeletas a nivel nacional, SUTRAN y ATU», «Kilometraje contrastado con módulos y desgaste». (Todo deriva del scrape.)
5. **Planes** — H2: «Elige cuánto quieres saber antes de comprar.» 5 tarjetas (scroll horizontal en móvil, rejilla en desktop) con precio tachado y vigente: Antecedentes Básico S/ 19 · Antecedentes Completo S/ 49 · Diagnóstico Básico ~~S/ 400~~ **S/ 239** · DiagnostiCAR ~~S/ 650~~ **S/ 349** (badge «Más elegido», destacada) · DiagnostiCAR Plus ~~S/ 800~~ **S/ 549**. Bullets según `servicios[]`. Cada tarjeta: [Reservar → WhatsApp con el servicio] y [Ver detalle]. Debajo: «Programa tu cita con el 50 % del servicio. Aplican términos y condiciones.» + enlace «Comparar todo en tabla».
6. **¿En qué etapa estás?** — 4 tarjetas: Recién estoy evaluando (Guía gratis, Checklist, Top problemas) · Estoy buscando opciones (Asesoría precompra / comparar) · Ya encontré el auto (Agendar diagnóstico) · Quiero vender mi auto (Certificar mi auto).
7. **De la duda al veredicto, en 4 pasos** — 01 Chatea con nosotros · 02 Programa tu cita (50 %) · 03 Diagnóstico (40–70 min) · 04 Recibes el reporte.
8. **Tecnología** — «Un solo escáner no puede detectarlo todo.» Texto del scrape (6 escáneres, se lleva el adecuado, homologados, detectan alteración de kilometraje). Lista: escaneo de motor/caja/airbags/ABS · electromagnético de carrocería · videoscopía. Logos LAUNCH y Autel. Enlace a /tecnologia.
9. **Confianza técnica, no promesas vacías** — 4 puntos: Técnicos certificados y con experiencia · Equipos profesionales · Informes claros y con fotos · Atención rápida y flexible (fotos reales `_clave`).
10. **Prueba social** — rating 4.9 + «+575 reseñas en Google» + 5–6 reseñas reales (nombres del JSON) + botón «Ver reseñas en Google» `[PENDIENTE CLIENTE: URL de la ficha]`. Logos: «Estamos en los medios» (Gestión), «Apoyamos el automovilismo» (Rally Caminos del Inca).
11. **Tips antes de comprar** — 3 videos (Instagram reels del scrape; miniaturas `reco1-3-frame.jpg`): «Sus respuestas nos hicieron dudar», «La facilidad de bajar el kilometraje», «¿Puedes detectar un daño estructural?».
12. **FAQ** (5 de la home) + enlace a /preguntas-frecuentes.
13. **CTA final** — «¿Listo para tomar la mejor decisión? Estamos para ayudarte.» [Agendar diagnóstico] [Quiero recibir consejos gratis → WhatsApp con texto «Hola, quiero recibir consejos y ayuda gratis antes de comprar mi auto»].

### 5.2 `/servicios` (comparativa)
H1 «Planes y precios». Tabla comparativa sticky-header con filas: propietarios/gravámenes/papeletas, asientos registrales, papeletas nacional, boleta informativa SUNARP, revisión +200 puntos, escaneo motor/caja/airbags/ABS, electromagnético, kilometraje real, videoscopía, VIN/motor, reporte de especialista con fotos, prueba de manejo (sujeta a T&C), láser frenos/llantas, anticlonación, PaintSCAN/TintSCAN, reportes escritos (4). Notas: «Antecedentes Completo es descontable del DiagnostiCAR o Plus.» «Precios en soles; IGV `[PENDIENTE CLIENTE: confirmar si incluyen IGV]`.» Bloque «Lo que NO hacemos»: medición de compresión (procedimiento invasivo; explicado en T&C) — transparencia que diferencia.

### 5.3 Ficha de servicio `/servicios/[slug]` (plantilla)
Hero con nombre + tagline + precio (tachado/vigente) + «Programa tu cita con el 50 % del servicio» + CTA WhatsApp prellenado · «Todo lo que revisamos» (lista completa del JSON: usa `incluye_detalle` en Antecedentes Completo) · «Qué recibes» (tipo de reporte) · proceso 4 pasos · FAQ específicas · «¿No estás seguro? Compara todos los planes» · servicios relacionados. Asesoría online y Certificación: precio `[PENDIENTE CLIENTE]` (no mostrar S/ 99 legacy salvo confirmación).

### 5.4 `/vende-tu-auto`
H1 «Vende tu auto sin comisiones.» Sub: «Certifícalo con DiagnostiCAR, genera confianza inmediata y llega a compradores que buscan autos verificados.» Beneficios (Cero comisiones · Contacto directo · Sigues usándolo · Cierre más rápido) · ¿Qué incluye? (Chequeo documentario / Chequeo visual completo / Escaneo OBD certificado / Entregables) · Sello de confianza con QR único (mockup del sello) · Cómo funciona (Agenda → Certificado + reporte → Publica con sello → Te conectamos con compradores) · FAQ de certificación (6) · Precio `[PENDIENTE CLIENTE]`. Cifras «300–400 leads diarios» y «+100k seguidores» marcarlas `[CONFIRMAR CLIENTE]` antes de publicar.

### 5.5 `/como-funciona`
Pasos + «Qué necesitamos» (nombre y celular del comprador, placa, dirección de la revisión) + reserva 50 % (medios de pago `[PENDIENTE CLIENTE]`; NO publicar números de cuenta hasta confirmar) + políticas en lenguaje simple (reprogramación 48 h, tolerancia 15 min, prueba de manejo máx. 20 min con autorización, no se borran códigos de airbag, recomendación de cambio de fluidos, límites de detección de kilometraje) + enlace a T&C.

### 5.6 `/cobertura`
Lista de 10 distritos sin recargo como chips + mapa estático (SVG simple de Lima, sin Google Maps pesado) + «¿Otro distrito? Escríbenos y te decimos el costo de traslado» + página preparada para landings locales futuras (`/cobertura/[distrito]`, no generar aún).

### 5.7 `/informe-de-ejemplo`
H1 «Así es un informe DiagnostiCAR real.» Texto del scrape + visor de 3 páginas (render del PDF) + [Descargar PDF] + aviso «Placa de ejemplo — los datos son ilustrativos». Nota interna: el PDF es de 2022 → `[PENDIENTE CLIENTE: informe actualizado]`.

### 5.8 `/tecnologia`
Secciones por herramienta con texto del scrape: Escaneo completo (OBD2, LAUNCH, sistemas, kilometraje real) · Escaneo electromagnético de carrocería (masilla, 100–120 mediciones) · Videoscopía (cilindros, válvulas, pistones, cableado) · Revisión vehicular (aceite y líquido de frenos con equipos, arranque, alternador, batería) · Prueba de manejo · PaintSCAN/TintSCAN y láser (Plus). Unifica la cifra de puntos de revisión → usar «+200 puntos» (dato actual) y anotar en PENDIENTES la discrepancia 300/320.

### 5.9 `/guia` (pilar) y subpáginas
Reescribe la «Guía definitiva» del scrape en formato AEO: resumen de 3 líneas arriba, índice, **1. Estado legal** (impuesto vehicular SAT, historial de propietarios, papeletas —«las notarías solo ven papeletas de Lima y Callao»—, órdenes de captura, antecedentes de robo, gravámenes, revisión técnica MTC, estado registral, importados → pedir CARFAX, siniestrados/subastados) y **2. Inspección** (kilometraje adulterado, siniestrados, escaneo OBD2, fugas de aceite). Cada sub-sección con «Dónde se consulta» (SUNARP, SAT, ATU, MTC) en caja destacada. Actualiza el título a «Cómo comprar un auto usado en Perú sin sorpresas (guía 2026)» y muestra «Actualizado: [fecha]». Quita referencias «2023/2024». `/guia/checklist` (7 puntos, imprimible), `/guia/problemas-comunes` (7 problemas con explicación + foto), `/guia/consulta-placa-gratis` (formulario).

### 5.10 `/blog`
Migra los 21 artículos (texto en `contenido.json → paginas[grupo=blog_articulo]`) a MDX en `/content/blog`, slugs limpios sin emojis, fecha original, autor «Equipo DiagnostiCAR» `[PENDIENTE CLIENTE: autor técnico con bio]`. Sin imágenes IA: portada tipográfica generada (título + categoría sobre color de marca). Categorías: Diagnósticos, Tips mecánicos, Novedades.

### 5.11 `/nosotros`
H1 «Transparencia en cada transacción automotriz.» Historia, Misión y Visión (texto del scrape, pulido). Contadores: +6,000 vehículos diagnosticados · +575 clientes que nos reseñaron · 4 años. Bloque «Por qué existimos» (texto «Nacemos de la necesidad…» del /about). Aliados (LAUNCH, Autel), medios (Gestión), Rally Caminos del Inca. Equipo: `[PENDIENTE CLIENTE: fotos y nombres de técnicos, certificaciones]`. Datos legales: Diagnosticar S.A.C., RUC 20609649420.

### 5.12 `/preguntas-frecuentes`
Todas las FAQ del JSON agrupadas (Servicio · Reserva y pagos · Certificación · Alcances técnicos). Respuestas de 1–3 frases, directas.

### 5.13 `/contacto`
WhatsApp (botón grande) · Teléfono 923 374 470 · Dirección de oficina (aclarar que el servicio es a domicilio) · Horario `[PENDIENTE CLIENTE]` · Redes · Formulario (Nombre, Celular, Correo, Mensaje, consentimiento) · Grupo de Facebook.

### 5.14 Legales
`/legal/terminos-y-condiciones`: texto verbatim de `paginas[slug=terminos-y-condiciones]` con índice lateral. `/libro-de-reclamaciones`: formulario conforme a Indecopi (campos del scrape: identificación, tipo de documento, departamento/provincia/distrito, menor de edad + tutor, detalle, tipo de reclamo/queja, tipo de consumo, aceptación de políticas) — en el prototipo solo UI + envío simulado.

## 6. Dirección de arte

**Concepto: «Informe técnico».** La web debe sentirse como el informe de un perito: precisa, legible, con datos, semáforos y evidencia fotográfica real — no como una plantilla de agencia. Toma de **inoo.pe** el ritmo (secciones oscuras/claras alternadas, palabras clave en color dentro del titular, métricas en el hero, CTA doble fijo, comparador, FAQ minimalista, marca de agua en el footer) pero con identidad propia.

### Paleta (derivada del logo: teal #04ADBF + gris)
| Token | Hex | Uso |
|---|---|---|
| `ink` | `#0B1214` | Fondos oscuros, texto principal |
| `ink-2` | `#16211F` | Superficies oscuras secundarias |
| `paper` | `#F5F6F3` | Fondo claro principal (blanco cálido, no #FFF puro) |
| `line` | `#DDE2DE` | Bordes, divisores |
| `muted` | `#5C6B6A` | Texto secundario (≥4.5:1 sobre paper) |
| `brand` | `#04ADBF` | Acento de marca: solo sobre `ink` o como fondo de botón con texto `ink` |
| `brand-deep` | `#00727E` | Links/acentos sobre fondo claro (contraste AA) |
| `ok` | `#2E9E5B` · `warn` `#E0A100` · `alert` `#D6452F` | **Semáforo de hallazgos** (medidores X/10, estados del informe) |
| `whatsapp` | `#25D366` | Solo botón WhatsApp |

Verifica contraste AA en cada combinación y documenta en `docs/DECISIONES.md`.

### Tipografía (self-host con `next/font`)
- Titulares: **Archivo** (variable, usa el eje `wdth` 87–100 para titulares un poco condensados, peso 700–800, tracking −2 %). Da tono automotriz sin caer en Rajdhani/Saira «gamer» de la competencia.
- Texto: **Inter Tight** o **Public Sans** 400/500, 17–18 px base, interlineado 1.6.
- Datos/técnico: **JetBrains Mono** 500 para cifras, placas, códigos (P0420), precios en tablas y «X / 10».
- Escala fluida con `clamp()`: H1 44→88 px, H2 32→56 px, H3 20→26 px.

### Espaciado y layout
- Grid de 12 col, max-width 1200 px, gutter 24 px; secciones `clamp(64px, 10vw, 128px)` de padding vertical.
- Radios: 6 px (inputs, chips), 14 px (tarjetas), 999 px (botones píldora). Sombras casi nulas; usa bordes `line`.
- Mobile-first: diseña primero a 360–390 px.

### Componentes (crear en `components/ui` con variantes)
Botón (primario píldora brand con flecha en círculo, secundario contorno, WhatsApp) · Eyebrow (línea + texto en mono mayúsculas pequeñas) · Tarjeta de plan (precio tachado, badge, lista con checks, CTA) · Medidor de hallazgo (barra segmentada 10 celdas en semáforo + cifra mono) · Comparador toggle · Stepper 4 pasos · Chip de distrito · Acordeón FAQ (+ en círculo, `<details>` accesible) · Tarjeta de reseña (estrellas, nombre, fuente Google) · Logo-wall · Input de placa (máscara `AAA-000`) · Sello «Vehículo verificado» con QR (SVG) · Barra inferior móvil · Botón flotante WhatsApp (desktop) · Banner de cookies (Aceptar / Rechazar / Configurar) · Header fijo que se compacta al hacer scroll · Mega-menú de servicios · Footer con marca de agua.

### Interacciones (sobrias)
Contadores que suben una sola vez al entrar en viewport; barras de medidores que se llenan; header que cambia de transparente a sólido; hover de tarjetas con borde brand. Respeta `prefers-reduced-motion`. Nada de parallax pesado, partículas ni scroll-jacking.

### Para que NO parezca hecho por IA
- Prohibido: gradientes violeta-azul, glassmorphism genérico, blobs, íconos 3D, ilustraciones/fotos generadas por IA, emojis en titulares, «Desbloquea», «Potencia», «Revoluciona», tarjetas idénticas de 3 columnas con ícono genérico.
- Usa **fotos reales** del scrape (hallazgos, técnicos, equipos) con tratamiento consistente (recorte editorial, leve desaturación, pie de foto en mono: «Hallazgo real · Fuga en caja · 2025»).
- Datos concretos en vez de adjetivos («8 de cada 10 autos tienen fugas de aceite» > «la mejor calidad»).
- Detalles de oficio: numeración 01–04 en mono, códigos de escáner como decoración tipográfica, cuadrícula de «hoja de inspección» sutil en fondos, iconografía lineal propia (Lucide como base, trazo 1.5).
- Tono: experto que habla claro, cercano, sin exagerar; tuteo; frases cortas.

## 7. Stack técnico

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**, SSG para todo (`generateStaticParams`), sin backend obligatorio. Justificación: SEO/rendimiento (HTML estático), `next/image`, `next/font`, rutas y metadatos por página, fácil despliegue en Vercel o en cualquier hosting estático; el equipo ya trabaja en este stack.
- Contenido: `/content/*.ts` tipados (Zod para validar) + MDX (`@next/mdx` o `contentlayer`-free con `next-mdx-remote`) para blog y guía. Preparado para migrar a CMS headless (Sanity/Payload) en fase posterior.
- Formularios: Server Actions con validación Zod; en prototipo, guardan en consola/archivo y redirigen a WhatsApp. Anti-spam: honeypot.
- Paquetes permitidos: `lucide-react`, `clsx`, `zod`, `schema-dts` (tipos JSON-LD). Animación: CSS + `IntersectionObserver` (sin Framer Motion salvo necesidad justificada).
- Calidad: ESLint, Prettier, `@axe-core/playwright` + Playwright para pruebas e2e básicas, Lighthouse CI.

### Estructura de carpetas
```
/app
  /(site)/page.tsx                      home
  /(site)/servicios/page.tsx
  /(site)/servicios/[slug]/page.tsx
  /(site)/vende-tu-auto/page.tsx
  /(site)/como-funciona/page.tsx
  /(site)/cobertura/page.tsx
  /(site)/informe-de-ejemplo/page.tsx
  /(site)/tecnologia/page.tsx
  /(site)/guia/page.tsx  /guia/[slug]/page.tsx
  /(site)/blog/page.tsx  /blog/[slug]/page.tsx
  /(site)/nosotros/page.tsx
  /(site)/preguntas-frecuentes/page.tsx
  /(site)/contacto/page.tsx
  /(site)/legal/[slug]/page.tsx
  /(site)/libro-de-reclamaciones/page.tsx
  layout.tsx  sitemap.ts  robots.ts  opengraph-image.tsx  not-found.tsx
/components/{ui,sections,layout,seo}
/content/{negocio.ts, servicios.ts, faqs.ts, testimonios.ts, problemas.ts, proceso.ts, cobertura.ts, navegacion.ts}
/content/blog/*.mdx  /content/guia/*.mdx  /content/legal/*.mdx
/lib/{whatsapp.ts, analytics.ts, schema.ts, seo.ts, utils.ts}
/public/{img, logos, docs/Reporte-DiagnostiCAR.pdf, llms.txt}
/docs/{fuente/, PENDIENTES.md, DECISIONES.md, REDIRECTS.md}
/tests/e2e
```

## 8. SEO técnico, GEO y AEO

**SEO técnico**
- `metadata` por página: title ≤60 car. (patrón «{Tema} | DiagnostiCAR Lima»), description única ≤155 car. (¡hoy todas repiten la misma y la home está en `noindex`!), canonical absoluto, OG/Twitter con imagen generada (`opengraph-image.tsx`), `lang="es-PE"`, `hreflang` no necesario.
- `sitemap.ts` dinámico, `robots.ts` (index en producción, noindex en previews). Breadcrumbs visibles + `BreadcrumbList`.
- Un solo H1 por página; jerarquía H2/H3 lógica; URLs cortas en español sin fechas.
- Redirecciones 301 de la sección 4; 404 útil con buscador de servicios.
- Enlazado interno: cada artículo/guía enlaza a 1 servicio y a /servicios; cada servicio enlaza a guía relacionada.

**Datos estructurados (JSON-LD con `schema-dts`, en `lib/schema.ts`)**
- Global: `Organization` + `AutomotiveBusiness` (tipo correcto para este rubro; **no** MedicalBusiness) con `name`, `legalName` «Diagnosticar S.A.C.», `taxID` 20609649420, `url`, `logo`, `telephone` +51923374470, `address` (Av. José Pardo 1167 of. 303, Miraflores, Lima, PE), `geo` (-12.119244, -77.040568), `areaServed` (lista de distritos + «Lima Metropolitana»), `openingHoursSpecification` `[PENDIENTE CLIENTE]`, `sameAs` (IG, YouTube, Facebook, TikTok), `priceRange` «S/ 19 – S/ 549», `slogan` «Las máquinas no mienten».
- `/servicios` y fichas: `Service` (serviceType «Inspección vehicular pre-compra» / «Informe de antecedentes vehiculares»), `provider` → organización, `areaServed`, `offers` (`Offer` con `price`, `priceCurrency` PEN, `priceSpecification` con precio regular tachado), y `OfferCatalog` en la comparativa.
- FAQ visibles → `FAQPage` (solo con preguntas mostradas en la página).
- `/como-funciona` y `/guia/checklist` → `HowTo`.
- Blog y guía → `Article`/`BlogPosting` con `author`, `datePublished`, `dateModified`.
- `AggregateRating`: **no** marcar reseñas propias en el schema de la empresa (Google no muestra estrellas auto-servidas para LocalBusiness); mostrar el 4.9★ visualmente y enlazar a Google.
- Valida con Rich Results Test y Schema Validator (deja script `npm run check:schema` que valide JSON-LD con `schema-dts`).

**GEO (motores generativos: ChatGPT, Perplexity, Gemini, AI Overviews)**
- `/public/llms.txt` (y `/llms-full.txt` con texto de servicios, precios, cobertura, proceso y FAQ en Markdown) siguiendo llmstxt.org: descripción de 2 líneas, secciones «Servicios y precios», «Cobertura», «Cómo reservar», «Guías», enlaces canónicos.
- `robots.ts`: permitir `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `CCBot` (decisión del cliente; por defecto permitir).
- Contenido citable: frases-dato autocontenidas con fuente y fecha («Según informes propios de DiagnostiCAR 2024-2026, 4 de cada 10 autos usados revisados en Lima tenían el kilometraje bajado.»), tablas HTML reales (no imágenes) para precios y comparativas, definiciones claras («¿Qué es el escaneo electromagnético de carrocería?»).
- Entidad de marca consistente: mismo nombre «DiagnostiCAR», misma dirección/teléfono (NAP) en web, Google Business Profile y redes; página /nosotros con datos legales.
- Fechas visibles de actualización en precios y guías.

**AEO (respuestas directas, fragmentos destacados, voz)**
- Cada página de servicio y guía abre con un **resumen-respuesta de 40–60 palabras** bajo el H1.
- Encabezados en forma de pregunta real de usuario: «¿Cuánto cuesta revisar un auto usado antes de comprarlo en Lima?», «¿Cómo saber si un auto tiene el kilometraje bajado?», «¿Qué papeletas no ven las notarías?», «¿Cómo saber cuántos dueños tuvo un auto en Perú?».
- Listas numeradas para procesos, tablas para comparaciones (formatos que Google extrae).
- FAQ con respuestas de 1–3 frases; lenguaje natural para búsqueda por voz.

## 9. Accesibilidad, rendimiento y responsive

- **WCAG 2.2 AA**: contraste, foco visible (anillo brand 2 px), navegación por teclado completa (mega-menú, acordeón, toggle), `aria-*` correctos, labels en formularios, mensajes de error asociados, `alt` descriptivo en fotos de hallazgos, tamaños táctiles ≥44 px, `prefers-reduced-motion`.
- **Rendimiento** (móvil 4G, Lighthouse): LCP < 2.0 s, CLS < 0.05, INP < 200 ms; Performance ≥ 95, Accesibilidad ≥ 98, Buenas prácticas ≥ 95, SEO = 100. JS de cliente mínimo (Server Components por defecto), fuentes con `display: swap` y subset latin, imágenes AVIF/WebP con `sizes`, videos con facade (no cargar YouTube/Instagram hasta clic), pixels de terceros solo tras consentimiento.
- **Responsive mobile-first**: breakpoints 360 / 768 / 1024 / 1280. En móvil: planes en carrusel con snap, tabla comparativa con primera columna fija y scroll horizontal, barra inferior de CTA, menú a pantalla completa.

## 10. Fases y criterios de aceptación

**Fase 1 — Fundaciones y sistema de diseño**
Repo Next.js + TS + Tailwind v4, tokens (colores, tipografías, espaciado), componentes `ui` y página `/design-system` que los muestra todos en claro/oscuro. Carga de `docs/fuente` y archivos `/content/*.ts` poblados desde `contenido.json` (script `scripts/import-content.ts`). `PENDIENTES.md` inicial con la lista `pendiente_cliente` + `inconsistencias_detectadas` del JSON.
✅ Aceptación: `npm run build` sin errores; `/design-system` navegable; contrastes documentados AA; ningún dato inventado (revisión manual contra JSON).

**Fase 2 — Layout y Home**
Header (mega-menú, CTA doble), footer, barra móvil, botón WhatsApp, banner de cookies, y la Home completa (secciones 5.1).
✅ Aceptación: Home fiel al copy; todos los CTAs de WhatsApp con mensaje prellenado por servicio y evento `track`; Lighthouse móvil cumple §9; se ve bien en 360, 768, 1280 px (adjunta capturas en `docs/capturas/fase2`).

**Fase 3 — Servicios y conversión**
`/servicios`, 6 fichas `/servicios/[slug]`, `/vende-tu-auto`, `/como-funciona`, `/cobertura`, `/informe-de-ejemplo`, formulario «Consulta placa gratis» y contacto (Server Actions + fallback WhatsApp).
✅ Aceptación: precios idénticos a `contenido.json`; tabla comparativa accesible con teclado y lector de pantalla; formularios validan (placa peruana, celular 9 dígitos que empieza por 9) y muestran estados de éxito/error.

**Fase 4 — Contenido educativo**
`/tecnologia`, `/guia` + 3 subpáginas, `/blog` + 21 artículos migrados a MDX, `/nosotros`, `/preguntas-frecuentes`, legales y Libro de Reclamaciones.
✅ Aceptación: 21 artículos con slug limpio y fecha original; guía con resumen-respuesta e índice; T&C verbatim.

**Fase 5 — SEO / GEO / AEO**
Metadata por página, `sitemap.ts`, `robots.ts`, JSON-LD (§8), `llms.txt` y `llms-full.txt`, redirecciones 301 (+ `docs/REDIRECTS.md` con tabla origen→destino), OG images.
✅ Aceptación: 0 errores en Rich Results Test para home, una ficha de servicio, FAQ y un artículo; todas las URLs antiguas del sitemap actual (lista en `contenido.json → paginas[].url`) responden 301/410 según la tabla; no hay titles/descriptions duplicados (script de verificación).

**Fase 6 — QA y entrega**
Pruebas Playwright (navegación, CTAs WhatsApp, formularios), `axe` sin violaciones serias, Lighthouse CI en 5 URLs clave, revisión de copy y `[PENDIENTE CLIENTE]` visibles resaltados en modo preview (badge amarillo) y ocultos/neutros en producción.
✅ Aceptación: suite verde; informe `docs/QA.md` con puntuaciones y capturas; listado final de pendientes para el cliente.

## 11. Pendientes conocidos (no bloquean el prototipo)
Ver `contenido.json → pendiente_cliente` e `inconsistencias_detectadas`. Los más importantes: horario exacto; precio final de Plus (S/ 549 vs 559) y Antecedentes Completo (S/ 49 vs 59) y si incluyen IGV; precio de Asesoría online y Certificación; medios de pago; email oficial; URL del grupo de Facebook, @TikTok y ficha de Google; fotos/nombres reales de técnicos; informe de ejemplo actualizado; logo en SVG; política de privacidad/cookies; confirmar cifras de leads y seguidores de la landing de venta.

---
**Empieza por la Fase 1.** Antes de escribir código, resume en 10 líneas tu entendimiento del negocio, el mapa del sitio y la dirección de arte, y lista las dudas que tengas.
