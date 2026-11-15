import { cn } from "@/lib/utils";

type Tone = "brand" | "neutral" | "ok" | "warn" | "alert";

const tones: Record<Tone, string> = {
  brand: "bg-accent text-bg",
  neutral: "border border-border-strong text-fg",
  ok: "border border-border text-fg",
  warn: "border border-border text-fg",
  alert: "border border-border text-fg",
};

const dots: Partial<Record<Tone, string>> = { ok: "bg-ok", warn: "bg-warn", alert: "bg-alert" };

/** Insignia: «Más elegido» (brand) o estado de semáforo (punto de color + texto). */
export function Badge({
  tone = "brand",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 font-mono text-[0.7rem] leading-none font-medium tracking-wider uppercase",
        tones[tone],
        className,
      )}
    >
      {dots[tone] && <span aria-hidden className={cn("size-2 rounded-full", dots[tone])} />}
      {children}
    </span>
  );
}
