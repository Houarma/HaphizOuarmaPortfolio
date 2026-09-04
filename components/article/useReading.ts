"use client";

import { useEffect, useState } from "react";

/**
 * How far the reader has travelled through one element, as a whole percent.
 *
 * Measuring the piece rather than the document matters: the comments and the
 * footer are not reading, so a bar driven by document height would sit at
 * two-thirds on the last paragraph and never feel finished.
 *
 * State changes only when the integer changes — at most a hundred renders for
 * an entire article — while the scroll listener itself is passive and folded
 * into an animation frame.
 */
export function useReadingProgress(targetId: string): number {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let frame = 0;
    let last = -1;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // The last screenful needs no scrolling, so it is not part of the span.
      const span = Math.max(1, el.offsetHeight - window.innerHeight);
      const ratio = -rect.top / span;
      const next = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
      if (next !== last) {
        last = next;
        setPercent(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Images and fonts land after hydration and change the height under us.
    const observer = new ResizeObserver(schedule);
    observer.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [targetId]);

  return percent;
}

/**
 * The id of the heading the reader is currently under.
 *
 * Position, not intersection: an observer only fires when a heading crosses a
 * band, so a long section between two headings leaves the answer to whatever
 * fired last. Asking "which heading did I pass most recently" is cheap, cannot
 * drift, and is right on the first frame after a jump or a reload at an anchor.
 */
export function useActiveHeading(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;

    let frame = 0;
    let last = "";

    const measure = () => {
      frame = 0;
      // The reading line: a little below the top, where the eye actually sits.
      const line = Math.min(160, window.innerHeight * 0.22);

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - line <= 0) current = id;
        else break; // headings are in document order
      }

      // At the very bottom the last heading wins, however short its section.
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atEnd) current = ids[ids.length - 1];

      if (current !== last) {
        last = current;
        setActive(current);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return active;
}
