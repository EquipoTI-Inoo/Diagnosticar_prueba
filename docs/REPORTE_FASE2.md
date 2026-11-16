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
