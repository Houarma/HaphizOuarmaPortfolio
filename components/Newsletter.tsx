import { newsletter, site } from "@/content/site";

export default function Newsletter() {
  return (
    // Pulled up so its top half sits on the page and its bottom half on the
    // footer band — the overlap the reference uses.
    <div data-anim="reveal"
      className="relative -mt-[270px] overflow-hidden sm:-mt-[320px] rounded-[28px] bg-accent px-7 py-12 shadow-lift sm:px-14 sm:py-16">
      {/* Two shapes, as in the reference: a column standing at the right edge,
          a shade darker than the card, and a half-disc whose curve meets it.
          aspect-[1/2] makes the width exactly half the height, so rounded-r-full
          resolves to a true semicircle instead of a stadium. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[5%] right-0 hidden w-[13%] rounded-l-[32px] bg-black/[0.08] sm:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[13%] top-1/2 hidden aspect-[1/2] h-[73%] -translate-y-1/2 rounded-r-full bg-white/[0.09] sm:block"
      />

      <div className="relative max-w-[35rem]">
        <h2 className="max-w-[13ch] text-[clamp(1.65rem,3.4vw,2.35rem)] font-bold leading-[1.18] tracking-[-0.035em] text-white">
          {newsletter.title}
        </h2>

        <p className="mt-4 max-w-[52ch] text-[13.5px] leading-[1.6] text-white/70">
          {newsletter.lead}
        </p>

        <form
          action={`mailto:${site.links.email}`}
          method="post"
          encType="text/plain"
          className="mt-8 flex flex-col gap-2.5 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder={newsletter.placeholder}
            className="h-[46px] w-full rounded-[10px] bg-white/[0.14] px-4 text-[16px] sm:text-[14px] text-white ring-1 ring-white/20 outline-none placeholder:text-white/50 focus:ring-white/50 sm:max-w-[320px]"
          />
          <button
            type="submit"
            className="h-[46px] shrink-0 rounded-[10px] bg-white px-6 text-[14px] font-semibold text-accent transition-transform hover:-translate-y-[1px]"
          >
            {newsletter.cta}
          </button>
        </form>

        <p className="mt-4 max-w-[54ch] text-[11.5px] leading-[1.5] text-white/45">
          {newsletter.fineprint}
        </p>
      </div>
    </div>
  );
}
