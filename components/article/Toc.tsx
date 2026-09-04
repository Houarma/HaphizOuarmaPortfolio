"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Heading } from "@/lib/markdown";
import { useActiveHeading, useReadingProgress } from "./useReading";

/**
 * The reader's position in the piece, on a rail: the ground behind them is
 * tinted, and a lit segment slides to whichever section they are standing in.
 */
export default function Toc({
  headings,
  target = "piece",
}: {
  headings: Heading[];
  target?: string;
}) {
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useActiveHeading(ids);
  const percent = useReadingProgress(target);

  const railRef = useRef<HTMLDivElement>(null);
  const items = useRef(new Map<string, HTMLAnchorElement>());
  const [mark, setMark] = useState({ top: 0, height: 0, ready: false });

  const place = useCallback(() => {
    const el = items.current.get(active);
    const rail = railRef.current;
    if (!el || !rail) return;

    setMark({ top: el.offsetTop, height: el.offsetHeight, ready: true });

    // When the list is taller than its box, follow the active line rather than
    // letting it drift out of sight.
    const box = rail.parentElement;
    if (box && box.scrollHeight > box.clientHeight + 1) {
      const above = el.offsetTop - box.scrollTop;
      const below = above + el.offsetHeight - box.clientHeight;
      if (above < 8) box.scrollTop += above - 8;
      else if (below > -8) box.scrollTop += below + 8;
    }
  }, [active]);

  useEffect(() => {
    place();
  }, [place]);

  useEffect(() => {
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [place]);

  if (headings.length < 2) return null;

  const slide =
    "transition-[top,height] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <nav aria-label="In this article" className="text-[13px]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-grey">
          In this article
        </p>

        <div className="flex items-center gap-2.5">
          <span
            className="font-mono text-[10.5px] tabular-nums text-accent"
            aria-label={`${percent} percent read`}
          >
            {percent}%
          </span>
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
              aria-hidden="true"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 [scrollbar-width:thin]">
        <div ref={railRef} className="relative">
          {/* the rail, the ground already covered, and the lit segment */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 w-px bg-ink/10"
          />
          <span
            aria-hidden="true"
            className={`absolute left-0 top-0 w-px bg-accent/25 ${slide}`}
            style={{
              height: mark.ready ? mark.top + mark.height : 0,
            }}
          />
          <span
            aria-hidden="true"
            className={`absolute left-0 w-[2px] rounded-full bg-accent ${slide}`}
            style={{
              top: mark.top,
              height: mark.height,
              opacity: mark.ready ? 1 : 0,
            }}
          />

          <ul>
            {headings.map((h) => {
              const on = active === h.id;
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    ref={(el) => {
                      if (el) items.current.set(h.id, el);
                      else items.current.delete(h.id);
                    }}
                    aria-current={on ? "location" : undefined}
                    className={`block py-[7px] leading-snug transition-[color,padding] duration-300 ${
                      h.level === 3
                        ? "pl-7 text-[12.5px]"
                        : "pl-4 text-[13px]"
                    } ${
                      on
                        ? "font-medium text-accent"
                        : "text-grey hover:pl-5 hover:text-ink"
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/**
 * The same map, folded away, for the widths where there is no room beside the
 * text. It carries its own progress readout so a phone reader is never left
 * guessing how much is left.
 */
export function TocCompact({
  headings,
  target = "piece",
}: {
  headings: Heading[];
  target?: string;
}) {
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useActiveHeading(ids);
  const percent = useReadingProgress(target);
  const [open, setOpen] = useState(false);

  if (headings.length < 2) return null;

  const current = headings.find((h) => h.id === active) ?? headings[0];

  return (
    <div className="mb-10 overflow-hidden rounded-[16px] border border-line bg-card lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-grey">
            In this article &middot; {percent}%
          </span>
          <span className="mt-[3px] block truncate text-[13.5px] font-medium text-ink">
            {current.text}
          </span>
        </span>

        <svg
          viewBox="0 0 24 24"
          className={`h-[16px] w-[16px] shrink-0 text-grey transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* The seam doubles as the progress bar when the list is shut. */}
      <div className="h-[2px] w-full bg-ink/[0.06]">
        <div
          className="h-full origin-left bg-accent transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="px-4 pb-3 pt-2">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={() => setOpen(false)}
                  className={`block py-[7px] leading-snug ${
                    h.level === 3 ? "pl-4 text-[12.5px]" : "text-[13.5px]"
                  } ${
                    active === h.id
                      ? "font-medium text-accent"
                      : "text-grey"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
