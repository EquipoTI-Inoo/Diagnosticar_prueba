"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export type ItemMega = {
  label: string;
  href: string;
  descripcion?: string;
  /** Texto de precio ya formateado («desde S/ 19») o null si está pendiente. */
  precio: string | null;
};

type Props = {
  nav: { label: string; href: string }[];
  servicios: ItemMega[];
  pendienteLabel: string;
  /** CTA doble de escritorio (WhatsApp secundario + Agendar primario), renderizado en servidor. */
  accionesDesktop: React.ReactNode;
  /** Botón compacto de WhatsApp para móvil. */
  accionMovil: React.ReactNode;
  /** CTAs dentro del menú móvil. */
  accionesMenu: React.ReactNode;
};

/**
 * Header fijo: transparente sobre el hero y sólido (más compacto) al hacer scroll.
 * Mega-menú de servicios = patrón «disclosure» (botón con aria-expanded; Escape y clic
 * fuera lo cierran). Menú móvil = diálogo a pantalla completa con foco atrapado.
 */
export function SiteHeader({
  nav,
  servicios,
  pendienteLabel,
  accionesDesktop,
  accionMovil,
  accionesMenu,
}: Props) {
  const [compacto, setCompacto] = useState(false);
  const [megaAbierto, setMegaAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const megaId = useId();
  const menuId = useId();
  const megaRef = useRef<HTMLDivElement>(null);
  const megaBtn = useRef<HTMLButtonElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setCompacto(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar todo al navegar.
  useEffect(() => {
    setMegaAbierto(false);
    setMenuAbierto(false);
  }, [pathname]);

  // Mega-menú: Escape y clic fuera.
  useEffect(() => {
    if (!megaAbierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaAbierto(false);
        megaBtn.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!megaRef.current?.contains(t) && !megaBtn.current?.contains(t)) setMegaAbierto(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [megaAbierto]);

  const cerrarMenu = useCallback(() => {
    setMenuAbierto(false);
    menuBtn.current?.focus();
  }, []);

  // Menú móvil: bloquea scroll, atrapa el foco y cierra con Escape.
  useEffect(() => {
    if (!menuAbierto) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = menuRef.current;
    const focoables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focoables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return cerrarMenu();
      if (e.key !== "Tab") return;
      const els = focoables();
      const primero = els[0];
      const ultimo = els[els.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo?.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuAbierto, cerrarMenu]);

  const solido = compacto || megaAbierto;

  return (
    <header
      className={cn(
        "surface-dark fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,height] duration-300",
        solido ? "border-b border-border bg-ink" : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between gap-6 transition-[height] duration-300",
          compacto ? "h-16" : "h-16 lg:h-20",
        )}
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center"
          aria-label="DiagnostiCAR, ir al inicio"
        >
          <Logo
            on="dark"
            eager
            sizes="(min-width: 1024px) 106px, 91px"
            className={cn(
              "w-auto transition-[height] duration-300",
              compacto ? "h-12" : "h-12 lg:h-14",
            )}
          />
        </Link>

        {/* Navegación de escritorio */}
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[0.95rem]">
            {nav.map((item) =>
              item.href === "/servicios" ? (
                <li key={item.href}>
                  <button
                    ref={megaBtn}
                    type="button"
                    aria-expanded={megaAbierto}
                    aria-controls={megaId}
                    onClick={() => setMegaAbierto((v) => !v)}
                    className="inline-flex min-h-11 items-center gap-1 rounded-sm px-3 text-fg hover:text-accent"
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden
                      strokeWidth={1.75}
                      className={cn("size-4 transition-transform", megaAbierto && "rotate-180")}
                    />
                  </button>
                  {/* Mega-menú: dentro del <li> para que Tab entre justo después del botón */}
                  <div
                    ref={megaRef}
                    id={megaId}
                    hidden={!megaAbierto}
                    className="absolute inset-x-0 top-full border-y border-border bg-ink-2"
                  >
                    <div className="container-site grid gap-8 py-8 lg:grid-cols-[1fr_300px]">
                      <ul className="grid gap-x-6 gap-y-1 md:grid-cols-2" role="list">
                        {servicios.map((s, i) => (
                          <li key={s.href}>
                            <Link
                              href={s.href}
                              className="group grid min-h-11 grid-cols-[2rem_1fr_auto] items-baseline gap-3 rounded-sm border-b border-border py-3 hover:border-accent"
                            >
                              <span aria-hidden className="font-mono text-xs text-fg-muted">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span>
                                <span className="block font-medium text-fg group-hover:text-accent">
                                  {s.label}
                                </span>
                                {s.descripcion && (
                                  <span className="block text-sm text-fg-muted">
                                    {s.descripcion}
                                  </span>
                                )}
                              </span>
                              <span className="font-mono text-sm text-fg">
                                {s.precio ?? (
                                  <span className="rounded-sm border border-dashed border-border-strong px-1 text-xs text-fg-muted">
                                    {pendienteLabel}
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="rounded-card border border-border p-6">
                        <p className="font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase">
                          ¿Cuál elijo?
                        </p>
                        <p className="mt-3 text-fg">
                          Compara qué revisa cada plan, lado a lado, en una sola tabla.
                        </p>
                        <Link
                          href="/servicios"
                          className="mt-5 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline underline-offset-4"
                        >
                          Ver la comparativa completa
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="inline-flex min-h-11 items-center rounded-sm px-3 text-fg hover:text-accent aria-[current=page]:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">{accionesDesktop}</div>

        {/* Móvil */}
        <div className="flex items-center gap-2 lg:hidden">
          {accionMovil}
          <button
            ref={menuBtn}
            type="button"
            aria-expanded={menuAbierto}
            aria-controls={menuId}
            onClick={() => setMenuAbierto(true)}
            className="grid size-11 place-items-center rounded-pill border border-border-strong text-fg"
          >
            <Menu aria-hidden className="size-5" strokeWidth={1.75} />
            <span className="sr-only">Abrir menú</span>
          </button>
        </div>
      </div>

      {/* Menú móvil a pantalla completa */}
      {menuAbierto && (
        <div
          ref={menuRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
          className="surface-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink lg:hidden"
        >
          <div className="container-site flex h-16 shrink-0 items-center justify-between">
            <Logo on="dark" sizes="91px" className="h-12" />
            <button
              type="button"
              onClick={cerrarMenu}
              className="grid size-11 place-items-center rounded-pill border border-border-strong"
            >
              <X aria-hidden className="size-5" strokeWidth={1.75} />
              <span className="sr-only">Cerrar menú</span>
            </button>
          </div>
          <nav aria-label="Menú móvil" className="container-site flex-1 pt-4 pb-8">
            <p className="font-mono text-eyebrow tracking-[0.12em] text-fg-muted uppercase">
              Servicios
            </p>
            <ul role="list" className="mt-2">
              {servicios.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    onClick={() => setMenuAbierto(false)}
                    className="flex min-h-12 items-center justify-between gap-4 border-b border-border py-2"
                  >
                    <span>{s.label}</span>
                    <span className="font-mono text-sm text-fg-muted">
                      {s.precio ?? pendienteLabel}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul role="list" className="mt-8">
              {nav
                .filter((n) => n.href !== "/servicios")
                .map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      onClick={() => setMenuAbierto(false)}
                      className="flex min-h-12 items-center font-display text-2xl font-extrabold [font-stretch:87.5%]"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3">{accionesMenu}</div>
          </nav>
        </div>
      )}
    </header>
  );
}
