"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { mascaraPlaca, validarPlaca } from "@/lib/validacion";

/**
 * Input de placa peruana con máscara AAA-000 (convierte a mayúsculas e inserta el guion).
 * Valida al salir del campo; el error queda asociado con aria-describedby.
 */
export function PlateInput({
  id,
  name = "placa",
  label = "Placa del auto",
  defaultValue = "",
  onValueChange,
  error: errorExterno,
  className,
}: {
  id: string;
  name?: string;
  label?: string;
  defaultValue?: string;
  onValueChange?: (valor: string) => void;
  error?: string | null;
  className?: string;
}) {
  const [valor, setValor] = useState(mascaraPlaca(defaultValue));
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const error = errorExterno ?? errorLocal;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div
        className={cn(
          "relative flex min-h-14 items-stretch overflow-hidden rounded-sm border-2 bg-white text-ink transition-colors focus-within:border-brand-deep",
          error ? "border-error" : "border-ink-2",
        )}
      >
        <span
          aria-hidden
          className="flex w-7 shrink-0 flex-col items-center justify-center bg-brand-deep font-mono text-[0.55rem] leading-[1.15] text-paper"
        >
          <span>P</span>
          <span>E</span>
          <span>R</span>
          <span>Ú</span>
        </span>
        <input
          id={id}
          name={name}
          value={valor}
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={7}
          placeholder="ABC-123"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          onChange={(e) => {
            const v = mascaraPlaca(e.target.value);
            setValor(v);
            onValueChange?.(v);
            if (errorLocal) setErrorLocal(validarPlaca(v));
          }}
          onBlur={() => setErrorLocal(valor ? validarPlaca(valor) : null)}
          className="w-full min-w-0 bg-transparent px-3 font-mono text-[1.375rem] font-medium tracking-[0.08em] uppercase outline-none placeholder:text-muted/60"
        />
      </div>
      <p id={`${id}-hint`} className="text-sm text-fg-muted">
        Formato ABC-123
      </p>
      {error && (
        <p id={`${id}-error`} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
