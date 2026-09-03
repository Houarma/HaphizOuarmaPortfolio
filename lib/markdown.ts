import "server-only";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

/**
 * Markdown to HTML, on the server. Everything a piece on experimentation
 * needs: GitHub tables and footnotes, LaTeX through KaTeX, and code coloured
 * by Shiki at build time — so the reader downloads highlighted markup rather
 * than a highlighting library.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-anchor"] },
    })
    .use(rehypeKatex)
    .use(rehypePrettyCode, {
      theme: "github-dark-dimmed",
      keepBackground: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(file);
}

/** Headings, for an article's table of contents. */
export function extractHeadings(markdown: string) {
  const slug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  return markdown
    .split("\n")
    .filter((line) => /^##\s+/.test(line))
    .map((line) => {
      const text = line.replace(/^##\s+/, "").trim();
      return { text, id: slug(text) };
    });
}
