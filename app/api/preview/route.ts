import { renderMarkdown } from "@/lib/markdown";

/**
 * The studio's preview renders through the very same pipeline as the published
 * page, so what the editor shows is what a reader will get — not an
 * approximation from a second, client-side parser.
 */
/** What the studio expects back. Named so the shape cannot drift again. */
type PreviewResponse = { html: string };

export async function POST(request: Request) {
  const { markdown } = (await request.json()) as { markdown?: string };

  // renderMarkdown returns { html, headings }: take the html. Returning the
  // whole record put an object where the editor expected a string, and
  // innerHTML rendered it as "[object Object]".
  const { html } = await renderMarkdown(markdown ?? "");

  const body: PreviewResponse = { html };
  return Response.json(body);
}
