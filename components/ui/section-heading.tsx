import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { Highlight } from "./highlight";

/** Eyebrow + H2 con la parte final en color de acento. */
export function SectionHeading({
  id,
  eyebrow,
  titulo,
  acento,
  className,
  children,
}: {
  id: string;
  eyebrow?: string;
  titulo: string;
  acento?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("max-w-[44rem]", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className={cn("text-h2", eyebrow && "mt-5")}>
        {titulo}
        {acento && (
          <>
            {" "}
            <Highlight>{acento}</Highlight>
          </>
        )}
      </h2>
      {children && <div className="mt-4 text-[1.0625rem] text-fg-muted">{children}</div>}
    </div>
  );
}
