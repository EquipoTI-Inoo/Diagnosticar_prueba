# Pendientes del cliente · lista final consolidada (Fase 6)

Fecha: 16/11/2026. Todo lo que aparece en el sitio como `[PENDIENTE CLIENTE]` o `[CONFIRMAR CLIENTE]`, más las decisiones provisionales del prototipo que el cliente debe confirmar. En el build de **preview** cada pendiente se ve como un badge amarillo; en **producción** se muestra neutro («Por confirmar»).

La lista original extraída de `contenido.json` (`pendiente_cliente` + `inconsistencias_detectadas`) está en `docs/PENDIENTES-fuente.md`; aquí se agrupa y se deduplica.

## 1. Datos del negocio

- [ ] **Horario de atención** exacto (hoy «Lunes a domingo, [PENDIENTE]»). Sin él no hay `openingHours` en el schema.
- [ ] **Email oficial**. No se publica `info@diagnosticar.com` (dominio distinto) hasta confirmarlo.
- [ ] **Redes**: @usuario de TikTok (hoy enlace corto `vt.tiktok.com/ZSPVKqXRd/`, también en `sameAs`), URL del grupo de Facebook «Compra Segura Autos Usados Lima», URL de la ficha de Google Business («Ver reseñas en Google»).
- [ ] **Lista vigente de distritos sin recargo** (hoy 10) y tarifa de traslado; cobertura fuera de Lima, notarías y concesionarios.
- [ ] **Cifras**: se usaron las de la home 2026 (+6,000 diagnósticos, +575 reseñas, 4.9★, 4 años, «+200 puntos», 40–70 min). Discrepancias del sitio actual: reseñas +575/+400/450, diagnósticos +6,000/5,000, puntos +200/300/320, duración 40–70 vs 30–40/30–45/50–70/40–50, % de autos con problemas 70/80/90 % sin fuente.
- [ ] **Landing de venta**: 300–400 leads diarios y +100k seguidores (`[CONFIRMAR CLIENTE]`).
- [ ] **Equipo**: número de técnicos, nombres, fotos y certificaciones («Técnicos certificados» va sin detalle); año exacto de fundación.
- [ ] **Medios de pago** (Yape, Plin, tarjeta, transferencia). La cuenta BCP y el CCI del sitio antiguo **no** se publicaron.
- [ ] **Relaciones y prensa**: URL de la nota en Gestión; alcance de la relación con Rally Caminos del Inca, LAUNCH y Autel; SONAX solo aparece en páginas antiguas (no se muestra como aliado vigente).
- [ ] **Testimonios**: permiso de uso, nombre y foto (3 del sitio antiguo no tienen nombre); reseñas de Google vía widget o API.
- [ ] **Copy redactado en el prototipo** para validar: titulares de comparador, consulta por placa, confianza y footer (Fase 2); resúmenes-respuesta, políticas en lenguaje simple y textos de formularios (Fase 3); resúmenes AEO de guía y servicios (Fase 5).

## 2. Precios y servicios

- [ ] **Antecedentes Completo S/ 49** (vs S/ 59 en landings, y «+ IGV» en una) y **DiagnostiCAR Plus S/ 549** (vs S/ 559 en /precios/): por confirmar.
- [ ] **¿Los precios incluyen IGV?** (también en los `Offer` del schema).
- [ ] **Precio de Asesoría precompra online** (no se muestra el antiguo S/ 99) y de **Certifica tu auto**.
- [ ] **Antecedentes incluidos en DiagnostiCAR y Plus**: ¿básico o completo? (en la tabla figura «Por confirmar»).
- [ ] **Plazo de entrega** del informe de antecedentes y de la asesoría online.
- [ ] **Antecedentes Completo**: ~30 vs +25 páginas.
- [ ] **Informe de ejemplo actualizado** (el PDF actual es de 2022).
- [ ] **Sello «Vehículo verificado»**: URL pública de verificación y QR real (el del prototipo es ilustrativo).

## 3. Legales

- [ ] **Política de privacidad** y **política de cookies**: textos oficiales (hoy `[PENDIENTE CLIENTE]`).
- [ ] **Libro de Reclamaciones**: sistema real de registro (número de hoja, copia por correo), listas de provincias y distritos, e ícono oficial de Indecopi. El texto original dice «quince (15) días naturales»: revisar con asesoría legal la norma vigente.
- [ ] **Formularios**: destino real de los leads (CRM, correo u hoja de cálculo). En el prototipo se guardan en `.data/leads.jsonl` (local, fuera de git); validar el texto de consentimiento.

## 4. Fotos y medios

- [ ] **Logo vectorial (SVG)**, versión oficial para fondo claro y manual de marca (hoy derivados del PNG 1894×1074; el laptop gris se ve tenue sobre claro).
- [ ] **Fotos reales de hallazgos** por problema (kilometraje adulterado, airbag detonado, choque con masilla, problemas documentarios), sin subtítulos quemados. Hoy «kilometraje» muestra una llanta y «airbags» un vano motor.
- [ ] **Fotos para «Confianza técnica»** y de equipos (el sitio actual usa 3 imágenes que parecen de banco o generadas).
- [ ] **Blog**: autor técnico con bio y foto (hoy «Equipo DiagnostiCAR»); imágenes propias (las actuales son ilustraciones IA y no se usaron; la imagen de cada artículo es una portada tipográfica); ¿se republican o actualizan las fechas de febrero de 2025?

## 5. Medición e integraciones

- [ ] IDs de **GTM**, **Meta Pixel** y **TikTok Pixel** (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`). Solo se cargan con consentimiento.
- [ ] **Página de gracias** y medición de conversiones (`whatsapp_click`, envíos de formularios) en el nuevo sitio; hoy `/gracias-revision-antecedentes/` redirige a la ficha Antecedentes Completo.
- [ ] **Hosting y dominio**: dónde se publica (Hostinger u otro con Node 20+ para `next start`) y acceso a DNS para `diagnosticarperu.com`.

## 6. Decisiones de redirección y bots de IA

- [ ] **410 del área de usuario** del WordPress (login, register, password-reset, members, mis-reportes, panel-tecnico): confirmar que nadie la usa; si hay clientes activos, cambiar a 301.
- [ ] **Landings de campaña y boost** → 301 a `/servicios` o a la ficha: confirmar si hay anuncios activos que necesiten landing propia.
- [ ] **Bots de IA**: el robots de producción los **permite** (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot). Confirmar la política.
- [ ] Revisar la tabla completa de `docs/REDIRECTS.md` (85 × 301, 30 × 410).

## 7. Después de publicar (Rich Results y Search Console)

- [ ] Construir siempre con `SITE_ENV=production` (si no, el sitio sale con `noindex` y badges amarillos).
- [ ] **Google Rich Results Test** en home, una ficha, `/preguntas-frecuentes` y un artículo (en local se validó con el validador oficial de Schema.org: 0 errores).
- [ ] **Search Console**: verificar la propiedad, enviar `https://diagnosticarperu.com/sitemap.xml`, revisar cobertura y las redirecciones de las URLs antiguas.
- [ ] Repetir Lighthouse (`npm run lhci`) contra la URL pública y revisar Core Web Vitals reales (CrUX) a las 4 semanas.
