import Section from "./Section";
import { horizons } from "@/content/site";

export default function Horizons() {
  return (
    <Section
      id="horizons"
      chip="Venture"
      title="Horizon's — the venture is also"
      accent="the laboratory."
    >
      <div className="grid gap-5 sm:gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div className="card p-6 sm:p-7">
          {horizons.body.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="mt-4 max-w-[68ch] text-[14.5px] leading-[1.68] text-ink-soft first:mt-0"
            >
              {p}
            </p>
          ))}
        </div>

        <div className="grid gap-5 sm:gap-6">
          {horizons.pillars.map((pillar) => (
            <div key={pillar.label} className="card p-6 sm:p-7">
              <span className="chip">{pillar.label}</span>
              <p className="mt-4 text-[14px] leading-[1.62] text-grey">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
