# Pendientes del cliente

> Generado por `scripts/import-content.ts` a partir de `contenido.json` (2026-11-15). Lo que figura aquí aparece en el sitio como `[PENDIENTE CLIENTE]` o `[CONFIRMAR CLIENTE]`. **No editar a mano:** los pendientes nuevos se agregan en la sección C del script y se regenera con `npm run import:content`.

## A. Información que falta (`pendiente_cliente`)

- [ ] Horario exacto de atención
- [ ] Precio de Asesoría precompra online y de Certifica tu auto
- [ ] Confirmar precio final del Plus y del Antecedentes Completo; si los precios incluyen IGV
- [ ] Medios de pago (Yape/Plin/tarjeta/transferencia) y vigencia de la cuenta BCP
- [ ] Email oficial
- [ ] URL del grupo de Facebook y @ de TikTok
- [ ] Lista vigente de distritos sin recargo y tarifa de traslado
- [ ] Fotos reales del equipo/técnicos (nombres, certificaciones de los técnicos), fotos de equipos
- [ ] Nota de prensa en Gestión (URL) y detalle de la relación con Rally Caminos del Inca, LAUNCH, Autel
- [ ] Testimonios con permiso de uso (foto/nombre), reseñas Google vía widget/API
- [ ] Informe de ejemplo actualizado (el PDF actual es de 2022)
- [ ] Logo vectorial (SVG) y manual de marca; solo hay webp/png
- [ ] Política de privacidad y cookies (existe referencia pero no texto propio completo)
- [ ] Número de técnicos, años exactos de fundación
- [ ] Cobertura fuera de Lima (provincias) y atención en notarías/concesionarios

## B. Inconsistencias detectadas en el sitio actual (`inconsistencias_detectadas`)

- [ ] Precio Plus: S/ 549 (home 2026) vs S/ 559 (/precios/)
- [ ] Antecedentes Completo: S/ 49 vs S/ 59 (landings) y '+ IGV' en una landing; ~30 págs vs +25 págs
- [ ] Duración: 40–70 min (home) vs 30–40 / 30–45 / 50–70 / 40–50 en otras páginas
- [ ] Reseñas: +575 (home) vs +400 (meta description) vs 450 (landing)
- [ ] Diagnósticos: +6,000 vs 5,000
- [ ] Puntos de revisión: +200 (Básico) vs 300 ítems (guía/campaña) vs 320 puntos (legacy)
- [ ] % de autos con problemas: 70% / 80% / 90% según landing (sin fuente)
- [ ] Email info@diagnosticar.com (dominio distinto)
- [ ] Home con robots 'noindex' y meta description genérica repetida en casi todas las páginas
- [ ] Páginas basura indexables: sample-page, duplicados '[#1505]' '[#1573]', 'borrador', landings boost/campaña, -legacy
- [ ] El aviso del blog reconoce que las imágenes de artículos son ilustraciones generadas con IA

## C. Decisiones provisionales tomadas en el prototipo (confirmar)

- [ ] Precios usados: los de la home 2026 → Antecedentes Completo **S/ 49**, DiagnostiCAR Plus **S/ 549**. Confirmar y aclarar si incluyen IGV.
- [ ] Cifras usadas: +6,000 diagnósticos, +575 reseñas, 4.9★, 4 años, «+200 puntos» de revisión, duración 40–70 min.
- [ ] Cifras de la landing de venta marcadas `[CONFIRMAR CLIENTE]`: 300–400 leads diarios y +100k seguidores.
- [ ] Email: no se publica `info@diagnosticar.com` hasta confirmar el oficial.
- [ ] Cuenta BCP y CCI del sitio antiguo: **no** se importaron. Confirmar medios de pago (Yape/Plin/tarjeta/transferencia) antes de publicarlos.
- [ ] Reseñas: 3 testimonios del sitio antiguo no tienen nombre; ninguno tiene permiso de uso confirmado.
- [ ] Aliado SONAX: solo aparece en páginas antiguas; no se muestra como aliado vigente.
- [ ] Asesoría precompra online: no se muestra el precio antiguo (S/ 99) hasta confirmar.
- [ ] Logo: el PNG tiene «CAR» en blanco (solo funciona sobre fondo oscuro). Se necesita SVG en versiones para fondo claro y oscuro.
- [ ] Sello «Vehículo verificado»: el QR del prototipo es ilustrativo. Falta la URL real de verificación.
- [ ] Gestión: URL de la nota de prensa. Ficha de Google Business (URL para «Ver reseñas en Google»).
- [ ] IDs de Meta Pixel, TikTok Pixel y GTM.
- [ ] Fotos de hallazgos sin subtítulos quemados, en especial choque oculto y problemas documentarios.
- [ ] Fotos que muestren el hallazgo: hoy «kilometraje bajado» (kilometraje200k.jpg) muestra una llanta y «airbags reventados» (airbag.jpg) no muestra un airbag; sus `alt` originales no describen la imagen y se reemplazaron por descripciones literales.
