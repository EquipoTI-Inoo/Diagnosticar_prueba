import { cn } from "@/lib/utils";

/**
 * Esquema SIN ESCALA de los distritos sin recargo (posiciones relativas aproximadas, oeste =
 * litoral). No es un mapa cartográfico: no usa teselas externas ni Google Maps.
 * Las posiciones son de diseño, no datos del negocio.
 */
const POS: Record<string, [number, number]> = {
  "San Miguel": [130, 130],
  "Pueblo Libre": [235, 120],
  Magdalena: [175, 205],
  "Jesús María": [320, 110],
  Lince: [360, 180],
  "San Isidro": [320, 255],
  "San Borja": [470, 255],
  Miraflores: [330, 345],
  Surco: [490, 360],
  Barranco: [320, 430],
};

/** Posición de cada etiqueta respecto de su punto (solo tipografía; evita solapes). */
const ETIQUETA: Record<string, { dx: number; dy: number; anchor: "start" | "middle" | "end" }> = {
  "San Miguel": { dx: -14, dy: 5, anchor: "end" },
  "Pueblo Libre": { dx: 0, dy: 30, anchor: "middle" },
  Magdalena: { dx: 14, dy: 5, anchor: "start" },
  "Jesús María": { dx: 14, dy: 5, anchor: "start" },
  Lince: { dx: 14, dy: 5, anchor: "start" },
  "San Isidro": { dx: -14, dy: 5, anchor: "end" },
  "San Borja": { dx: 14, dy: 5, anchor: "start" },
  Miraflores: { dx: 14, dy: 5, anchor: "start" },
  Surco: { dx: 14, dy: 5, anchor: "start" },
  Barranco: { dx: 14, dy: 5, anchor: "start" },
};

export function MapaLima({
  distritos,
  oficina,
  className,
}: {
  distritos: string[];
  /** Distrito de la oficina (se marca con un pin). */
  oficina: string;
  className?: string;
}) {
  const puntos = distritos.filter((d) => POS[d]);
  return (
    <svg
      viewBox="0 0 600 500"
      role="img"
      aria-labelledby="mapa-titulo mapa-desc"
      className={cn("h-auto w-full", className)}
    >
      <title id="mapa-titulo">Esquema de cobertura sin recargo en Lima</title>
      <desc id="mapa-desc">
        Esquema sin escala con los {puntos.length} distritos sin recargo: {puntos.join(", ")}. La
        oficina está en {oficina}.
      </desc>
      {/* Mar y litoral */}
      <path
        d="M0 0 L95 0 C120 120 170 260 230 360 C260 410 280 460 290 500 L0 500 Z"
        fill="#04ADBF"
        opacity="0.08"
      />
      <path
        d="M95 0 C120 120 170 260 230 360 C260 410 280 460 290 500"
        fill="none"
        stroke="#04ADBF"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0.6"
      />
      <text
        x="40"
        y="330"
        fill="#8E9C9A"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="11"
        letterSpacing="2"
        transform="rotate(-62 40 330)"
      >
        OCÉANO PACÍFICO
      </text>
      {/* Retícula de hoja de inspección */}
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * 60}
          y1="0"
          x2={i * 60}
          y2="500"
          stroke="#F5F6F3"
          strokeOpacity="0.04"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 60}
          x2="600"
          y2={i * 60}
          stroke="#F5F6F3"
          strokeOpacity="0.04"
        />
      ))}
      {/* Distritos */}
      {puntos.map((d) => {
        const [x, y] = POS[d]!;
        const esOficina = d === oficina;
        const e = ETIQUETA[d] ?? { dx: 14, dy: 5, anchor: "start" as const };
        return (
          <g key={d}>
            <circle
              cx={x}
              cy={y}
              r={esOficina ? 9 : 6}
              fill={esOficina ? "#04ADBF" : "#0B1214"}
              stroke="#04ADBF"
              strokeWidth="2"
            />
            <text
              x={x + e.dx}
              y={y + e.dy}
              textAnchor={e.anchor}
              fill="#F5F6F3"
              fontFamily="var(--font-inter-tight), sans-serif"
              fontSize="20"
            >
              {d}
            </text>
            {esOficina && (
              <text
                x={x + e.dx}
                y={y + e.dy + 19}
                textAnchor={e.anchor}
                fill="#8E9C9A"
                fontFamily="var(--font-jetbrains), monospace"
                fontSize="10"
                letterSpacing="1"
              >
                OFICINA
              </text>
            )}
          </g>
        );
      })}
      <text
        x="590"
        y="490"
        textAnchor="end"
        fill="#8E9C9A"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="10"
        letterSpacing="1"
      >
        ESQUEMA SIN ESCALA
      </text>
    </svg>
  );
}
