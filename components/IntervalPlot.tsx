import { hero } from "@/content/site";

// The one figure on the page. It states the thesis in the vocabulary of the
// work itself: the same effect, measured at four sample sizes. Three intervals
// cover zero. The fourth does not, and it did not need more users to get there.

const ZERO_X = 190;
const SCALE = 255; // px per unit of effect
const ROW_TOP = [26, 90, 154, 218];
const BAR_DY = 18;

export default function IntervalPlot() {
  const { rows, estimate, caption } = hero.figure;

  return (
    <figure className="max-w-[640px]">
      <svg
        viewBox="0 0 600 296"
        className="w-full"
        role="img"
        aria-label="Confidence intervals for the same effect at four sample sizes. The three largest intervals cover zero; the fourth, computed with CUPED at the smallest sample size, does not."
      >
        {/* zero line */}
        <line
          x1={ZERO_X}
          y1={12}
          x2={ZERO_X}
          y2={256}
          stroke="var(--color-faint)"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
        <text
          x={ZERO_X}
          y={276}
          textAnchor="middle"
          fontSize={14}
          fill="var(--color-faint)"
          fontFamily="var(--font-mono)"
        >
          0
        </text>

        {rows.map((row, i) => {
          const color = row.treated
            ? "var(--color-accent)"
            : "#8a92a3";
          const x1 = ZERO_X + (estimate - row.halfWidth) * SCALE;
          const x2 = ZERO_X + (estimate + row.halfWidth) * SCALE;
          const y = ROW_TOP[i] + BAR_DY;
          const delay = `${140 * i}ms`;

          return (
            <g key={`${row.label}-${i}`}>
              <text
                x={20}
                y={ROW_TOP[i]}
                fontSize={15}
                fill="var(--color-ink)"
                fontFamily="var(--font-mono)"
              >
                {row.label}
                <tspan fill="var(--color-grey)">{"  ·  " + row.sublabel}</tspan>
              </text>

              {/* interval */}
              <rect
                className="interval-bar"
                style={{ animationDelay: delay }}
                x={x1}
                y={y - 1.5}
                width={x2 - x1}
                height={3}
                fill={color}
                opacity={0.5}
              />
              {/* end caps */}
              <rect
                className="interval-dot"
                style={{ animationDelay: `calc(${delay} + 620ms)` }}
                x={x1 - 1}
                y={y - 8}
                width={2}
                height={16}
                fill={color}
              />
              <rect
                className="interval-dot"
                style={{ animationDelay: `calc(${delay} + 620ms)` }}
                x={x2 - 1}
                y={y - 8}
                width={2}
                height={16}
                fill={color}
              />
              {/* point estimate */}
              <circle
                className="interval-dot"
                style={{ animationDelay: `calc(${delay} + 700ms)` }}
                cx={ZERO_X + estimate * SCALE}
                cy={y}
                r={4.5}
                fill={color}
              />
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-5 border-t border-line pt-4 font-mono text-[11.5px] leading-[1.6] text-grey">
        {caption}
      </figcaption>
    </figure>
  );
}
