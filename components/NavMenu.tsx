"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";

// Closed, this is exactly the button in the reference: a white disc with three
// staggered rules. Open, it drops the section index — the mockup never shows an
// open state, so the panel borrows the card language of the grid below it.
export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-[52px] w-[52px] place-items-center rounded-full bg-white shadow-chip transition-shadow hover:shadow-lift"
      >
        <span className="flex flex-col items-start gap-[5px]">
          <span className="block h-[2px] w-[18px] rounded-full bg-ink" />
          <span className="block h-[2px] w-[11px] rounded-full bg-ink" />
          <span className="block h-[2px] w-[15px] rounded-full bg-ink" />
        </span>
      </button>

      {open ? (
        <nav className="card absolute right-0 top-[62px] z-30 w-56 p-2">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-[14px] px-3.5 py-2.5 text-[15px] font-medium text-ink-soft transition-colors hover:bg-accent-wash hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
