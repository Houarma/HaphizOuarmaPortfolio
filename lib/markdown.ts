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

export type Heading = { id: string; text: string; level: 2 | 3 };

export type Rendered = {
  html: string;
  headings: Heading[];
};

/**
 * Shiki colours several hundred grammars on its own; this table only decides
 * how the label above a block is spelled. Anything absent falls back to the
 * tag in capitals, so an unlisted language still renders and still colours.
 */
const LANGUAGE_NAMES: Record<string, string> = {
  js: "JavaScript", javascript: "JavaScript", jsx: "JSX",
  ts: "TypeScript", typescript: "TypeScript", tsx: "TSX",
  py: "Python", python: "Python", ipynb: "Notebook",
  r: "R", jl: "Julia", julia: "Julia", matlab: "MATLAB",
  java: "Java", kt: "Kotlin", kotlin: "Kotlin", scala: "Scala",
  go: "Go", rs: "Rust", rust: "Rust", swift: "Swift",
  c: "C", cpp: "C++", cs: "C#", csharp: "C#",
  php: "PHP", rb: "Ruby", ruby: "Ruby", dart: "Dart",
  hs: "Haskell", haskell: "Haskell", lua: "Lua", perl: "Perl",
  sql: "SQL", graphql: "GraphQL", prisma: "Prisma",
  bash: "Shell", sh: "Shell", shell: "Shell", zsh: "Shell",
  powershell: "PowerShell", ps1: "PowerShell",
  json: "JSON", jsonc: "JSON", yaml: "YAML", yml: "YAML",
  toml: "TOML", xml: "XML", csv: "CSV",
  html: "HTML", css: "CSS", scss: "SCSS", svg: "SVG",
  md: "Markdown", mdx: "MDX", latex: "LaTeX", tex: "LaTeX", bibtex: "BibTeX",
  docker: "Dockerfile", dockerfile: "Dockerfile", nginx: "Nginx",
  terraform: "Terraform", hcl: "HCL", makefile: "Makefile",
  diff: "Diff", ini: "INI", text: "Text", plaintext: "Text",
};

/**
 * Markdown to HTML, on the server. Everything a piece on experimentation
 * needs: GitHub tables and footnotes, LaTeX through KaTeX, and code coloured
 * by Shiki at render time — so the reader downloads highlighted markup rather
 * than a highlighting library.
 */
export async function renderMarkdown(markdown: string): Promise<Rendered> {
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

  const raw = String(file);

  return {
    html: decorateCodeBlocks(raw),
    headings: extractHeadings(raw),
  };
}

/**
 * Reads the ids rehype-slug actually produced rather than guessing them from
 * the markdown, so the table of contents can never drift from the anchors.
 */
function extractHeadings(html: string): Heading[] {
  const pattern = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  const headings: Heading[] = [];

  for (const match of html.matchAll(pattern)) {
    const text = match[3]
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .trim();

    if (text) {
      headings.push({
        level: Number(match[1]) as 2 | 3,
        id: match[2],
        text,
      });
    }
  }

  return headings;
}

/**
 * Gives each code block the bar the reference carries: the language on the
 * left, a copy control on the right. The button is inert markup here; the
 * client component wires it once the page is interactive.
 */
function decorateCodeBlocks(html: string): string {
  return html.replace(
    /<figure([^>]*data-rehype-pretty-code-figure[^>]*)>\s*<pre([^>]*)>/g,
    (_match, figureAttrs: string, preAttrs: string) => {
      const language = preAttrs.match(/data-language="([^"]+)"/)?.[1] ?? "code";
      const label = LANGUAGE_NAMES[language] ?? language.toUpperCase();

      return `<figure${figureAttrs} class="code-figure"><div class="code-bar"><span class="code-lang">${label}</span><button type="button" class="code-copy" data-copy aria-label="Copy code"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg></button></div><pre${preAttrs}>`;
    },
  );
}
