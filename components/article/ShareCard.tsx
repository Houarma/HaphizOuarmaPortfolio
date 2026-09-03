"use client";

import { useState } from "react";

/** The dark card the reference floats beside the opening paragraphs. */
export default function ShareCard() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* a browser that refuses the clipboard is not worth an error banner */
    }
  };

  return (
    <aside className="rounded-[18px] bg-ink p-5 text-white">
      <p className="flex items-center gap-2 text-[15px] font-bold tracking-[-0.02em]">
        <svg
          viewBox="0 0 24 24"
          className="h-[15px] w-[15px] text-[#8fb4ff]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        Share this article
      </p>

      <p className="mt-2.5 text-[12.5px] leading-[1.55] text-white/60">
        Found it useful? Share it on your networks — or better still, from your
        own site, an article of your own, or your newsletter.
      </p>

      <button
        type="button"
        onClick={copy}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-[11px] text-[13.5px] font-semibold text-white transition-transform hover:-translate-y-[1px]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[14px] w-[14px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {copied ? (
            <path d="M20 6 9 17l-5-5" />
          ) : (
            <>
              <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
              <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
            </>
          )}
        </svg>
        {copied ? "Link copied" : "Copy the link"}
      </button>
    </aside>
  );
}
