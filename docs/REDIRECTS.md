# Redirecciones del sitio actual al nuevo

Generado con `npm run docs:redirects` desde `lib/redirecciones.ts` y el frontmatter `urlOriginal` de `content/blog/*.mdx`. No editar a mano.

- **301** en `next.config.ts` (`redirects()`), registradas con y sin barra final: cada URL antigua responde con **un solo salto** al destino.
- **410 Gone** en `middleware.ts`, con página mínima y `X-Robots-Tag: noindex`.
- Cualquier otra ruta con barra final recibe un 301 a la misma ruta sin barra (`skipTrailingSlashRedirect` + middleware). Por eso `/servicios/`, `/nosotros/`, etc., responden con 301 y no con el 308 por defecto de Next.
- Verificación: `BASE=http://localhost:3000 npm run check:redirecciones` contra `next start`. Prueba **todas** las URLs únicas de `contenido.json → paginas[].url` y que cada destino responda 200.

Totales: 85 redirecciones 301 (21 de artículos) · 30 rutas 410 · la home `/` responde 200.

## 301 · Páginas

| Origen (sitio actual) | Destino | Motivo | ¿En contenido.json? |
| --- | --- | --- | --- |
| `/precios/` | `/servicios` | §4 | sí |
| `/servicios-1/` | `/servicios` | §4 | no (§4) |
| `/servicios/` | `/servicios` | §4 | no (§4) |
| `/service/` | `/servicios` | §4 | sí |
| `/diagnostico/` | `/servicios` | §4 | sí |
| `/servicio-diagnosticar/` | `/servicios/diagnosticar` | §4 | sí |
| `/diagnosticar/` | `/servicios/diagnosticar` | §4 | sí |
| `/reporte-diagnosticar-2/` | `/servicios/diagnosticar` | §4 | sí |
| `/servicio-diagnostico-basico/` | `/servicios/diagnostico-basico` | §4 | sí |
| `/reporte-basico/` | `/servicios/diagnostico-basico` | §4 | sí |
| `/reporteverbal/` | `/servicios/diagnostico-basico` | §4 | sí |
| `/servicio-diagnosticar-plus/` | `/servicios/diagnosticar-plus` | §4 | sí |
| `/reporte-diagnosticar-plus/` | `/servicios/diagnosticar-plus` | §4 | sí |
| `/servicio-antecedentes-basico/` | `/servicios/antecedentes-basico` | §4 | sí |
| `/servicio-antecedentes-completo/` | `/servicios/antecedentes-completo` | §4 | sí |
| `/antecedentes/` | `/servicios/antecedentes-completo` | §4 | sí |
| `/antecedentes-3/` | `/servicios/antecedentes-completo` | §4 | sí |
| `/revision-antecedes-boost/` | `/servicios/antecedentes-completo` | §4 | sí |
| `/servicio-asesoria-precompra/` | `/servicios/asesoria-precompra-online` | §4 | sí |
| `/asesoria-virtual/` | `/servicios/asesoria-precompra-online` | §4 | sí |
| `/asesoria-pre-compra-online/` | `/servicios/asesoria-precompra-online` | §4 | sí |
| `/servicio-certifica-tu-auto/` | `/vende-tu-auto` | §4 | sí |
| `/venta-sin-consignar/` | `/vende-tu-auto` | §4 | sí |
| `/nosotros/` | `/nosotros` | §4 | sí |
| `/about/` | `/nosotros` | §4 | sí |
| `/contact/` | `/contacto` | §4 | sí |
| `/contacto/` | `/contacto` | §4 | no (§4) |
| `/guia/` | `/guia` | §4 | sí |
| `/guia-2/` | `/guia` | §4 | sí |
| `/gratis/` | `/guia` | §4 | sí |
| `/checklist-precompra/` | `/guia/checklist` | §4 | sí |
| `/top-5-problemas/` | `/guia/problemas-comunes` | §4 | sí |
| `/puntos-importantes/` | `/guia/problemas-comunes` | §4 | sí |
| `/centro-de-ayuda/` | `/guia/consulta-placa-gratis` | §4 | sí |
| `/unico-dueno-2/` | `/guia/consulta-placa-gratis` | §4 | sí |
| `/verbal-gratis/` | `/guia/consulta-placa-gratis` | §4 | sí |
| `/escaneo/` | `/tecnologia` | §4 | sí |
| `/detector-de-choques/` | `/tecnologia` | §4 | sí |
| `/videoscopo/` | `/tecnologia` | §4 | sí |
| `/revision-vehicular/` | `/tecnologia` | §4 | sí |
| `/manejo/` | `/tecnologia` | §4 | sí |
| `/escrito/` | `/tecnologia` | §4 | sí |
| `/verbal/` | `/tecnologia` | §4 | sí |
| `/como-comprar/` | `/como-funciona` | §4 | sí |
| `/informe-ejemplo/` | `/informe-de-ejemplo` | §4 | sí |
| `/terminos-y-condiciones/` | `/legal/terminos-y-condiciones` | §4 | sí |
| `/blog/` | `/blog` | Misma página sin barra final | sí |
| `/cobertura/` | `/cobertura` | Misma página sin barra final | sí |
| `/libro-de-reclamaciones/` | `/libro-de-reclamaciones` | Misma página sin barra final | sí |
| `/2025/01/31/` | `/blog` | Archivo por fecha de WordPress | sí |
| `/category/diagnosticos/` | `/blog#diagnosticos` | Categoría del blog | sí |
| `/category/tip-mecanicos/` | `/blog#tips-mecanicos` | Categoría del blog | sí |
| `/category/novedades/` | `/blog#novedades` | Categoría del blog | sí |
| `/category/entrevistas/` | `/blog` | Categoría sin artículos en el sitio nuevo | sí |
| `/category/experiencias/` | `/blog` | Categoría sin artículos en el sitio nuevo | sí |
| `/asesora-pre-compra-online/` | `/servicios/asesoria-precompra-online` | Landing de campaña (boost) del mismo servicio | sí |
| `/asesoria-pre-compra-online-boost/` | `/servicios/asesoria-precompra-online` | Landing de campaña (boost) del mismo servicio | sí |
| `/revision-pre-compra-boost/` | `/servicios` | Landing de campaña: puede recibir tráfico de anuncios antiguos | sí |
| `/landing-pre-compra/` | `/servicios` | Landing de campaña: puede recibir tráfico de anuncios antiguos | sí |
| `/landing-campana/` | `/servicios` | Landing de campaña: puede recibir tráfico de anuncios antiguos | sí |
| `/campana/` | `/servicios` | Landing de campaña: puede recibir tráfico de anuncios antiguos | sí |
| `/otros-servicios/` | `/servicios` | Listado de servicios antiguo | sí |
| `/tienda/` | `/servicios` | Listado de servicios antiguo | sí |
| `/gracias-revision-antecedentes/` | `/servicios/antecedentes-completo` | Página de agradecimiento del formulario antiguo | sí |

