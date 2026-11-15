import { cn } from "@/lib/utils";

/**
 * QR ilustrativo (21×21, no escaneable) con los 3 patrones de posición.
 * Se reemplazará por un QR real cuando exista la URL de verificación ([PENDIENTE CLIENTE]).
 */
function qrIlustrativo(semilla: string): boolean[][] {
  const N = 21;
  let h = 2166136261;
  for (const c of semilla) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100) / 100;
  };
  const m = Array.from({ length: N }, () => Array.from({ length: N }, () => rand() > 0.52));
  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++)
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= N || cc >= N) continue;
        const borde = r === 0 || r === 6 || c === 0 || c === 6;
        const centro = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[rr]![cc] = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (borde || centro);
      }
  };
  finder(0, 0);
  finder(0, N - 7);
  finder(N - 7, 0);
  return m;
}

/** Sello «Vehículo verificado por DiagnostiCAR» con QR (SVG). */
export function VerifiedSeal({
  codigo = "EJEMPLO",
  className,
}: {
  /** Código del certificado; en el prototipo es ilustrativo. */
  codigo?: string;
  className?: string;
}) {
  const qr = qrIlustrativo(codigo);
  const tam = 21;
  const celda = 4;
  const lado = tam * celda;
  const ox = 100 - lado / 2;
  const oy = 100 - lado / 2 - 4;
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Sello «Vehículo verificado por DiagnostiCAR» con código QR (ilustrativo, código ${codigo})`}
      className={cn("h-auto w-full max-w-64", className)}
    >
      <defs>
        <path id="sello-arco-sup" d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id="sello-arco-inf" d="M 24 100 A 76 76 0 0 0 176 100" />
      </defs>
      <circle cx="100" cy="100" r="98" fill="#0B1214" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#04ADBF" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="62" fill="#F5F6F3" />
      <text
        fill="#04ADBF"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="10.5"
        fontWeight="500"
        letterSpacing="2.2"
      >
        <textPath href="#sello-arco-sup" startOffset="50%" textAnchor="middle">
          VEHÍCULO VERIFICADO
        </textPath>
      </text>
      <text
        fill="#F5F6F3"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="9.5"
        fontWeight="500"
        letterSpacing="2.4"
      >
        <textPath
          href="#sello-arco-inf"
          startOffset="50%"
          textAnchor="middle"
          dominantBaseline="hanging"
        >
          POR DIAGNOSTICAR
        </textPath>
      </text>
      <g transform={`translate(${ox} ${oy})`} fill="#0B1214" shapeRendering="crispEdges">
        {qr.flatMap((fila, r) =>
          fila.map((on, c) =>
            on ? (
              <rect key={`${r}-${c}`} x={c * celda} y={r * celda} width={celda} height={celda} />
            ) : null,
          ),
        )}
      </g>
      <text
        x="100"
        y={oy + lado + 11}
        textAnchor="middle"
        fill="#5C6B6A"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="7"
        letterSpacing="1"
      >
        {codigo}
      </text>
    </svg>
  );
}
