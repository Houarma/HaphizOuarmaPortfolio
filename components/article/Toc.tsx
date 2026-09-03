"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/markdown";

/**
 * The reader's position in the piece, kept honest by an observer on the
 * headings themselves rather than by arithmetic on scroll offsets.
 */
export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!targets.length) return;

    const seen = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting);
        }
        const current = headings.find((h) => seen.get(h.id));
        if (current) setActive(current.id);
      },
      // A band across the upper third: a heading counts as read once it
      // reaches it, and stops counting when the next one arrives.
      { rootMargin: "-88px 0px -68% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="In this article" className="text-[13px]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-grey">
          In this article
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="text-grey transition-colors hover:text-ink"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[14px] w-[14px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>

      <ul className="mt-5 max-h-[calc(100vh-13rem)] overflow-y-auto pr-2 [scrollbar-width:thin]">
        {headings.map((h) => {
          const on = active === h.id;
          const dot = h.level === 3 ? "h-[4px] w-[4px]" : "h-[5px] w-[5px]";
          const lit = on
            ? "bg-accent ring-[3px] ring-accent/15"
            : "bg-ink/25 group-hover:bg-ink/50";

          return (
            <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
              <a
                href={`#${h.id}`}
                className={`group flex items-start gap-2.5 py-[7px] leading-snug transition-colors ${
                  on ? "text-accent" : "text-grey hover:text-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-[6px] shrink-0 rounded-full transition-all ${dot} ${lit}`}
                />
                <span
                  className={
                    h.level === 3 ? "text-[12.5px]" : on ? "font-medium" : ""
                  }
                >
                  {h.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
