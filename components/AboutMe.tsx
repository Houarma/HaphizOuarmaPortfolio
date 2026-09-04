import { aboutMe, site } from "@/content/site";
import Sparkle from "./Sparkle";

export default function AboutMe() {
  return (
    <section id="about-me" className="scroll-mt-8 pt-32 sm:pt-40">
      <div className="grid gap-8 md:grid-cols-[minmax(0,21rem)_1fr] md:gap-12">
        {/* Left rail: the label, with the portrait sitting straight under it. */}
        <div>
          <p data-anim="sec-label" className="flex items-start gap-2 text-[14px] font-medium text-ink-soft">
            <Sparkle />
            {aboutMe.label}
          </p>

          {/* On a phone it centres and takes the width it deserves; from md it
              returns to the rail and bleeds left by 24px, as before. The bleed
              is a transform so it cannot fight the auto margins. */}
          <span className="relative mx-auto mt-6 block w-full max-w-[320px] md:mt-8 md:w-[336px] md:max-w-none md:-translate-x-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aboutMe.portrait}
              alt=""
              data-anim="portrait"
              className="portrait-fade block w-full"
            />
            {/* The sheen is masked by the portrait itself, so it only ever
                travels across the silhouette. */}
            <span
              aria-hidden="true"
              className="portrait-sheen pointer-events-none absolute inset-0 overflow-hidden"
            >
              <span
                data-anim="portrait-shine"
                className="absolute inset-y-[-25%] left-0 w-[38%] rotate-[16deg] bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[2px]"
              />
            </span>
          </span>
        </div>

        <div>
          <h2 data-anim="sec-title" className="max-w-[26ch] text-[clamp(1.55rem,3.6vw,2.35rem)] font-bold leading-[1.24] tracking-[-0.035em]">
            {aboutMe.headline}{" "}
            <span className="text-accent">{aboutMe.headlineAccent}</span>
          </h2>

          <p data-anim="sec-lede" className="mt-6 max-w-[64ch] text-[15px] leading-[1.66] text-grey">
            {aboutMe.lead}
          </p>

          <div data-anim="reveal-row" className="mt-8 flex items-center gap-2.5">
            <a
              href={site.links.linkedin}
              data-magnetic
              className="inline-flex items-center rounded-full bg-ink px-7 py-[15px] text-[15px] font-medium text-white transition-transform hover:-translate-y-[1px] hover:shadow-lift"
            >
              {aboutMe.cta}
            </a>

            <a
              href="#contact"
              aria-label="Jump to contact"
              className="grid h-[50px] w-[50px] place-items-center rounded-full bg-ink text-white transition-transform hover:-translate-y-[1px] hover:shadow-lift"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
