import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { extractHeadings, renderMarkdown } from "@/lib/markdown";
import { identity, site } from "@/content/site";

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

const readable = (iso: string | null) =>
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

  const html = await renderMarkdown(post.body);
  const headings = extractHeadings(post.body);
  const url = `${site.url}/writing/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    keywords: post.tags.join(", "),
    inLanguage: "en",
    wordCount: post.body.split(/\s+/).length,
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
      { "@type": "ListItem", position: 1, name: site.name, item: site.url },
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
    <main className="mx-auto w-full max-w-[980px] px-5 pb-32 pt-[44px] sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-[13px] text-grey transition-colors hover:text-ink"
      >
        ← Writing
      </Link>

      <article className="pt-14 sm:pt-16">
        <header className="max-w-[46rem]">
          <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-grey">
            {readable(post.publishedAt)} · {post.readingMinutes} min read
          </p>

          <h1 className="mt-5 text-[clamp(1.9rem,4.4vw,2.9rem)] font-bold leading-[1.14] tracking-[-0.04em]">
            {post.title}
          </h1>

          <p className="mt-5 text-[17px] leading-[1.6] text-grey">
            {post.excerpt}
          </p>

          <div className="mt-7 flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={identity.avatar}
              alt=""
              className="h-[30px] w-[30px] rounded-full object-cover"
            />
            <span className="text-[13.5px] font-medium">{site.name}</span>
          </div>
        </header>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_14rem] lg:gap-16">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {headings.length > 2 ? (
            <aside className="order-first lg:order-none">
              <div className="lg:sticky lg:top-10">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-grey">
                  Contents
                </p>
                <ul className="mt-4 space-y-2.5 border-l border-line pl-4">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-[13px] leading-snug text-grey transition-colors hover:text-ink"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </div>

        {post.canonicalUrl ? (
          <p className="mt-16 border-t border-line pt-6 text-[13px] text-grey">
            This piece first appeared at{" "}
            <a href={post.canonicalUrl} className="underline">
              {post.canonicalUrl}
            </a>
            .
          </p>
        ) : null}
      </article>
    </main>
  );
}
