# Entendimiento del encargo y dudas

> Escrito antes de empezar la Fase 1 (15/11/2026). Modo no interactivo: las dudas quedan aquí y, mientras no haya respuesta, se aplica la opción más simple (registrada en `docs/DECISIONES.md`).

## Resumen en 10 líneas

1. **Negocio:** DiagnostiCAR (Diagnosticar S.A.C., RUC 20609649420) hace diagnóstico vehicular **pre-compra a domicilio** en Lima Metropolitana: antecedentes legales/registrales + inspección técnica con 6 escáneres, escaneo electromagnético, videoscopía, kilometraje, VIN/motor. Lema: «Las máquinas no mienten».
2. **Oferta:** escalera de 5 planes (Antecedentes Básico S/ 19 → Completo S/ 49 → Diagnóstico Básico S/ 239 → DiagnostiCAR S/ 349, «Más elegido» → Plus S/ 549), más Asesoría precompra online y Certificación para vender (sello con QR), ambos con precio pendiente.
3. **Conversión:** todo empuja a WhatsApp con mensaje prellenado por servicio (reserva con 50 % de adelanto); secundaria: consulta gratis por placa (lead). Cada clic se mide con `track()` → `dataLayer`, respetando cookies.
4. **Públicos:** comprador de auto usado en Lima (miedo a la estafa, no sabe de mecánica), comprador con placa que decide hoy, vendedor particular, comprador fuera de Lima, B2B (oculto). Navegación por 4 etapas: evaluando → buscando → ya tengo placa → quiero vender.
5. **Mapa del sitio:** Home, `/servicios` (comparativa) + 6 fichas, `/vende-tu-auto`, `/como-funciona`, `/cobertura`, `/informe-de-ejemplo`, `/tecnologia`, `/guia` (pilar SEO) + 3 subpáginas, `/blog` (21 artículos MDX), `/nosotros`, `/preguntas-frecuentes`, `/contacto`, legales y Libro de Reclamaciones; más ~60 redirecciones 301/410 del WordPress actual.
6. **Dirección de arte «Informe técnico»:** que se sienta como el informe de un perito — datos, semáforos (ok/warn/alert), fotos reales con pie en mono, numeración 01–04, cuadrícula de hoja de inspección. Ritmo de inoo.pe (oscuro/claro alterno, palabra clave en color, métricas en hero, comparador, FAQ minimalista, marca de agua en footer) con identidad propia.
7. **Sistema visual:** tinta `#0B1214` + papel `#F5F6F3` + teal de marca `#04ADBF` (solo sobre oscuro o como fondo de botón con texto tinta) y `#00727E` para enlaces en claro. Archivo (con eje `wdth`) para titulares, Inter Tight para texto, JetBrains Mono para cifras/placas/precios.
8. **Reglas duras:** cero datos inventados (lo que falta → `[PENDIENTE CLIENTE]` + `docs/PENDIENTES.md`); contenido tipado en `/content`, nunca en componentes; español de Perú con tuteo; nada de imágenes del blog (IA) ni estética «hecha por IA».
9. **Stack:** Next.js 15 App Router + TS + Tailwind v4, todo SSG, Zod para validar contenido, `lucide-react`/`clsx`/`zod`/`schema-dts` como únicas dependencias de runtime; SEO/GEO/AEO fuerte (JSON-LD `AutomotiveBusiness`, `llms.txt`, resúmenes-respuesta).
10. **Método:** 6 fases con criterios de aceptación. **En esta ejecución solo hago la Fase 1** (fundaciones, tokens, componentes `ui`, `/design-system`, importación de contenido y `PENDIENTES.md`), hago commit, escribo `docs/REPORTE_FASE1.md` y me detengo.

## Dudas (y qué asumo mientras tanto)

| # | Duda | Supuesto provisional |
|---|---|---|
| 1 | El prompt pide **Next.js 15**, pero la versión estable actual es la 16. ¿Se queda en 15? | Uso **Next 15.5.x** tal como dice el documento. Migrar a 16 es sencillo después. |
| 2 | Precios en conflicto: Plus S/ 549 vs 559; Antecedentes Completo S/ 49 vs 59; ¿incluyen IGV? | Uso los de la **home 2026** (S/ 549 y S/ 49) y marco ambos con `pendiente: true`. |
| 3 | Precio de Asesoría online (legacy S/ 99) y de Certificación. | `null` + `[PENDIENTE CLIENTE]`; no se muestra S/ 99. |
| 4 | Email: `info@diagnosticar.com` sale en T&C pero es de otro dominio. | No se publica; `[PENDIENTE CLIENTE]`. Se guarda solo como referencia interna. |
| 5 | Horario exacto (solo sabemos «lunes a domingo»). | «Lunes a domingo» + horas `[PENDIENTE CLIENTE]`. |
| 6 | El logo PNG tiene «CAR» en blanco (solo funciona sobre fondo oscuro) y no hay SVG. | Sobre oscuro uso el PNG; sobre claro, un logotipo tipográfico provisional «DiagnostiCAR». Logo SVG en pendientes. |
| 7 | Número de cuenta BCP/CCI del sitio legacy. | **No** se importan a `/content` (regla: no publicar números de cuenta sin confirmar). |
| 8 | Los testimonios del sitio legacy no tienen nombre. ¿Se pueden usar? | Se importan con `autor: null`; en la home solo se usarán los que tienen nombre (Google). Permiso de uso en pendientes. |
| 9 | Puntos de revisión: +200 / 300 / 320. Duración: 40–70 vs otras cifras. Reseñas +575 vs +400/450. Diagnósticos +6,000 vs 5,000. | Uso la cifra de la home 2026 (+200, 40–70 min, +575, +6,000) y listo las discrepancias en `PENDIENTES.md`. |
| 10 | La Fase 1 pide «componentes `ui`» y la Fase 2 pide header, footer, barra móvil, botón WhatsApp flotante y banner de cookies. | En Fase 1 construyo los componentes de §6 que no son «cromo» del sitio; header/mega-menú/footer/barra móvil/botón flotante/cookies quedan para la Fase 2, que los lista explícitamente. |
| 11 | El sello «Vehículo verificado» lleva un QR, pero aún no existe la URL de verificación. | QR ilustrativo generado en SVG (patrón no escaneable, marcado como ejemplo). Cuando exista la URL, se genera uno real. |
| 12 | Formato de placa: la máscara pedida es `AAA-000`, pero en Perú existen placas como `A1B-234`. | Acepto 1 letra + 2 alfanuméricos + 3 dígitos (`ABC-123`, `A1B-234`). |
| 13 | `docs/fuente/` pesa ~120 MB (incluye un video de 44 MB). | Se versiona tal cual, como pide el documento. Si el repo va a GitHub, conviene Git LFS para `assets/` y `raw/`. |
| 14 | Hoja de inspección / fondos: ¿hay manual de marca? | No hay; se define desde cero con los tokens del documento. |
