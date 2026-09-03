import { theWork } from "@/content/site";
import AfricaScene from "./AfricaScene";
import GlobeBadge from "./GlobeBadge";
import VisionIcon from "./VisionIcon";

export default function Thesis() {
  return (
    // Full-bleed: the map is the ground the section stands on, not a picture
    // inside it. Everything above it is set in white.
    <section
      id="thesis"
      className="relative isolate mt-32 scroll-mt-8 overflow-hidden py-16 text-white sm:mt-40 sm:py-24"
    >
      <div aria-hidden="true" className="work-sky absolute inset-0 -z-20 overflow-hidden">
        {/* Positioned by its own width so the continent stays in frame at any
            viewport: the point at 66% of the artwork lands on the anchor. */}
        <div data-anim="africa-parallax" className="absolute inset-0">
          <AfricaScene className="absolute left-1/2 top-1/2 h-full w-auto -translate-x-[66%] -translate-y-1/2 sm:left-[68%]" />
        </div>
      </div>

      {/* Scrims: one across the whole frame, one heavier on the left, so the
          type never has to compete with the coastline. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[#07142e]/28"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061027] via-[#061027]/75 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between md:gap-16">
          <h2 data-anim="work-title" className="max-w-[20ch] text-[clamp(1.35rem,2.7vw,2rem)] font-bold leading-[1.24] tracking-[-0.035em]">
            {theWork.headlineA}
            <GlobeBadge />
            {theWork.headlineB}{" "}
            <span className="text-[#8fb4ff]">{theWork.headlineAccent}</span>
          </h2>

          <div data-anim="work-spec" className="max-w-[42ch] md:max-w-[34ch]">
            <p className="text-[13.5px] leading-[1.65] text-white/75">
              {theWork.spec}
            </p>
            <p className="mt-4 text-[13.5px] leading-[1.65] text-white/75">
              {theWork.specVision}
            </p>
          </div>
        </div>

        <div className="relative mt-12 sm:mt-16">
          <p
            aria-hidden="true"
            data-anim="wordmark"
            className="select-none whitespace-nowrap text-[clamp(4rem,23vw,18rem)] font-bold leading-[0.82] tracking-[-0.055em] text-white"
          >
            {theWork.wordmark}
          </p>

          <a
            href={theWork.cta.href}
            className="absolute left-1 top-1/2 z-20 inline-flex -translate-y-1/2 items-center gap-2 rounded-full bg-white py-[7px] pl-[7px] pr-4 text-[13px] font-medium text-ink shadow-lift transition-transform hover:-translate-y-[calc(50%+1px)] sm:left-4"
          >
            <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-accent">
              <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" aria-hidden="true">
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {theWork.cta.label}
          </a>
        </div>

        <div data-anim="stagger-grid" className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-4">
          {theWork.cards.map((card) => (
            <div
              key={card.title}
              className="glass flex flex-col rounded-[18px] px-4 py-4 sm:px-5 sm:py-5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.14] text-white">
                <VisionIcon name={card.icon} />
              </span>

              <p className="mt-4 text-[14px] font-semibold tracking-[-0.02em] text-white">
                {card.title}
              </p>
              <p className="mt-2 text-[11.5px] leading-[1.55] text-white/70">
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[11px] text-white/40">© 2026</p>
      </div>
    </section>
  );
}
