import {
  bentoSlot,
  building,
  experience,
  place,
  practice,
  site,
} from "@/content/site";
import HowIWork from "./HowIWork";
import PrincipleCard from "./PrincipleCard";
import ReadingBook from "./ReadingBook";
import Sparkle from "./Sparkle";

function ExperienceList({ muted = false }: { muted?: boolean }) {
  return (
    <ol className="relative pl-[26px]" aria-hidden={muted || undefined}>
      <span className="absolute bottom-[10px] left-[4px] top-[10px] w-px bg-ink/15" />
      {experience.map((item, i) => (
        <li key={item.role} className={`relative ${i === 0 ? "" : "mt-[14px]"}`}>
          <span
            className={`absolute -left-[26px] top-[5px] h-[9px] w-[9px] rounded-full ${
              item.planned ? "border border-ink/35 bg-card" : "bg-ink"
            }`}
          />
          <p className="text-[14px] font-bold leading-snug tracking-[-0.015em]">
            {item.role}
          </p>
          <p className="mt-[2px] text-[12px] leading-snug text-grey">
            {item.meta}
          </p>
        </li>
      ))}
    </ol>
  );
}

function ExperienceCard() {
  return (
    <article className="card min-h-[300px] overflow-hidden">
      <span className="chip absolute left-4 top-4 z-10">My Experience</span>

      {/* The arc runs by twice over, so the loop has no seam. */}
      <div className="fade-y h-[252px] overflow-hidden px-5 pt-[46px]">
        <div data-anim="marquee" className="space-y-[14px]">
          <ExperienceList />
          <ExperienceList muted />
        </div>
      </div>
    </article>
  );
}

function BuildingCard() {
  return (
    <article className="card flex min-h-[300px] flex-col overflow-hidden">
      <span className="chip absolute left-4 top-4 z-10">What I&apos;m building</span>

      <div className="flex flex-1 items-center px-3 pt-[52px]">
        <div className="relative h-[148px] w-full overflow-hidden rounded-tile bg-gradient-to-br from-accent-wash via-white to-accent-wash">
          {building.covers.map((cover, i) => {
            // Centred by margin, not by transform, so the fan is free to be
            // animated without fighting a translate(-50%, -50%).
            const pose = [
              "translate(-54px, 7px) rotate(-13deg)",
              "scale(1.08)",
              "translate(54px, 7px) rotate(13deg)",
            ][i];
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={cover.src}
                data-fan={i}
                src={cover.src}
                alt={cover.alt}
                style={{ transform: pose, zIndex: i === 1 ? 3 : 1 }}
                className={`absolute left-1/2 top-1/2 -ml-[52px] -mt-[37px] h-[74px] w-[104px] rounded-[12px] object-cover shadow-lift ring-[3px] ring-white ${cover.focus ?? ""}`}
              />
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-5 pt-4 text-center">
        <p className="text-[15px] font-bold tracking-[-0.02em]">
          {building.title}
        </p>
        <a
          href={site.links.github}
          target="_blank"
          rel="noreferrer"
          className="mt-[6px] inline-flex items-center gap-[6px] text-[12.5px] text-grey transition-colors hover:text-ink"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-[14px] w-[14px] fill-accent"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.89.88 2.35.67.07-.52.28-.88.51-1.08-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          {building.linkLabel}
        </a>
      </div>
    </article>
  );
}

function MapCard() {
  return (
    <article className="card min-h-[300px] overflow-hidden">
      <span className="chip absolute left-4 top-4 z-10">Map</span>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={place.map}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-x-0 bottom-[26px] text-center">
        <p className="text-[22px] font-normal uppercase tracking-[0.5em] text-ink indent-[0.5em]">
          {place.city}
        </p>
        <p className="mt-[8px] text-[10.5px] uppercase tracking-[0.5em] text-grey indent-[0.5em]">
          {place.country}
        </p>
        <p className="mt-[10px] text-[9px] tracking-[0.14em] text-grey">
          {place.coords}
        </p>
      </div>
    </article>
  );
}

export default function Bento() {
  return (
    <section id="practice" className="scroll-mt-8 pt-32 sm:pt-40">
      <div className="grid gap-6 md:grid-cols-[minmax(0,21rem)_1fr] md:gap-12">
        <p data-anim="sec-label" className="flex items-start gap-2 text-[14px] font-medium text-ink-soft">
          <Sparkle />
          {practice.label}
        </p>

        <h2 data-anim="sec-title" className="max-w-[26ch] text-[clamp(1.55rem,3.6vw,2.35rem)] font-bold leading-[1.24] tracking-[-0.035em]">
          {practice.headline}{" "}
          <span className="text-accent">{practice.headlineAccent}</span>
        </h2>
      </div>

      <div data-anim="stagger-grid" className="mt-11 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-3">
      <ExperienceCard />
      <BuildingCard />
      <ReadingBook />
      {bentoSlot === "map" ? (
        <MapCard />
      ) : (
        <PrincipleCard chip="What I believe" className="min-h-[300px]" />
      )}
        <HowIWork />
      </div>
    </section>
  );
}
