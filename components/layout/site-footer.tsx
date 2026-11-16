import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Pendiente } from "@/components/ui/pendiente";
import { TrackedLink } from "@/components/ui/tracked-link";
import { negocio } from "@/content/negocio";
import { footer } from "@/content/navegacion";
import { esPendiente } from "@/lib/utils";
import { waReserva } from "@/lib/whatsapp";
import { CookiePrefsButton } from "./cookie-prefs-button";

const enlace = "inline-flex min-h-11 items-center text-fg-muted hover:text-fg lg:min-h-9";

function Columna({ titulo, items }: { titulo: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-mono text-eyebrow font-medium tracking-[0.12em] text-fg uppercase [font-stretch:100%]">
        {titulo}
      </h2>
      <ul role="list" className="mt-3">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className={enlace}>
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Footer: 4 columnas + redes + Libro de Reclamaciones + datos legales + marca de agua. */
export function SiteFooter() {
  const { redes } = negocio;
  const listaRedes = [
    { label: "Instagram", href: redes.instagram.url },
    { label: "YouTube", href: redes.youtube.url },
    { label: "Facebook", href: redes.facebook.url },
    { label: "TikTok", href: redes.tiktok.url },
  ];
  return (
    <footer className="surface-dark relative overflow-hidden border-t border-border">
      <div className="container-site relative z-10 pt-16 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1.2fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo on="dark" sizes="136px" className="h-[4.5rem] w-auto" />
            <p className="mt-3 max-w-[30ch] text-fg-muted">{negocio.lema}.</p>
            <p className="mt-6 font-mono text-xs leading-relaxed text-fg-muted">
              Diagnóstico vehicular pre-compra
              <br />a domicilio en Lima Metropolitana
            </p>
          </div>
          <Columna titulo="Servicios" items={footer.servicios} />
          <Columna titulo="Aprende" items={footer.aprende} />
          <Columna titulo="Empresa" items={footer.empresa} />
          <div>
            <h2 className="font-mono text-eyebrow font-medium tracking-[0.12em] text-fg uppercase [font-stretch:100%]">
              Contacto
            </h2>
            <ul role="list" className="mt-3 text-fg-muted">
              <li>
                <TrackedLink
                  href={waReserva()}
                  target="_blank"
                  rel="noopener noreferrer"
                  evento="whatsapp_click"
                  props={{ servicio: "general", ubicacion: "footer" }}
                  className={enlace}
                >
                  WhatsApp {negocio.whatsapp.display}
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href={`tel:${negocio.telefono.e164}`}
                  evento="phone_click"
                  props={{ ubicacion: "footer" }}
                  className={enlace}
                >
                  Teléfono {negocio.telefono.display}
                </TrackedLink>
              </li>
              <li className="py-2">
                <span className="block">{negocio.direccion.calle}</span>
                <span className="block">
                  {negocio.direccion.distrito}, {negocio.direccion.ciudad}
                </span>
                <span className="mt-1 block text-sm">Oficina. El servicio es a domicilio.</span>
              </li>
              <li className="py-2">
                {negocio.horario.dias},{" "}
                {esPendiente(negocio.horario.horas) ? <Pendiente /> : negocio.horario.horas}
              </li>
              <li className="py-2">
                Email: <Pendiente />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
          <ul role="list" className="flex flex-wrap gap-x-5">
            {listaRedes.map((r) => (
              <li key={r.label}>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className={enlace}>
                  {r.label}
                </a>
              </li>
            ))}
            <li className="inline-flex min-h-11 items-center gap-2 text-fg-muted">
              Grupo «{redes.grupoFacebook.nombre}» <Pendiente>URL [PENDIENTE CLIENTE]</Pendiente>
            </li>
          </ul>
          <Link
            href="/libro-de-reclamaciones"
            className="inline-flex min-h-11 items-center gap-3 self-start rounded-sm border border-border-strong px-4 text-fg hover:border-accent"
          >
            <BookOpen aria-hidden className="size-5" strokeWidth={1.5} />
            Libro de Reclamaciones
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-2 font-mono text-xs text-fg-muted lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} {negocio.razonSocial} · RUC {negocio.ruc}
          </p>
          <div className="flex flex-wrap gap-x-5">
            <Link href="/legal/terminos-y-condiciones" className={enlace}>
              Términos y condiciones
            </Link>
            <Link href="/legal/privacidad" className={enlace}>
              Privacidad
            </Link>
            <CookiePrefsButton className={`${enlace} cursor-pointer`} />
          </div>
        </div>
      </div>

      {/* Marca de agua: logo real muy tenue, decorativo */}
      <div aria-hidden className="pointer-events-none relative mt-4 -mb-[10%] select-none">
        <Logo
          on="dark"
          alt=""
          sizes="100vw"
          className="mx-auto h-auto w-[86%] max-w-[1000px] opacity-[0.07]"
        />
      </div>
    </footer>
  );
}