## 301 · Artículos del blog (/AAAA/MM/DD/slug/ → /blog/slug sin emojis)

| Origen | Destino |
| --- | --- |
| `/2025/02/12/✅-checklist-de-diagnostico-antes-de-comprar-un-auto-usado/` | `/blog/checklist-de-diagnostico-antes-de-comprar-un-auto-usado` |
| `/2025/02/13/como-detectar-problemas-de-alineacion-y-balanceo-del-vehiculo/` | `/blog/como-detectar-problemas-de-alineacion-y-balanceo-del-vehiculo` |
| `/2025/02/14/como-revisar-la-presion-de-los-neumaticos-y-por-que-es-importante/` | `/blog/como-revisar-la-presion-de-los-neumaticos-y-por-que-es-importante` |
| `/2025/02/01/cuidado-con-el-kilometraje-aprende-a-comprobarlo/` | `/blog/cuidado-con-el-kilometraje-aprende-a-comprobarlo` |
| `/2025/02/12/cuidado-lo-que-suelen-esconder-los-autos-usados-🚨/` | `/blog/cuidado-lo-que-suelen-esconder-los-autos-usados` |
| `/2025/02/13/diagnostico-del-sistema-de-aire-acondicionado-tips-para-mantenerlo-en-buen-estado/` | `/blog/diagnostico-del-sistema-de-aire-acondicionado-tips-para-mantenerlo-en-buen-estado` |
| `/2025/02/12/diferencias-entre-un-diagnostico-visual-y-uno-computarizado/` | `/blog/diferencias-entre-un-diagnostico-visual-y-uno-computarizado` |
| `/2025/02/14/el-futuro-del-mercado-de-coches-usados-por-que-las-consultas-virtuales-y-los-diagnosticos-avanzados-seran-clave/` | `/blog/el-futuro-del-mercado-de-coches-usados-por-que-las-consultas-virtuales-y-los-diagnosticos-avanzados-seran-clave` |
| `/2025/02/12/elige-bien-5-tendencias-clave-para-el-futuro-del-diagnostico-vehicular-🚀/` | `/blog/elige-bien-5-tendencias-clave-para-el-futuro-del-diagnostico-vehicular` |
| `/2025/02/01/es-el-mejor-momento-para-comprar-un-coche-usado/` | `/blog/es-el-mejor-momento-para-comprar-un-coche-usado` |
| `/2025/01/31/ia-y-diagnostico-automotriz-el-futuro-de-los-diagnosticos-de-coche/` | `/blog/ia-y-diagnostico-automotriz-el-futuro-de-los-diagnosticos-de-coche` |
| `/2025/02/14/las-herramientas-y-tecnologias-que-utilizamos-en-diagnosticar-peru-para-un-diagnostico-preciso-de-vehiculos-usados/` | `/blog/las-herramientas-y-tecnologias-que-utilizamos-en-diagnosticar-peru-para-un-diagnostico-preciso-de-vehiculos-usados` |
| `/2025/02/14/las-marcas-de-coches-usados-mas-confiables-para-comprar-este-ano/` | `/blog/las-marcas-de-coches-usados-mas-confiables-para-comprar-este-ano` |
| `/2025/02/14/mi-primer-coche-usado-como-evitar-los-errores-comunes-con-la-ayuda-de-un-diagnostico-profesional/` | `/blog/mi-primer-coche-usado-como-evitar-los-errores-comunes-con-la-ayuda-de-un-diagnostico-profesional` |
| `/2025/01/31/no-cometas-errores-la-asesoria-virtual-que-todo-comprador-primerizo-necesita/` | `/blog/no-cometas-errores-la-asesoria-virtual-que-todo-comprador-primerizo-necesita` |
| `/2025/02/01/no-compres-sin-probarlo-la-importancia-de-la-prueba-de-manejo/` | `/blog/no-compres-sin-probarlo-la-importancia-de-la-prueba-de-manejo` |
| `/2025/01/31/entrada-1/` | `/blog/no-compres-sin-saber-el-valor-del-diagnostico-de-antecedentes` |
| `/2025/02/13/por-que-tu-auto-pierde-potencia-claves-para-un-diagnostico-eficiente/` | `/blog/por-que-tu-auto-pierde-potencia-claves-para-un-diagnostico-eficiente` |
| `/2025/02/12/por-que-un-informe-de-diagnostico-es-clave-para-evitar-estafas-al-comprar-un-vehiculo/` | `/blog/por-que-un-informe-de-diagnostico-es-clave-para-evitar-estafas-al-comprar-un-vehiculo` |
| `/2025/02/12/preguntas-esenciales-que-debes-hacer-al-vendedor-de-un-auto-usado/` | `/blog/preguntas-esenciales-que-debes-hacer-al-vendedor-de-un-auto-usado` |
| `/2025/02/12/que-componentes-electricos-pueden-fallar-en-un-auto-y-como-diferenciarlos/` | `/blog/que-componentes-electricos-pueden-fallar-en-un-auto-y-como-diferenciarlos` |

