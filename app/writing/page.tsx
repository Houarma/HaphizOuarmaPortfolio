import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { site } from "@/content/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays and notes on controlled experimentation, causal inference, machine learning and building software under real constraints.",
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: `${site.url}/writing`,
    title: `Writing · ${site.name}`,
    description:
      "Essays and notes on controlled experimentation, causal inference, machine learning and building software under real constraints.",
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

  return (
    <main className="mx-auto w-full max-w-[980px] px-5 pb-32 pt-[44px] sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[13px] text-grey transition-colors hover:text-ink"
      >
        ← {site.name}
      </Link>

      <header className="pt-16 sm:pt-20">
        <h1 className="max-w-[20ch] text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.12] tracking-[-0.04em]">
          Writing
        </h1>
        <p className="mt-5 max-w-[62ch] text-[16px] leading-[1.62] text-grey">
          Notes on controlled experimentation, causal inference, machine
          learning and system design — written the way I would want to read
          them: the question, what I did, what it showed, and what it does not
          show.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-16 text-[15px] text-grey">
          The first piece is on its way.
        </p>
      ) : (
        <ul className="mt-14 border-t border-line">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-line">
              <Link
                href={`/writing/${post.slug}`}
                className="group grid gap-2 py-8 md:grid-cols-[10rem_1fr] md:gap-10"
              >
                <p className="pt-[3px] font-mono text-[11.5px] uppercase tracking-[0.12em] text-grey">
                  {readable(post.publishedAt)}
                </p>

                <div>
                  <h2 className="max-w-[46ch] text-[20px] font-bold leading-[1.3] tracking-[-0.025em] transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-[70ch] text-[14.5px] leading-[1.6] text-grey">
                    {post.excerpt}
                  </p>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-grey">
                    {post.readingMinutes} min read
                    {post.tags.length ? ` · ${post.tags.join(" · ")}` : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
