import Section from "./Section";
import { identity, mediumProfile, research, site, type ResearchItem } from "@/content/site";

function Piece({ item }: { item: ResearchItem }) {
  return (
    <article data-anim="reveal"
      className="glass-light relative mx-auto w-full max-w-[610px] overflow-hidden rounded-[28px]">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.cover}
          alt=""
          data-anim="blog-cover"
          className="aspect-[16/10] w-full object-cover"
        />
        {/* The photo melts into the card rather than ending on a hard line. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/55 to-transparent"
        />

        {item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Read “${item.title}” on Medium`}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[17px] w-[17px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        ) : null}
      </div>

      <div className="relative -mt-12 px-6 pb-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-[20ch] text-[20px] font-bold leading-[1.24] tracking-[-0.03em] text-ink">
            {item.title}
          </h3>
          <span className="shrink-0 rounded-full bg-ink/[0.07] px-3.5 py-[7px] text-[13px] font-medium text-ink-soft">
            {item.date}
          </span>
        </div>

        <p className="mt-3 max-w-[52ch] text-[13.5px] leading-[1.6] text-grey">
          {item.blurb}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-ink/[0.055] px-3.5 py-[7px] text-[12.5px] text-ink-soft"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={identity.avatar}
            alt=""
            className="h-[20px] w-[20px] rounded-full object-cover"
          />
          <span className="text-[12px] font-medium text-ink-soft">
            {site.name}
          </span>
        </div>

        <a
          href={mediumProfile}
          target="_blank"
          rel="noreferrer"
          data-magnetic
          className="mt-5 block rounded-full bg-ink py-[16px] text-center text-[15px] font-semibold text-white transition-transform hover:-translate-y-[1px] hover:shadow-lift"
        >
          See more on Medium
        </a>
      </div>
    </article>
  );
}

export default function Research() {
  return (
    <Section
      id="research"
      chip="Blogs & Research"
      title="Making decisions from data you"
      accent="don't have enough of."
      lede="Each piece below is stated the way I would want to read it: the question, what I did, what it showed, and what it does not show."
    >
      <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        {research.map((item) => (
          <Piece key={item.title} item={item} />
        ))}
      </div>
    </Section>
  );
}
