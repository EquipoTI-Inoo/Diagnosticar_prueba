import Link from "next/link";
import { schemaMigas, type Miga } from "@/lib/schema";
import { JsonLd } from "./json-ld";

/** Migas visibles + BreadcrumbList (§8). El último elemento es la página actual. */
export function Breadcrumbs({ migas }: { migas: Miga[] }) {
  const todas = [{ nombre: "Inicio", href: "/" }, ...migas];
  return (
    <>
      <nav aria-label="Migas de pan" className="font-mono text-xs tracking-wide text-fg-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {todas.map((m, i) => {
            const ultima = i === todas.length - 1;
            return (
              <li key={m.href} className="flex items-center gap-2">
                {ultima ? (
                  <span aria-current="page" className="text-fg">
                    {m.nombre}
                  </span>
                ) : (
                  <>
                    <Link
                      href={m.href}
                      className="inline-flex min-h-11 items-center underline-offset-4 hover:text-fg hover:underline lg:min-h-0"
                    >
                      {m.nombre}
                    </Link>
                    <span aria-hidden>/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={schemaMigas(todas)} />
    </>
  );
}