## 410 · Eliminadas

| Origen | Motivo |
| --- | --- |
| `/sample-page/` | Página basura de WordPress |
| `/borrador/` | Página basura de WordPress |
| `/home-2/` | Página basura de WordPress |
| `/revision-antecedes-boost-duplicado-1505/` | Duplicado [#1505]/[#1573] |
| `/revision-pre-compra-boost-duplicado-1573/` | Duplicado [#1505]/[#1573] |
| `/blog-legacy/` | Versión *-legacy |
| `/contact-legacy/` | Versión *-legacy |
| `/guia-2-legacy/` | Versión *-legacy |
| `/nosotros-legacy/` | Versión *-legacy |
| `/servicios-1-legacy/` | Versión *-legacy |
| `/preview-antecedentes-basico/` | Borrador preview-* |
| `/preview-antecedentes-completo/` | Borrador preview-* |
| `/preview-asesoria-precompra/` | Borrador preview-* |
| `/preview-blog/` | Borrador preview-* |
| `/preview-certifica-tu-auto/` | Borrador preview-* |
| `/preview-contacto/` | Borrador preview-* |
| `/preview-diagnosticar-plus/` | Borrador preview-* |
| `/preview-diagnostico-basico/` | Borrador preview-* |
| `/preview-guia/` | Borrador preview-* |
| `/preview-legales/` | Borrador preview-* |
| `/preview-mis-reportes/` | Borrador preview-* |
| `/preview-nosotros/` | Borrador preview-* |
| `/preview-servicio-diagnosticar/` | Borrador preview-* |
| `/preview-servicios/` | Borrador preview-* |
| `/login/` | Área de usuarios de WordPress: no existe en el sitio nuevo [CONFIRMAR CLIENTE] |
| `/register/` | Área de usuarios de WordPress: no existe en el sitio nuevo [CONFIRMAR CLIENTE] |
| `/password-reset/` | Área de usuarios de WordPress: no existe en el sitio nuevo [CONFIRMAR CLIENTE] |
| `/members/` | Área de usuarios de WordPress: no existe en el sitio nuevo [CONFIRMAR CLIENTE] |
| `/mis-reportes/` | Área de usuarios de WordPress: no existe en el sitio nuevo [CONFIRMAR CLIENTE] |
| `/panel-tecnico/` | Área de usuarios de WordPress: no existe en el sitio nuevo [CONFIRMAR CLIENTE] |

## Decisiones a confirmar con el cliente

- Área de usuarios de WordPress (`/login/`, `/register/`, `/mis-reportes/`, `/panel-tecnico/`…): **410**. Si los clientes descargan informes ahí, hay que definir dónde quedará esa función antes de publicar.
- Landings de campaña (`/campana/`, `/landing-campana/`, `/landing-pre-compra/`, `/revision-pre-compra-boost/`): **301 a `/servicios`**, por si algún anuncio antiguo sigue enlazándolas.
- `/gracias-revision-antecedentes/`: 301 a la ficha de Antecedentes Completo. Si se usaba como conversión en Ads o Meta, hay que reconfigurarla con los eventos nuevos.
