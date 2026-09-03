import { footerNav, site } from "@/content/site";
import Newsletter from "./Newsletter";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="night-grid relative mt-[310px] text-white sm:mt-[400px]">
      {/* The top edge hangs, then snaps flat. The band is the footer's colour,
          so the two read as one shape. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[100px] -translate-y-[calc(100%-1px)] sm:h-[140px]"
      >
        <svg
          viewBox="0 0 2278 400"
          preserveAspectRatio="none"
          className="block h-full w-full"
        >
          <path
            data-anim="footer-wave"
            fill="#161616"
            d="M0 0C0 0,464 0,1139 0S2278 0,2278 0V400H0Z"
          />
        </svg>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1180px] flow-root px-5 sm:px-8">
        <Newsletter />

        <div
          data-anim="footer-bounce"
          className="flex flex-col gap-9 pb-14 pt-16 md:flex-row md:items-center md:justify-between md:gap-10 md:pb-16 md:pt-20"
        >
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-2 md:flex-nowrap">
              {footerNav.map((item, i) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={
                      i === 0
                        ? "inline-block rounded-full bg-white/[0.09] px-4 py-2 text-[12.5px] text-white transition-colors hover:bg-white/[0.14] focus-visible:outline-white/70"
                        : "inline-block rounded-full px-3.5 py-2 text-[12.5px] text-white/55 transition-colors hover:text-white focus-visible:outline-white/70"
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={`mailto:${site.links.email}`}
            data-anim="footer-email"
            className="text-[clamp(1.3rem,3vw,2.6rem)] leading-none tracking-[-0.025em] text-white transition-opacity hover:opacity-80 focus-visible:outline-white/70"
          >
            {site.links.email}
          </a>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] py-7 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>Montreal, Canada</p>
        </div>
      </div>
    </footer>
  );
}
