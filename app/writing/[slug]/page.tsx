import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { identity, site } from "@/content/site";
import Toc, { TocCompact } from "@/components/article/Toc";
import ReadingBar from "@/components/article/ReadingBar";
import ShareCard from "@/components/article/ShareCard";
import CodeCopy from "@/components/article/CodeCopy";
import Comments from "@/components/article/Comments";
import Ornament from "@/components/article/Ornament";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };

  const url = `${site.url}/writing/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    // A syndicated copy points home; an original points at itself.
    alternates: { canonical: post.canonicalUrl ?? `/writing/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      authors: [site.url],
      tags: post.tags,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

const longDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { html, headings } = await renderMarkdown(post.body);
  const url = `${site.url}/writing/${post.slug}`;
  const updated = post.updatedAt ?? post.publishedAt;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    datePublished: post.publishedAt ?? undefined,
    dateModified: updated ?? undefined,
    keywords: post.tags.join(", "),
    inLanguage: "en",
    wordCount: post.body.split(/\s+/).length,
    timeRequired: `PT${post.readingMinutes}M`,
    image: post.cover ? [post.cover] : [`${site.url}/og.png`],
    author: { "@id": `${site.url}/#person` },
    publisher: { "@id": `${site.url}/#person` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@id": `${site.url}/#website` },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Writing",
        item: `${site.url}/writing`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-[1220px] px-5 pb-28 pt-[42px] sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <CodeCopy />
      <ReadingBar />

      <div className="grid gap-x-10 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)_15rem] xl:gap-x-12">
        {/* ---------- header, sitting in the reading column ---------- */}
        <header className="min-w-0 lg:col-start-2">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-grey"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <Chevron />
            <Link href="/writing" className="transition-colors hover:text-ink">
              Writing
            </Link>
            {post.tags[0] ? (
              <>
                <Chevron />
                <span className="text-ink-soft">{post.tags[0]}</span>
              </>
            ) : null}
          </nav>

          <h1 className="mt-5 max-w-[20ch] text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.042em]">
            {post.title}
          </h1>

          <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.55] text-grey">
            {post.excerpt}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[12.5px] text-grey">
            <span className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={identity.avatar}
                alt=""
                className="h-[24px] w-[24px] rounded-full object-cover"
              />
              <span className="font-medium text-ink">{site.name}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                className="h-[14px] w-[14px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              Updated on {longDate(updated)}
            </span>

            <span className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                className="h-[14px] w-[14px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5.5l3.5 2" />
              </svg>
              {post.readingMinutes} min read
            </span>
          </div>

          <Ornament />
        </header>

        {/* ---------- the table of contents ---------- */}
        <aside className="hidden lg:col-start-1 lg:row-start-2 lg:block">
          <div className="sticky top-10">
            <Toc headings={headings} />
          </div>
        </aside>

        {/* ---------- the piece ---------- */}
        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
          {/* Below lg there is no room for the rail, so the map folds up here. */}
          <TocCompact headings={headings} />

          {/* The bar and the rail both measure this element, and nothing past
              it: the comments are not reading. */}
          <div
            id="piece"
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {post.tags.length ? (
            <p className="mt-14 text-[13.5px] text-grey">
              Filed under{" "}
              {post.tags.map((tag, i) => (
                <span key={tag}>
                  {i > 0 ? ", " : ""}
                  <span className="font-medium text-accent">{tag}</span>
                </span>
              ))}
            </p>
          ) : null}

          {post.canonicalUrl ? (
            <p className="mt-4 text-[13px] text-grey">
              This piece first appeared at{" "}
              <a href={post.canonicalUrl} className="underline">
                {post.canonicalUrl}
              </a>
              .
            </p>
          ) : null}

          {/* The share card has no column of its own until xl; before that it
              belongs at the end of the read, which is when it is asked for. */}
          <div className="mt-12 xl:hidden">
            <ShareCard />
          </div>

          <Ornament />

          <Comments slug={post.slug} />
        </div>

        {/* ---------- the share card ---------- */}
        <aside className="hidden xl:col-start-3 xl:row-start-2 xl:block">
          <div className="sticky top-10">
            <ShareCard />
          </div>
        </aside>
      </div>
    </main>
  );
}

function Chevron() {
  return (
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
  );
}
