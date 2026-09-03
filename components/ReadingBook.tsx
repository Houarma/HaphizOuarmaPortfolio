"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { reading } from "@/content/site";

const HOLD = 4600;
const TURN = 1.15;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Page({
  src,
  alt,
  side,
}: {
  src: string;
  alt: string;
  side: "left" | "right";
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      {/* The gutter darkens the inner edge, which is what reads as a spine. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-${side === "left" ? "r" : "l"} from-transparent to-black/30`}
      />
    </div>
  );
}

export default function ReadingBook() {
  const [index, setIndex] = useState(0);
  const leaf = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const count = reading.length;

  const current = reading[index];
  const previous = reading[(index - 1 + count) % count];
  const next = reading[(index + 1) % count];

  // A new spread: the leaf goes back to the right, the heading fades in.
  useIsoLayoutEffect(() => {
    if (leaf.current) gsap.set(leaf.current, { rotateY: 0 });
    if (head.current) {
      gsap.fromTo(
        head.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [index]);

  // The page turns on its own, then hands over to the next book.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      if (!leaf.current) return;
      gsap.to(leaf.current, {
        rotateY: -180,
        duration: TURN,
        ease: "power2.inOut",
        onComplete: () => setIndex((i) => (i + 1) % count),
      });
    }, HOLD);

    return () => window.clearTimeout(timer);
  }, [index, count]);

  return (
    <article className="card flex min-h-[300px] flex-col overflow-hidden">
      <span className="chip absolute left-4 top-4 z-10">
        What I&apos;m reading
      </span>

      <div ref={head} className="px-5 pt-[52px]">
        <p className="text-[12px] uppercase tracking-[0.1em] text-grey">
          {current.author}
        </p>
        <h3 className="mt-[6px] max-w-[24ch] text-[15px] font-bold leading-[1.32] tracking-[-0.02em]">
          {current.title}
        </h3>
      </div>

      {/* An open book seen slightly from above: two fixed pages, and a leaf
          hinged on the spine that turns from the right to the left. */}
      <div className="my-auto flex justify-center px-4 pb-6 pt-6 [perspective:1100px]">
        <div className="relative flex h-[152px] w-[222px] [transform:rotateX(7deg)] [transform-style:preserve-3d]">
          <span
            aria-hidden="true"
            className="absolute inset-x-[10px] bottom-[-5px] top-[6px] rounded-[3px] bg-white shadow-lift"
          />

          <div className="relative h-full w-1/2 origin-right overflow-hidden rounded-l-[4px] shadow-lift [transform:rotateY(15deg)]">
            <Page src={previous.cover} alt={previous.title} side="left" />
          </div>

          <div className="relative h-full w-1/2 origin-left overflow-hidden rounded-r-[4px] shadow-lift [transform:rotateY(-15deg)]">
            <Page src={next.cover} alt={next.title} side="right" />
          </div>

          {/* The turning leaf, carrying the book being read on both faces. */}
          <div
            ref={leaf}
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-1/2 origin-left [transform-style:preserve-3d]"
          >
            <div className="absolute inset-0 overflow-hidden rounded-r-[4px] shadow-lift [backface-visibility:hidden] [transform:rotateY(-15deg)]">
              <Page src={current.cover} alt={current.title} side="right" />
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-l-[4px] shadow-lift [backface-visibility:hidden] [transform:rotateY(165deg)]">
              <Page src={current.cover} alt={current.title} side="left" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
