"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { prefiereMenosMovimiento, useInViewOnce } from "./use-in-view";

/**
 * Contador que sube una sola vez al entrar en viewport.
 * Se renderiza con el valor final (SEO / sin JS) y solo anima si aún no estaba visible.
 */
export function Counter({ display, className }: { display: string; className?: string }) {
  const m = display.match(/^([^\d]*)([\d.,]+)(.*)$/);
  const prefijo = m?.[1] ?? "";
  const numTxt = m?.[2] ?? "";
  const sufijo = m?.[3] ?? "";
  const decimales = numTxt.includes(".") ? (numTxt.split(".")[1]?.length ?? 0) : 0;
  const objetivo = Number(numTxt.replace(/,/g, ""));
  const { ref, visto } = useInViewOnce<HTMLSpanElement>({ threshold: 0.6 });
  const [valor, setValor] = useState<number | null>(null);
  const [armado, setArmado] = useState(false);

  // Al montar: si no está visible aún y se permite movimiento, arranca desde 0.
  useEffect(() => {
    const el = ref.current;
    if (!el || !numTxt || prefiereMenosMovimiento()) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) {
      setValor(0);
      setArmado(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!armado || !visto) return;
    const inicio = performance.now();
    const dur = 1200;
    let raf = 0;
    const paso = (t: number) => {
      const p = Math.min(1, (t - inicio) / dur);
      const e = 1 - (1 - p) ** 3;
      setValor(objetivo * e);
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [armado, visto, objetivo]);

  const texto =
    valor === null
      ? display
      : `${prefijo}${valor.toLocaleString("en-US", {
          minimumFractionDigits: decimales,
          maximumFractionDigits: decimales,
        })}${sufijo}`;

  return (
    <span ref={ref} className={cn("font-mono tabular-nums", className)}>
      <span aria-hidden>{texto}</span>
      <span className="sr-only">{display}</span>
    </span>
  );
}
