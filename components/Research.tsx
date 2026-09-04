import Link from "next/link";
import Section from "./Section";
import { getPublishedPosts } from "@/lib/posts";
import {
  identity,
  mediumProfile,
  research,
  site,
  type ResearchItem,
} from "@/content/site";

/**
 * One shape for both sources: pieces written here, and the survey that lives
 * on Medium. The card cannot tell them apart beyond where its links point.
 */
type Card = {
  key: string;
  title: string;
  date: string;
  blurb: string;
  cover?: string;
  tags: string[];
  href: string;
  external: boolean;
  minutes?: number;
};

const fromMedium = (item: ResearchItem): Card => ({
  key: item.title,
  title: item.title,
  date: item.date,
  blurb: item.blurb,
  cover: item.cover,
  tags: item.tags,
  href: item.href ?? mediumProfile,
  external: true,
});

const monthYear = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })
    : "";

function Piece({ item }: { item: Card }) {
  const arrow = item.external ? "M7 17 17 7M8 7h9v9" : "M5 12h13M13 6l6 6-6 6";
  const label = item.external
    ? `Read “${item.title}” on Medium`
    : `Read “${item.title}”`;

  // Internal pieces route through the client; Medium leaves the site.
  const Open = ({ className, children, ...rest }: React.ComponentProps<"a">) =>
    item.external ? (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    ) : (
      <Link href={item.href} className={className} {...rest}>
        {children}
      </Link>
    );

  return (
    <article
      data-anim="reveal"
      className="glass-light relative mx-auto w-full max-w-[610px] overflow-hidden rounded-[24px] sm:rounded-[28px]"
    >
      <div className="relative">
        {item.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover}
            alt=""
            data-anim="blog-cover"
            className="aspect-[16/10] w-full object-cover"
          />
        ) : (
          // No cover: a plate of its own rather than a gap, so the grid keeps
          // its rhythm and the card still reads as a card.
          <div
            aria-hidden="true"
            className="relative aspect-[16/10] w-full overflow-hidden bg-[linear-gradient(142deg,#eaf0fd_0%,#dae4f8_46%,#c9d7f3_100%)]"
          >
            <span className="absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_12%,rgba(255,255,255,0.9),transparent_62%)]" />
            <span className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(19,46,107,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(19,46,107,0.055)_1px,transparent_1px)] [background-size:34px_34px]" />
            <span className="absolute left-5 top-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-accent/70 sm:left-6 sm:top-6 sm:text-[11px]">
              {item.tags[0] ?? "Essay"}
            </span>
          </div>
        )}

        {/* The photo melts into the card rather than ending on a hard line. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/55 to-transparent"
        />

        <Open
          aria-label={label}
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
            <path d={arrow} />
          </svg>
        </Open>
      </div>

      <div className="relative -mt-12 px-5 pb-6 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <h3 className="max-w-[20ch] text-[18px] font-bold leading-[1.24] tracking-[-0.03em] text-ink sm:text-[20px]">
            <Open className="transition-colors hover:text-accent">
              {item.title}
            </Open>
          </h3>
          <span className="shrink-0 rounded-full bg-ink/[0.07] px-3.5 py-[7px] text-[12.5px] font-medium text-ink-soft sm:text-[13px]">
            {item.date}
          </span>
        </div>

        <p className="mt-3 max-w-[52ch] text-[13.5px] leading-[1.6] text-grey">
          {item.blurb}
        </p>

        {item.tags.length ? (
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
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={identity.avatar}
            alt=""
            className="h-[20px] w-[20px] rounded-full object-cover"
          />
          <span className="text-[12px] font-medium text-ink-soft">
            {site.name}
          </span>
          {item.minutes ? (
            <span className="text-[12px] text-grey">
              &middot; {item.minutes} min read
            </span>
          ) : null}
        </div>

        <Open
          data-magnetic
          className="mt-5 block rounded-full bg-ink py-[15px] text-center text-[14.5px] font-semibold text-white transition-transform hover:-translate-y-[1px] hover:shadow-lift sm:py-[16px] sm:text-[15px]"
        >
          {item.external ? "See more on Medium" : "Read the piece"}
        </Open>
      </div>
    </article>
  );
}

export default async function Research() {
  const posts = await getPublishedPosts();

  // Published pieces lead, newest first; the Medium survey closes the set.
  const cards: Card[] = [
    ...posts.map<Card>((post) => ({
      key: post.id,
      title: post.title,
      date: monthYear(post.publishedAt),
      blurb: post.excerpt,
      cover: post.cover,
      tags: post.tags,
      href: `/writing/${post.slug}`,
      external: false,
      minutes: post.readingMinutes,
    })),
    ...research.map(fromMedium),
  ];

  return (
    <Section
      id="research"
      chip="Blogs & Research"
      title="Making decisions from data you"
      accent="don't have enough of."
      lede="Each piece below is stated the way I would want to read it: the question, what I did, what it showed, and what it does not show."
    >
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))] sm:gap-8">
        {cards.map((item) => (
          <Piece key={item.key} item={item} />
        ))}
      </div>

      {posts.length ? (
        <div className="mt-10 text-center">
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-ink transition-colors hover:text-accent"
          >
            All writing
            <svg
              viewBox="0 0 24 24"
              className="h-[14px] w-[14px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      ) : null}
    </Section>
  );
}
