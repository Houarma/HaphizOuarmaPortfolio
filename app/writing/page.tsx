import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { site } from "@/content/site";

export const revalidate = 3600;

const DESCRIPTION =
  "Essays and notes on controlled experimentation, causal inference, machine learning and building software under real constraints.";

export const metadata: Metadata = {
  title: "Writing",
  description: DESCRIPTION,
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: `${site.url}/writing`,
    title: `Writing · ${site.name}`,
    description: DESCRIPTION,
  },
};

const readable = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

export default async function WritingIndex() {
  const posts = await getPublishedPosts();

  const list = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Writing · ${site.name}`,
    description: DESCRIPTION,
    url: `${site.url}/writing`,
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#person` },
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${site.url}/writing/${post.slug}`,
      datePublished: post.publishedAt ?? undefined,
      author: { "@id": `${site.url}/#person` },
    })),
  };

  return (
    <main className="mx-auto w-full max-w-[1000px] px-5 pb-32 pt-[42px] sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(list) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[12.5px] text-grey"
      >
        <Link href="/" className="transition-colors hover:text-ink">
          Home
        </Link>
        <svg
          viewBox="0 0 24 24"
          className="h-[13px] w-[13px] text-ink/25"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-ink-soft">Writing</span>
      </nav>

      <header className="pt-12 sm:pt-16">
        <h1 className="text-[clamp(2.2rem,5.4vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.045em]">
          Writing
        </h1>
        <p className="mt-5 max-w-[58ch] text-[16.5px] leading-[1.6] text-grey">
          Notes on controlled experimentation, causal inference, machine
          learning and system design — written the way I would want to read
          them: the question, what I did, what it showed, and what it does not
          show.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-20 text-[15px] text-grey">The first piece is on its way.</p>
      ) : (
        <ul className="mt-16 border-t border-line">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-line">
              <Link
                href={`/writing/${post.slug}`}
                className="group flex flex-col gap-5 py-9 sm:flex-row sm:items-start sm:gap-8"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-grey">
                    {readable(post.publishedAt)} · {post.readingMinutes} min
                    {post.tags.length ? ` · ${post.tags.join(" · ")}` : ""}
                  </p>

                  <h2 className="mt-3 max-w-[30ch] text-[clamp(1.25rem,2.4vw,1.6rem)] font-bold leading-[1.24] tracking-[-0.03em] transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>

                  <p className="mt-3 max-w-[70ch] text-[14.5px] leading-[1.62] text-grey">
                    {post.excerpt}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink transition-colors group-hover:text-accent">
                    Read
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[13px] w-[13px] transition-transform group-hover:translate-x-[2px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>

                {post.cover ? (
                  <div className="w-full overflow-hidden rounded-[14px] sm:w-[220px] sm:shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover}
                      alt=""
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
