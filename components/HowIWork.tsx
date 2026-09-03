"use client";

import { useState } from "react";
import { howIWork } from "@/content/site";

export default function HowIWork() {
  const [active, setActive] = useState(0);
  const step = howIWork[active];

  return (
    <article className="card flex min-h-[300px] flex-col overflow-hidden md:col-span-2">
      <span className="chip absolute left-4 top-4 z-10">How I work</span>

      <div className="flex-1 px-5 pb-4 pt-[64px] sm:px-7 sm:pt-[72px]">
        <h3 className="text-[17px] font-bold tracking-[-0.02em]">
          {step.title}
        </h3>
        <p className="mt-3 max-w-[62ch] text-[13.5px] leading-[1.62] text-grey">
          {step.body}
        </p>
      </div>

      <div
        role="tablist"
        aria-label="How I work"
        className="m-3 flex gap-1 rounded-full bg-white p-[6px] shadow-chip sm:m-4"
      >
        {howIWork.map((s, i) => (
          <button
            key={s.step}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`flex-1 rounded-full px-2 py-[9px] text-[12.5px] font-medium transition-colors ${
              i === active
                ? "bg-ink text-white"
                : "text-grey hover:text-ink"
            }`}
          >
            {s.step}
          </button>
        ))}
      </div>
    </article>
  );
}
