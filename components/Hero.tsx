import { identity, site } from "@/content/site";

function Availability() {
  return (
    <span className="chip ml-3 align-middle text-[15px] font-medium tracking-normal sm:ml-4">
      <span className="relative flex h-[9px] w-[9px] shrink-0">
        <span
          data-anim="ping"
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-live"
        />
        <span className="relative h-full w-full rounded-full bg-live" />
      </span>
      {identity.availability}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="pt-[72px] sm:pt-[86px]">
      <h1 data-anim="hero-title" className="font-display text-[clamp(1.7rem,5.4vw,3.5rem)] font-bold leading-[1.3] tracking-[-0.035em]">
        <span className="block">
          {identity.greeting}{" "}
          {/* A small deck: blank cards fanned to the right, the photo on top
              covering them. Everything is sized in em so it scales with the
              headline. */}
          <span data-anim="hero-deck" className="relative ml-[0.18em] mr-[0.46em] inline-block h-[1.26em] w-[1.26em] -translate-y-[0.07em] align-middle">
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom-left rotate-[12deg] rounded-[0.32em] bg-accent-wash shadow-chip"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom-left rotate-[8deg] rounded-[0.32em] bg-[#eceef3] shadow-chip"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom-left rotate-[4deg] rounded-[0.32em] bg-white shadow-chip"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={identity.avatar}
              alt=""
              data-anim="hero-photo"
              className="relative h-full w-full rounded-[0.32em] object-cover shadow-avatar"
            />
          </span>
          {/* {""} */}
          {identity.name}
        </span>

        <span className="block">
          <span className="text-faint">{identity.linePrefix} </span>
          {identity.role}
          <span className="text-faint"> {identity.lineJoin}</span>
        </span>

        <span className="block">
          <span className="text-accent">{identity.org}</span>
          <Availability />
        </span>
      </h1>

      <div data-anim="hero-cta" className="mt-9 flex flex-col items-start gap-5 sm:mt-10 sm:flex-row sm:items-center sm:gap-7">
        <a
          href={`mailto:${site.links.email}`}
          data-magnetic
          className="inline-flex shrink-0 items-center rounded-full bg-ink px-[30px] py-[17px] text-[17px] font-semibold text-white transition-transform hover:-translate-y-[1px] hover:shadow-lift"
        >
          {identity.ctaLabel}
        </a>

        <p className="w-full max-w-[27rem] text-[17px] leading-[1.45] text-ink-soft">
          {identity.blurb}
        </p>
      </div>
    </section>
  );
}
