import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { Evento } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { IconWhatsApp } from "./icons";
import { TrackedLink } from "./tracked-link";

export type ButtonVariant = "primary" | "secondary" | "whatsapp" | "link";

type Common = {
  variant?: ButtonVariant;
  size?: "md" | "lg";
  /** Flecha dentro de un círculo (solo primario). Por defecto: true en primario. */
  arrow?: boolean;
  icon?: "phone";
  className?: string;
  children: React.ReactNode;
};

type AsLink = Common & {
  href: string;
  /** Si se indica, el clic registra este evento (requiere JS en cliente). */
  track?: { evento: Evento; props?: Record<string, string | number | boolean | undefined> };
  download?: boolean;
};
type AsButton = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

const base =
  "group inline-flex min-h-11 items-center justify-center gap-3 rounded-pill font-sans font-medium leading-none transition-[background-color,border-color,color,transform] duration-200 ease-out-soft disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-ink hover:bg-brand/85 active:translate-y-px",
  secondary:
    "border border-border-strong text-fg hover:border-accent hover:text-accent active:translate-y-px",
  whatsapp: "bg-whatsapp text-ink hover:bg-whatsapp/85 active:translate-y-px",
  link: "min-h-0 rounded-none p-0 text-accent underline decoration-1 underline-offset-4 hover:decoration-2",
};

const sizes = { md: "px-5 py-2.5 text-[0.95rem]", lg: "px-6 py-3.5 text-base" };

function Contenido({ variant = "primary", arrow, icon, children }: Common) {
  const conFlecha = arrow ?? variant === "primary";
  return (
    <>
      {variant === "whatsapp" && <IconWhatsApp className="size-5 shrink-0" />}
      {icon === "phone" && <Phone className="size-4.5 shrink-0" strokeWidth={1.5} aria-hidden />}
      <span>{children}</span>
      {conFlecha && (
        <span
          aria-hidden
          className="-mr-2 grid size-8 shrink-0 place-items-center rounded-full bg-ink text-brand transition-transform duration-200 group-hover:translate-x-0.5"
        >
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </span>
      )}
    </>
  );
}

/**
 * Botón píldora. Variantes: primario (brand + flecha en círculo), secundario (contorno),
 * WhatsApp (verde, texto ink) y enlace.
 */
export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", className } = props;
  const conFlecha = (props.arrow ?? variant === "primary") && variant !== "link";
  const cls = cn(
    base,
    variants[variant],
    variant !== "link" && sizes[size],
    conFlecha && "pr-3",
    className,
  );

  if (props.href !== undefined) {
    const { href, track, download, children, arrow, icon } = props;
    const externo = /^(https?:|mailto:|tel:)/.test(href) || download;
    const contenido = (
      <Contenido variant={variant} arrow={arrow} icon={icon}>
        {children}
      </Contenido>
    );
    if (track) {
      return (
        <TrackedLink
          href={href}
          className={cls}
          evento={track.evento}
          props={track.props}
          download={download}
          {...(/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {contenido}
        </TrackedLink>
      );
    }
    if (externo) {
      return (
        <a
          href={href}
          className={cls}
          download={download}
          {...(/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {contenido}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {contenido}
      </Link>
    );
  }

  const { children, arrow, icon, variant: _v, size: _s, className: _c, type, ...rest } = props;
  void _v;
  void _s;
  void _c;
  return (
    <button type={type ?? "button"} className={cls} {...rest}>
      <Contenido variant={variant} arrow={arrow} icon={icon}>
        {children}
      </Contenido>
    </button>
  );
}
