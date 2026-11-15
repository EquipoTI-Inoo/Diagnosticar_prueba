import { cn } from "@/lib/utils";

export const inputBase =
  "block w-full min-h-12 rounded-sm border border-border-strong bg-card px-4 text-fg placeholder:text-fg-muted/80 transition-colors aria-[invalid=true]:border-error focus-visible:border-accent";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
};

/** Campo de texto con label, ayuda y error asociados por aria-describedby. */
export function TextField({ id, label, hint, error, className, ...rest }: Props) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={inputBase}
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
