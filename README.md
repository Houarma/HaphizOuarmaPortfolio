# haphizouarma.com

The personal site of **Haphiz Ouarma** — AI & data engineer, founder of Horizon's.
A portfolio, and a small publishing system for writing about controlled
experimentation, causal inference and machine learning.

**Live:** [haphizouarma.com](https://haphizouarma.com)

---

## What it is

Two things sharing one codebase:

1. **The portfolio** — a single, statically rendered page: the work, the systems
   in production, the writing, and the thesis behind them.
2. **A writing system** — articles live in Firestore, are written from a private
   studio in the browser, and are rendered on the server so search engines and
   answer engines receive finished HTML.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Motion | GSAP 3 — ScrollTrigger, SplitText, DrawSVG, MorphSVG |
| Content | Firebase Firestore + Storage, Firebase Auth |
| Markdown | unified / remark / rehype, KaTeX for maths, Shiki for code |
| Hosting | Vercel |

## Design decisions worth knowing

**Articles are rendered on the server, never fetched in the browser.** The
public pages read Firestore with the Admin SDK. A crawler that runs no
JavaScript still gets the whole article, its metadata and its structured data.

**Maths and code are resolved at render time.** KaTeX typesets the equations and
Shiki colours the code before the page is sent, so a reader downloads finished
markup rather than two parsing libraries.

**One connected structured-data graph, not a pile of blocks.** A `Person`
founded an `Organization`, wrote a `ScholarlyArticle`, and published
`SoftwareApplication`s — all cross-referenced by `@id`. That is what makes an
entity legible to search and to assistants, rather than a bag of keywords.

**The login screen is a convenience, not the lock.** Write access is enforced by
a Firestore rule bound to a single uid. A guard in the browser can always be
walked around; a rule on the server cannot.

**Ordering happens in memory, not in the query.** Filtering and sorting together
would demand a composite Firestore index. At the scale of one author's archive
the sort is free, and there is nothing to administer in a console.

**Every animation is behind `prefers-reduced-motion`.** Whoever asks for less
motion gets the complete page, statically, with no tweens at all.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

The site runs without Firebase — it simply has no articles. That way a missing
key can never take the portfolio down.

To enable writing, follow [FIREBASE_SETUP.md](FIREBASE_SETUP.md): about fifteen
minutes, once.

## Writing and publishing

1. Sign in at `/studio` — unlisted, `noindex`, disallowed in `robots.txt`.
2. Write in Markdown. Tables, footnotes, LaTeX and fenced code all work.
3. **Preview** renders through the same pipeline as the published page, so what
   the editor shows is what a reader gets.
4. **Publish**. The article appears at `/writing/<slug>`, joins the sitemap, and
   the affected pages are rebuilt at once through an authenticated
   revalidation endpoint.

Publish here first, let it be indexed, then syndicate to Medium with
`rel=canonical` pointing home. The reach of the platform, the authority of the
domain.

## Layout

```
app/
  page.tsx              the portfolio, one page
  writing/              index and article pages, server-rendered
  studio/               the private editor
  api/preview           markdown → html, the pipeline the pages use
  api/revalidate        rebuilds pages after publishing, token-checked
components/
  Motion.tsx            every animation on the site, in one place
  AfricaScene.tsx       the map that draws itself
  studio/               login screen and editor shell
content/site.ts         every word on the portfolio
lib/
  posts.ts              the article store
  markdown.ts           markdown → html with maths and code
public/                 icons, robots, llms.txt, social card, media
```

## A note on images

Source photographs and screenshots stay on the machine that produced them; the
repository carries only the optimised WebP the site actually serves. It is the
difference between a 2 MB repository and a 77 MB one, for identical pages. The
rules sit at the bottom of `.gitignore` if you want them back.

## Licence

Code is free to read and learn from. The writing, the photographs and the
Horizon's brand are not — please ask.
