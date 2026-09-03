"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { showcase, type ShowcaseSlide } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const HOLD = 6000;

// The same hook on both sides of the render, without React's SSR warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Phone({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      data-phone
      className={`relative shrink-0 rounded-[26px] bg-gradient-to-b from-[#44474d] via-[#9ba0a8] to-[#3b3e44] p-[3px] shadow-[0_44px_90px_-46px_rgba(16,24,40,0.6)] sm:rounded-[38px] sm:p-[4px] ${className}`}
    >
      <div className="relative overflow-hidden rounded-[23px] bg-black sm:rounded-[34px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="block aspect-[9/19.5] w-full object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[5px] h-[11px] w-[34px] -translate-x-1/2 rounded-full bg-black sm:top-[9px] sm:h-[17px] sm:w-[52px]"
        />
      </div>
    </div>
  );
}

function Note({
  title,
  body,
  className = "",
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      data-note
      className={`rounded-[12px] border border-black/[0.07] bg-gradient-to-br from-white/88 to-white/66 p-[15px] shadow-[0_22px_60px_-34px_rgba(16,24,40,0.6)] backdrop-blur-2xl ${className}`}
    >
      <p className="text-[14px] font-medium uppercase leading-[1.22] tracking-[0.05em] text-ink">
        {title}
      </p>
      <p className="mt-[9px] text-[10.5px] leading-[1.48] text-grey">{body}</p>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

function Slide({ slide, index }: { slide: ShowcaseSlide; index: number }) {
  return (
    <div data-slide className={index === 0 ? "" : "absolute inset-0"}>
      <p className="text-[13px] font-medium tracking-[-0.01em] text-ink">
        {slide.name}
      </p>

      <div className="relative mt-6 sm:mt-2">
        <div className="flex items-start justify-center gap-4 sm:gap-10">
          <Phone
            src={slide.screens[0]}
            alt={`${slide.name} — screen one`}
            className="w-[132px] sm:w-[212px]"
          />
          <Phone
            src={slide.screens[1]}
            alt={`${slide.name} — screen two`}
            className="mt-8 w-[132px] sm:mt-[70px] sm:w-[194px]"
          />
        </div>

        <div className="mt-7 grid gap-3 sm:mt-0 sm:block">
          <Note
            {...slide.cards[0]}
            className="sm:absolute sm:left-[36%] sm:top-[1%] sm:w-[250px]"
          />
          <Note
            {...slide.cards[1]}
            className="sm:absolute sm:right-0 sm:top-[38%] sm:w-[250px]"
          />
          <Note
            {...slide.cards[2]}
            className="sm:absolute sm:bottom-[7%] sm:left-0 sm:w-[250px]"
          />
        </div>
      </div>
    </div>
  );
}

export default function SystemsShowcase() {
  const [index, setIndex] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const previous = useRef(0);
  const swap = useRef<gsap.core.Timeline | null>(null);
  const count = showcase.length;

  const go = useCallback(
    (step: number) => setIndex((i) => (i + step + count) % count),
    [count],
  );

  const slidesOf = () =>
    wrap.current
      ? Array.from(wrap.current.querySelectorAll<HTMLElement>("[data-slide]"))
      : [];

  // Only the first slide is visible to begin with; it makes its entrance when
  // the section arrives.
  useIsoLayoutEffect(() => {
    const slides = slidesOf();
    if (!slides.length) return;

    const ctx = gsap.context(() => {
      gsap.set(slides, { autoAlpha: 0 });
      gsap.set(slides[0], { autoAlpha: 1 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline({
          scrollTrigger: { trigger: wrap.current!, start: "top 80%", once: true },
        })
        .from(
          slides[0].querySelectorAll("[data-phone]"),
          { y: 60, opacity: 0, duration: 0.9, stagger: 0.13, ease: "power3.out" },
          0,
        )
        .from(
          slides[0].querySelectorAll("[data-note]"),
          {
            y: 22,
            scale: 0.94,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          0.25,
        );
    }, wrap);

    return () => ctx.revert();
  }, []);

  // Hand-over between products: the outgoing one steps aside, the incoming one
  // rebuilds itself — phones first, then the notes.
  useIsoLayoutEffect(() => {
    const slides = slidesOf();
    const from = slides[previous.current];
    const to = slides[index];
    previous.current = index;
    if (!from || !to || from === to) return;

    swap.current?.kill();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(from, { autoAlpha: 0 });
      gsap.set(to, { autoAlpha: 1 });
      return;
    }

    swap.current = gsap
      .timeline()
      .to(from, { autoAlpha: 0, xPercent: -2.5, duration: 0.45, ease: "power2.in" }, 0)
      .set(from, { xPercent: 0 })
      .fromTo(
        to,
        { autoAlpha: 0, xPercent: 2.5 },
        { autoAlpha: 1, xPercent: 0, duration: 0.55, ease: "power2.out" },
        0.28,
      )
      .from(
        to.querySelectorAll("[data-phone]"),
        { y: 46, opacity: 0, duration: 0.75, stagger: 0.11, ease: "power3.out" },
        0.34,
      )
      .from(
        to.querySelectorAll("[data-note]"),
        {
          y: 18,
          scale: 0.95,
          opacity: 0,
          duration: 0.55,
          stagger: 0.09,
          ease: "back.out(1.7)",
        },
        0.5,
      );
  }, [index]);

  // Advances on its own, unless the visitor has asked for less motion or has
  // just taken the control — the timer restarts from the current slide.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => go(1), HOLD);
    return () => window.clearTimeout(timer);
  }, [index, go]);

  return (
    <div ref={wrap} className="relative">
      {/* One track per product; the running one fills over its six seconds. */}
      <div className="absolute right-0 top-[6px] z-20 flex items-center gap-[5px]">
        {showcase.map((slide, i) => (
          <span
            key={slide.name}
            className="h-[3px] w-[18px] overflow-hidden rounded-full bg-ink/12"
          >
            {i === index ? (
              <span
                key={index}
                className="showcase-rail-run block h-full w-full rounded-full bg-ink/70"
              />
            ) : null}
          </span>
        ))}
      </div>

      {/* One control, at the left of the phones: step to the next product. */}
      <div className="absolute left-0 top-1/2 z-30 -translate-y-1/2">
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next product"
          className="grid h-10 w-10 place-items-center rounded-full border border-black/[0.07] bg-white/80 text-ink shadow-[0_10px_30px_-18px_rgba(16,24,40,0.6)] backdrop-blur transition-colors hover:bg-white"
        >
          <Chevron />
        </button>
      </div>

      {showcase.map((slide, i) => (
        <Slide key={slide.name} slide={slide} index={i} />
      ))}
    </div>
  );
}
