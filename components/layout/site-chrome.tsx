import { CookieBanner } from "@/components/layout/cookie-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { schemaOrganizacion } from "@/lib/schema";
import { MobileCtaBar } from "@/components/layout/mobile-cta-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThirdPartyScripts } from "@/components/layout/third-party-scripts";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { Button } from "@/components/ui/button";
import { IconWhatsApp } from "@/components/ui/icons";
import { TrackedLink } from "@/components/ui/tracked-link";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { megaMenuServicios, navPrincipal } from "@/content/navegacion";
import { terceros } from "@/lib/site";
import { formatPEN } from "@/lib/utils";
import { waReserva } from "@/lib/whatsapp";

/** Cromo del sitio público: header, footer, barra móvil, WhatsApp flotante, cookies y la entidad JSON-LD global. Lo usan app/(site)/layout.tsx y la 404 global (app/not-found.tsx). */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const servicios = megaMenuServicios.map((s) => ({
    label: s.label,
    href: s.href,
    descripcion: s.descripcion,
    precio: s.precioDesde === null ? null : `desde ${formatPEN(s.precioDesde)}`,
  }));
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[60] rounded-pill bg-brand px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <SiteHeader
        nav={navPrincipal}
        servicios={servicios}
        accionesDesktop={
          <>
            <WhatsAppButton ubicacion="header" variant="secondary" className="px-4">
              WhatsApp
            </WhatsAppButton>
            <WhatsAppButton ubicacion="header" variant="primary">
              Agendar diagnóstico
            </WhatsAppButton>
          </>
        }
        accionMovil={
          <TrackedLink
            href={waReserva()}
            target="_blank"
            rel="noopener noreferrer"
            evento="whatsapp_click"
            props={{ servicio: "general", ubicacion: "header-movil" }}
            className="grid size-11 place-items-center rounded-pill bg-whatsapp text-ink"
          >
            <IconWhatsApp className="size-5" />
            <span className="sr-only">Escríbenos por WhatsApp</span>
          </TrackedLink>
        }
        accionesMenu={
          <>
            <WhatsAppButton ubicacion="menu-movil" variant="primary" size="lg">
              Agendar diagnóstico
            </WhatsAppButton>
            <Button href="/guia/consulta-placa-gratis" variant="secondary" size="lg" arrow={false}>
              Consultar placa gratis
            </Button>
          </>
        }
      />
      <main id="contenido" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <div className="surface-dark pb-[4.75rem] lg:pb-0">
        <SiteFooter />
      </div>
      <MobileCtaBar />
      <WhatsAppFloat />
      <CookieBanner />
      <JsonLd data={schemaOrganizacion()} />
      <ThirdPartyScripts ids={terceros} />
    </>
  );
}
