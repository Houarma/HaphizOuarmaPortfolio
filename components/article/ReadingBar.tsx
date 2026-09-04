"use client";

import { useReadingProgress } from "./useReading";

/**
 * The thread across the top of the window: how much of the piece is behind
 * you. It rides on a transform so the browser never lays the page out again,
 * and the transition smooths the whole-percent steps the hook reports.
 */
export default function ReadingBar({ target = "piece" }: { target?: string }) {
  const percent = useReadingProgress(target);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
    >
      <div className="h-full w-full bg-ink/[0.055]" />
      <div
        className="absolute inset-y-0 left-0 w-full origin-left bg-[linear-gradient(90deg,#2f56d6_0%,#406eff_58%,#8fb0ff_100%)] transition-transform duration-200 ease-out"
        style={{ transform: `scaleX(${percent / 100})` }}
      >
        {/* A little light gathers at the leading edge. */}
        <span className="absolute right-0 top-1/2 h-[9px] w-[9px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#a9c4ff] opacity-80 blur-[3px]" />
      </div>
    </div>
  );
}
