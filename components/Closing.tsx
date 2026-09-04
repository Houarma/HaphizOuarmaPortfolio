import Section from "./Section";
import { about, now, site } from "@/content/site";

export function Now() {
  return (
    <Section id="now" chip={`Now · updated ${now.updated}`} title="What I'm working on">
      <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
        {now.items.map((item, i) => (
          <article key={item.slice(0, 24)} className="card p-6">
            <span className="chip font-mono text-[11px] tracking-[0.1em] text-grey">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-4 text-[14px] leading-[1.66] text-ink-soft">
              {item}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function About() {
  return (
    <Section id="about" chip="About" title="Background">
      <div className="grid gap-5 sm:gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div className="card p-6 sm:p-7">
          {about.paragraphs.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="mt-4 max-w-[68ch] text-[14.5px] leading-[1.68] text-ink-soft first:mt-0"
            >
              {p}
            </p>
          ))}
        </div>

        <div className="grid gap-5 sm:gap-6">
          <div className="card p-6 sm:p-7">
            <span className="chip">Education</span>
            {about.education.map((e) => (
              <div key={e.period} className="mt-5">
                <p className="text-[14.5px] font-bold tracking-[-0.015em]">
                  {e.school}
                </p>
                <p className="mt-[2px] text-[13.5px] text-grey">{e.detail}</p>
                <p className="mt-[3px] font-mono text-[11px] text-grey">
                  {e.period}
                </p>
              </div>
            ))}
          </div>

          <div className="card p-6 sm:p-7">
            <span className="chip">Coursework certified</span>
            <ul className="mt-5 grid gap-4">
              {about.certifications.map((c) => (
                <li key={c.name}>
                  <p className="text-[13.5px] font-semibold leading-snug tracking-[-0.015em]">
                    {c.name}
                  </p>
                  <p className="mt-[2px] font-mono text-[11px] text-grey">
                    {c.issuer} · {c.date}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

/**
 * Two rings turning against each other. `a` is where the dot starts, in degrees
 * clockwise from the right of the panel's top edge; `ring` is its share of the
 * frame's half-width, so the ellipse shrinks with the column instead of
 * reaching past it on a phone. The radii themselves are worked out in Motion.
 */
const ORBIT = [
  { a: 186, ring: 1, s: 5, c: "#2f56d6", dir: 1 },
  { a: 208, ring: 1, s: 3.5, c: "#406eff", dir: 1 },
  { a: 231, ring: 1, s: 6, c: "#ffffff", dir: 1 },
  { a: 252, ring: 1, s: 4, c: "#5d84ff", dir: 1 },
  { a: 274, ring: 1, s: 3, c: "#2f56d6", dir: 1 },
  { a: 297, ring: 1, s: 5.5, c: "#ffffff", dir: 1 },
  { a: 320, ring: 1, s: 3.5, c: "#406eff", dir: 1 },
  { a: 342, ring: 1, s: 4.5, c: "#2f56d6", dir: 1 },
  { a: 24, ring: 1, s: 3, c: "#5d84ff", dir: 1 },
  { a: 96, ring: 1, s: 4, c: "#406eff", dir: 1 },
  { a: 198, ring: 0.62, s: 4, c: "#406eff", dir: -1 },
  { a: 236, ring: 0.62, s: 3, c: "#2f56d6", dir: -1 },
  { a: 268, ring: 0.62, s: 5, c: "#ffffff", dir: -1 },
  { a: 304, ring: 0.62, s: 3.5, c: "#5d84ff", dir: -1 },
  { a: 340, ring: 0.62, s: 4.5, c: "#406eff", dir: -1 },
  { a: 44, ring: 0.62, s: 3, c: "#2f56d6", dir: -1 },
];

/**
 * The scatter above the light. Blue rather than white: the panel sits on a
 * bright sky, where a pale dot disappears and a saturated one carries.
 */
const SPARKS = [
  { x: 12, y: 62, s: 3, o: 0.5 },
  { x: 19, y: 28, s: 2.5, o: 0.38 },
  { x: 27, y: 74, s: 3.5, o: 0.6 },
  { x: 33, y: 41, s: 2.5, o: 0.44 },
  { x: 41, y: 16, s: 3, o: 0.55 },
  { x: 46, y: 68, s: 2.5, o: 0.4 },
  { x: 54, y: 34, s: 3.5, o: 0.62 },
  { x: 61, y: 12, s: 2.5, o: 0.42 },
  { x: 66, y: 58, s: 3, o: 0.56 },
  { x: 73, y: 30, s: 2.5, o: 0.38 },
  { x: 79, y: 71, s: 3.5, o: 0.52 },
  { x: 86, y: 44, s: 2.5, o: 0.44 },
  { x: 91, y: 22, s: 3, o: 0.48 },
];

export function Contact() {
  const links = [
    { label: "Email", href: `mailto:${site.links.email}`, text: site.links.email },
    { label: "GitHub", href: site.links.github, text: "github.com/Houarma" },
    { label: "LinkedIn", href: site.links.linkedin, text: "Haphiz Ouarma" },
    site.links.medium
      ? { label: "Writing", href: site.links.medium, text: "Medium" }
      : null,
  ].filter(Boolean) as { label: string; href: string; text: string }[];

  return (
    // Full-bleed: the sky runs edge to edge, the panel floats on it.
    <section
      id="contact"
      className="relative isolate mt-32 scroll-mt-8 overflow-hidden sm:mt-40"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/clouds.webp"
        alt=""
        className="sky-fade absolute inset-0 -z-10 h-full w-full object-cover"
      />

      <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
        {/* A lamp sits behind the panel's top edge and spills upward, the way
            the reference lights its dashboard: a broad halo, a brighter core,
            a field of sparks, and dots going round the light. */}
        <div data-anim="reveal" className="relative">
          <span
            aria-hidden="true"
            data-anim="card-glow"
            className="pointer-events-none absolute inset-x-[6%] -top-[104px] h-[210px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(64,110,255,0.95),rgba(47,86,214,0.5)_44%,transparent_100%)] blur-[34px]"
          />
          <span
            aria-hidden="true"
            data-anim="card-core"
            className="pointer-events-none absolute inset-x-[24%] -top-[52px] h-[118px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(198,217,255,1),rgba(64,110,255,0.66)_50%,transparent_100%)] blur-[22px]"
          />

          {/* Fixed sparks, breathing out of phase with one another. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-[172px] h-[196px] overflow-hidden"
          >
            {SPARKS.map((s, i) => (
              <span
                key={i}
                data-spark
                className="absolute rounded-full bg-[#5d84ff]"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.s,
                  height: s.s,
                  opacity: s.o,
                  boxShadow: "0 0 7px rgba(64,110,255,0.8)",
                }}
              />
            ))}
          </span>

          {/* The ring: the orbit's centre is the panel's top edge, so each dot
              rises over the light and passes behind the glass on the way down.
              The frame clips it to the column, which keeps the far reach of the
              ellipse from widening the page on a narrow screen; the radii come
              from the frame's own width, so the ring shrinks with it. */}
          <span
            aria-hidden="true"
            data-anim="card-ring"
            className="pointer-events-none absolute inset-x-0 -top-[190px] h-[190px] overflow-hidden"
          >
            <span className="absolute left-1/2 top-full block h-0 w-0">
              {ORBIT.map((d, i) => (
                <span
                  key={i}
                  data-orbit
                  data-a={d.a}
                  data-ring={d.ring}
                  data-dir={d.dir}
                  className="absolute left-0 top-0 rounded-full opacity-0"
                  style={{
                    width: d.s,
                    height: d.s,
                    marginLeft: -d.s / 2,
                    marginTop: -d.s / 2,
                    background: d.c,
                    boxShadow: `0 0 ${d.s * 2.4}px ${d.c}`,
                  }}
                />
              ))}
            </span>
          </span>

          <div className="glass relative z-10 rounded-[22px] px-5 py-12 text-center sm:rounded-[30px] sm:px-12 sm:py-20">
          <span className="chip mx-auto">
            <span className="relative flex h-[9px] w-[9px] shrink-0">
              <span
                data-anim="ping"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-live"
              />
              <span className="relative h-full w-full rounded-full bg-live" />
            </span>
            Open to research
          </span>

          <h2 className="mx-auto mt-6 max-w-[22ch] text-[clamp(1.7rem,4vw,2.6rem)] font-bold leading-[1.2] tracking-[-0.04em]">
            Let&apos;s talk about experimentation
            <span className="text-accent"> where traffic is scarce.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-[52ch] text-[15.5px] leading-[1.6] text-ink-soft">
            Open to research collaboration, to supervision on causal inference and
            variance reduction, and to conversations about building software for
            African markets.
          </p>

          <a
            href={`mailto:${site.links.email}`}
            data-magnetic
            className="mt-9 inline-flex items-center rounded-full bg-ink px-[30px] py-[17px] text-[17px] font-semibold text-white transition-transform hover:-translate-y-[1px] hover:shadow-lift"
          >
            Book a call
          </a>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  rel="me"
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  className="chip transition-shadow hover:shadow-lift"
                >
                  <span className="text-grey">{l.label}</span>
                  <span className="text-ink">{l.text}</span>
                </a>
              </li>
            ))}
          </ul>
          </div>

          {/* The lit edge, drawn over the glass: a wide bloom, the filament
              itself, and a highlight that travels the length of it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[6%] top-0 z-20 h-[11px] overflow-hidden"
          >
            <span
              data-anim="card-rim"
              className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(47,86,214,0.65)_14%,rgba(64,110,255,0.95)_34%,rgba(150,183,255,1)_50%,rgba(64,110,255,0.95)_66%,rgba(47,86,214,0.65)_86%,transparent_100%)] blur-[6px]"
            />
            <span
              data-anim="card-rim"
              className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(47,86,214,0.7)_12%,rgba(93,132,255,1)_30%,#ffffff_50%,rgba(93,132,255,1)_70%,rgba(47,86,214,0.7)_88%,transparent_100%)]"
            />
            <span
              data-anim="card-sweep"
              className="absolute inset-y-0 left-0 w-[22%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)] blur-[3px]"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
