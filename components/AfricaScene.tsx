import {
  AFRICA_LAND,
  AFRICA_LINKS,
  AFRICA_MADAGASCAR,
  AFRICA_NODES,
} from "./africa-paths";

// The continent is drawn at 720 x 760; the scene is wider than that, so the
// map sits inside a transform and the rest of the canvas carries the sky.
const SCENE_W = 1600;
const SCENE_H = 860;
const MAP_SCALE = 1;
const MAP_X = SCENE_W * 0.66 - (720 * MAP_SCALE) / 2;
const MAP_Y = (SCENE_H - 760 * MAP_SCALE) / 2;

export default function AfricaScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="A map of Africa with a network of links between cities, animated."
    >
      <defs>
        <linearGradient id="land" x1="0.1" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#2f66d8" />
          <stop offset="0.5" stopColor="#1c47a8" />
          <stop offset="1" stopColor="#12306e" />
        </linearGradient>

        <radialGradient id="halo" cx="0.5" cy="0.45" r="0.5">
          <stop offset="0" stopColor="#3f7bff" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#2a55c8" stopOpacity="0.18" />
          <stop offset="1" stopColor="#0a1a3d" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <clipPath id="land-clip">
          <path
            d={AFRICA_LAND}
            transform={`translate(${MAP_X} ${MAP_Y}) scale(${MAP_SCALE})`}
          />
        </clipPath>
      </defs>

      <ellipse
        cx={SCENE_W * 0.66}
        cy={SCENE_H * 0.5}
        rx="430"
        ry="400"
        fill="url(#halo)"
        data-africa="halo"
      />

      <g transform={`translate(${MAP_X} ${MAP_Y}) scale(${MAP_SCALE})`}>
        <path d={AFRICA_LAND} fill="url(#land)" data-africa="land" />
        <path d={AFRICA_MADAGASCAR} fill="url(#land)" data-africa="land" />
      </g>

      {/* scan texture, cut to the coastline */}
      <g clipPath="url(#land-clip)">
        <g stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1">
          {Array.from({ length: 86 }, (_, i) => (
            <line key={`s${i}`} x1="0" y1={i * 10} x2={SCENE_W} y2={i * 10} />
          ))}
        </g>
        <rect
          className="africa-sheen"
          x="0"
          y="0"
          width={SCENE_W * 0.45}
          height={SCENE_H}
          fill="url(#sheen)"
        />
      </g>

      <g transform={`translate(${MAP_X} ${MAP_Y}) scale(${MAP_SCALE})`}>
        <path
          d={AFRICA_LAND}
          fill="none"
          stroke="#8fb4ff"
          strokeOpacity="0.5"
          strokeWidth="1.6"
          data-africa="coast"
        />
        <path
          d={AFRICA_MADAGASCAR}
          fill="none"
          stroke="#8fb4ff"
          strokeOpacity="0.5"
          strokeWidth="1.6"
          data-africa="coast"
        />

        {/* the network: a faint line, and a light travelling along it */}
        {AFRICA_LINKS.map((d) => (
          <g key={d}>
            <path
              d={d}
              fill="none"
              stroke="#9dc0ff"
              strokeOpacity="0.28"
              strokeWidth="1.2"
              data-africa="link"
            />
            <path
              data-africa="arc"
              d={d}
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.9"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        ))}

        {AFRICA_NODES.map((n) => (
          <g key={n.id}>
            <circle
              data-africa="node"
              cx={n.x}
              cy={n.y}
              r="7"
              fill="#bcd4ff"
            />
            <circle cx={n.x} cy={n.y} r="3.2" fill="#ffffff" data-africa="core" />
          </g>
        ))}
      </g>
    </svg>
  );
}

// A 1em disc of the continent, for setting inside a line of type.
export function AfricaBadge() {
  return (
    <span className="relative mx-[0.14em] inline-block h-[1.15em] w-[1.15em] -translate-y-[0.08em] overflow-hidden rounded-full align-middle shadow-chip">
      <svg viewBox="140 60 440 560" className="h-full w-full" aria-hidden="true">
        <rect x="0" y="0" width="720" height="760" fill="#12306e" />
        <path d={AFRICA_LAND} fill="#7ea6ff" />
        <path d={AFRICA_MADAGASCAR} fill="#7ea6ff" />
      </svg>
    </span>
  );
}
