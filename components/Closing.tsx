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
            the reference lights its dashboard. */}
        <div data-anim="reveal" className="relative">
          <span
            aria-hidden="true"
            data-anim="card-glow"
            className="pointer-events-none absolute inset-x-[10%] -top-[84px] h-[170px] rounded-[50%] bg-[radial-gradient(closest-side,rgba(64,110,255,1),rgba(47,86,214,0.6)_42%,transparent_100%)] blur-[30px]"
          />
          <span
            aria-hidden="true"
            data-anim="card-rim"
            className="pointer-events-none absolute inset-x-[18%] top-0 z-10 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#b9d0ff] to-transparent blur-[0.5px]"
          />

          <div className="glass relative rounded-[30px] px-6 py-14 text-center sm:px-12 sm:py-20">
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
        </div>
      </div>
    </section>
  );
}
