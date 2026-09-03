import { renderMarkdown } from "@/lib/markdown";

/**
 * The studio's preview renders through the very same pipeline as the published
 * page, so what the editor shows is what a reader will get — not an
 * approximation from a second, client-side parser.
 */
export async function POST(request: Request) {
  const { markdown } = (await request.json()) as { markdown?: string };
  const html = await renderMarkdown(markdown ?? "");
  return Response.json({ html });
}
