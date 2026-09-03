import { getPublishedPosts } from "@/lib/posts";
import { site } from "@/content/site";

// A route handler rather than app/sitemap.ts: the metadata file conventions
// choke on the apostrophe in this project's path, and this is portable.
export const revalidate = 3600;

export async function GET() {
  const posts = await getPublishedPosts();
  const today = new Date().toISOString().slice(0, 10);

  const entry = (loc: string, lastmod: string, priority: string) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;

  const urls = [
    entry(`${site.url}/`, today, "1.0"),
    entry(`${site.url}/writing`, today, "0.8"),
    ...posts.map((post) =>
      entry(
        `${site.url}/writing/${post.slug}`,
        (post.updatedAt ?? post.publishedAt ?? today).slice(0, 10),
        "0.7",
      ),
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
