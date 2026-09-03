"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin);

// The same hook on both sides of the render, without React's SSR warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE = "power3.out";

/**
 * Every animation on the page lives here. Components stay server-rendered and
 * only carry data-anim hooks; this reads them once the page is mounted.
 */
export default function Motion() {
  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const splits: SplitText[] = [];
      const q = <T extends Element = HTMLElement>(sel: string) =>
        gsap.utils.toArray<T>(sel);

      // Lines, each in its own mask, so they rise out of nothing.
      const lines = (el: Element) => {
        const split = new SplitText(el, { type: "lines", mask: "lines" });
        splits.push(split);
        return split.lines;
      };

      const once = (trigger: Element, start = "top 85%") => ({
        trigger,
        start,
        once: true,
      });

      // --- first screen -----------------------------------------------------
      const hero = gsap.timeline({ defaults: { ease: EASE } });

      hero
        .fromTo(
          "[data-anim='topbar']",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0,
        )
        .fromTo(
          "[data-anim='grid']",
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" },
          0,
        );

      const title = document.querySelector("[data-anim='hero-title']");
      if (title) {
        gsap.set(title, { opacity: 1 });
        hero.from(lines(title), { yPercent: 115, duration: 1, stagger: 0.1 }, 0.15);
        hero.from(
          "[data-anim='hero-deck']",
          {
            scale: 0.35,
            rotate: -14,
            opacity: 0,
            duration: 0.9,
            ease: "back.out(2.2)",
          },
          0.5,
        );
      }

      hero.fromTo(
        "[data-anim='hero-cta'] > *",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
        0.75,
      );

      // --- section headings -------------------------------------------------
      q("[data-anim='sec-label']").forEach((el) =>
        gsap.from(el, {
          x: -16,
          opacity: 0,
          duration: 0.8,
          ease: EASE,
          scrollTrigger: once(el, "top 90%"),
        }),
      );

      q("[data-anim='sec-title'], [data-anim='work-title']").forEach((el) =>
        gsap.from(lines(el), {
          yPercent: 115,
          duration: 0.95,
          stagger: 0.09,
          ease: EASE,
          scrollTrigger: once(el),
        }),
      );

      q("[data-anim='sec-lede'], [data-anim='work-spec']").forEach((el) =>
        gsap.from(el, {
          y: 20,
          opacity: 0,
          duration: 0.9,
          delay: 0.15,
          ease: EASE,
          scrollTrigger: once(el, "top 88%"),
        }),
      );

      // --- portrait ---------------------------------------------------------
      const portrait = document.querySelector<HTMLElement>(
        "[data-anim='portrait']",
      );
      if (portrait) {
        gsap.fromTo(
          portrait,
          { clipPath: "inset(100% 0% 0% 0%)", y: 36 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            duration: 1.3,
            ease: EASE,
            scrollTrigger: once(portrait, "top 88%"),
          },
        );
      }

      // --- grids of cards ---------------------------------------------------
      q<HTMLElement>("[data-anim='stagger-grid']").forEach((grid) => {
        gsap.set(grid, { perspective: 1000 });
        gsap.from(Array.from(grid.children), {
          y: 48,
          opacity: 0,
          rotateX: 9,
          transformOrigin: "50% 100%",
          duration: 0.95,
          stagger: 0.09,
          ease: EASE,
          scrollTrigger: once(grid, "top 84%"),
        });
      });

      // --- single blocks ----------------------------------------------------
      q("[data-anim='reveal']").forEach((el) =>
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 1,
          ease: EASE,
          scrollTrigger: once(el, "top 88%"),
        }),
      );

      q<HTMLElement>("[data-anim='reveal-row']").forEach((el) =>
        gsap.from(Array.from(el.children), {
          y: 22,
          opacity: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: EASE,
          scrollTrigger: once(el, "top 90%"),
        }),
      );

      q("[data-anim='blog-cover']").forEach((el) =>
        gsap.fromTo(
          el,
          { scale: 1.14 },
          {
            scale: 1,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: once(el, "top 90%"),
          },
        ),
      );

      // --- the work: the map draws itself -----------------------------------
      const work = document.querySelector("#thesis");
      if (work) {
        const arcs = q<SVGPathElement>("[data-africa='arc']");
        gsap.set(arcs, { drawSVG: "0% 0%" });

        // A light runs the wire: the head leaves, then the tail catches up.
        const travel = arcs.map((arc, i) =>
          gsap
            .timeline({
              repeat: -1,
              repeatDelay: 1.4,
              delay: i * 0.45,
              paused: true,
            })
            .fromTo(
              arc,
              { drawSVG: "0% 0%" },
              { drawSVG: "0% 100%", duration: 1.2, ease: "power1.in" },
            )
            .to(arc, { drawSVG: "100% 100%", duration: 1.2, ease: "power1.out" }),
        );

        gsap
          .timeline({
            defaults: { ease: EASE },
            scrollTrigger: { trigger: work, start: "top 72%", once: true },
            onComplete: () => travel.forEach((t) => t.play()),
          })
          .from(
            "[data-africa='halo']",
            {
              scale: 0.55,
              opacity: 0,
              transformOrigin: "center",
              duration: 1.8,
              ease: "power2.out",
            },
            0,
          )
          .fromTo(
            "[data-africa='coast']",
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 2.4, stagger: 0.2, ease: "power1.inOut" },
            0.1,
          )
          .from(
            "[data-africa='land']",
            { opacity: 0, duration: 1.5, ease: "power2.out" },
            0.7,
          )
          .fromTo(
            "[data-africa='link']",
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 1.1, stagger: 0.07, ease: "power2.out" },
            1.3,
          )
          .from(
            "[data-africa='node'], [data-africa='core']",
            {
              scale: 0,
              transformOrigin: "center",
              duration: 0.65,
              stagger: 0.04,
              ease: "back.out(2.6)",
            },
            1.6,
          );

        // The cities keep breathing once they are there.
        q("[data-africa='node']").forEach((node, i) =>
          gsap.to(node, {
            scale: 1.35,
            opacity: 0.4,
            transformOrigin: "center",
            duration: 1.7,
            delay: 3 + i * 0.22,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }),
        );

        // The map drifts against the scroll.
        gsap.to("[data-anim='africa-parallax']", {
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: work,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      // --- the wordmark -----------------------------------------------------
      const wordmark = document.querySelector("[data-anim='wordmark']");
      if (wordmark) {
        const split = new SplitText(wordmark, { type: "chars", mask: "chars" });
        splits.push(split);
        gsap.from(split.chars, {
          yPercent: 120,
          duration: 1.2,
          stagger: 0.055,
          ease: "power4.out",
          scrollTrigger: once(wordmark, "top 88%"),
        });
      }

      // --- ambient life on the first screen ---------------------------------
      const photo = document.querySelector("[data-anim='hero-photo']");
      if (photo) {
        gsap
          .timeline({ repeat: -1, repeatDelay: 3.2, delay: 2 })
          .to(photo, { rotate: -9, duration: 0.34, ease: "power2.out" })
          .to(photo, { rotate: 7, duration: 0.42, ease: "power2.inOut" })
          .to(photo, { rotate: 0, duration: 1, ease: "elastic.out(1, 0.32)" });
      }

      // A pass of light travels the plotting grid.
      gsap.fromTo(
        "[data-anim='grid-shine']",
        { xPercent: -150, rotate: 18 },
        {
          xPercent: 430,
          rotate: 18,
          duration: 2.4,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 4,
          delay: 1.2,
        },
      );

      // The availability dot sends a signal outward.
      gsap.fromTo(
        "[data-anim='ping']",
        { scale: 1, opacity: 0.75 },
        {
          scale: 3.4,
          opacity: 0,
          transformOrigin: "center",
          duration: 1.3,
          ease: "power2.out",
          repeat: -1,
          repeatDelay: 1.1,
        },
      );

      // The same idea across the portrait, cut to its silhouette.
      gsap.fromTo(
        "[data-anim='portrait-shine']",
        { xPercent: -140, rotate: 16 },
        {
          xPercent: 400,
          rotate: 16,
          duration: 2.3,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 6.5,
          delay: 1.5,
        },
      );

      // --- the arc reads itself, over and over ------------------------------
      const marquee = document.querySelector<HTMLElement>("[data-anim='marquee']");
      const firstRun = marquee?.firstElementChild as HTMLElement | null;
      if (marquee && firstRun) {
        const distance = firstRun.offsetHeight + 14;
        gsap.to(marquee, {
          y: -distance,
          duration: distance / 26,
          ease: "none",
          repeat: -1,
        });
      }

      // --- the three covers trade places ------------------------------------
      const fan = q<HTMLElement>("[data-fan]");
      if (fan.length === 3) {
        const poses = [
          { x: -54, y: 7, rotate: -13, scale: 1, zIndex: 1 },
          { x: 0, y: 0, rotate: 0, scale: 1.08, zIndex: 3 },
          { x: 54, y: 7, rotate: 13, scale: 1, zIndex: 1 },
        ];
        let shift = 0;
        const deal = () => {
          shift = (shift + 1) % 3;
          fan.forEach((el, i) =>
            gsap.to(el, {
              ...poses[(i + shift) % 3],
              duration: 0.9,
              ease: "power3.inOut",
            }),
          );
          gsap.delayedCall(4, deal);
        };
        gsap.delayedCall(4, deal);
      }

      // --- the pills queue: one tips over, the fallen one rejoins the tail --
      const queue = document.querySelector<HTMLElement>("[data-anim='queue']");
      const pills = queue
        ? Array.from(queue.querySelectorAll<HTMLElement>("[data-queue]"))
        : [];
      if (queue && pills.length > 2) {
        const SLOT = 43;
        let order = pills.map((_, i) => i).slice(0, pills.length - 1);
        let down = pills.length - 1;

        const laid = (el: HTMLElement) => ({
          x: queue.clientWidth - 30 - el.offsetWidth / 2,
          y: queue.clientHeight * 0.5 - el.offsetHeight / 2,
          rotate: -76,
        });

        const place = (el: HTMLElement, slot: number) =>
          gsap.to(el, {
            x: 0,
            y: slot * SLOT,
            rotate: 0,
            duration: 0.65,
            ease: "power3.out",
          });

        gsap.set(pills[down], laid(pills[down]));

        const tip = () => {
          const head = order.shift()!;
          const back = down;
          order.push(back);
          down = head;

          place(pills[back], order.length - 1);
          order.forEach((idx, slot) => {
            if (idx !== back) place(pills[idx], slot);
          });

          gsap
            .timeline()
            .to(pills[head], { rotate: -13, duration: 0.32, ease: "power1.in" })
            .to(pills[head], {
              ...laid(pills[head]),
              duration: 0.8,
              ease: "back.out(1.3)",
            });

          gsap.delayedCall(4.2, tip);
        };
        gsap.delayedCall(4.2, tip);
      }

      // --- the lamp behind the contact panel ---------------------------------
      const glow = document.querySelector("[data-anim='card-glow']");
      const rim = document.querySelector("[data-anim='card-rim']");
      if (glow && rim) {
        gsap.set([glow, rim], { opacity: 0.3 });

        gsap
          .timeline({
            repeat: -1,
            repeatDelay: 1.6,
            scrollTrigger: {
              trigger: glow,
              start: "top 96%",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          })
          // It builds slowly, the way a signal gathers, then lets go.
          .to(glow, { opacity: 1, scaleX: 1.07, duration: 2.2, ease: "power2.in" }, 0)
          .to(rim, { opacity: 1, duration: 2.2, ease: "power2.in" }, 0)
          .to(glow, { opacity: 0.3, scaleX: 1, duration: 1.5, ease: "power2.out" }, 2.2)
          .to(rim, { opacity: 0.3, duration: 1.5, ease: "power2.out" }, 2.2);
      }

      // --- the footer arrives on a bounce ------------------------------------
      const wave = document.querySelector("[data-anim='footer-wave']");
      if (wave) {
        const HANGING = "M0 0C0 0,464 300,1139 300S2278 0,2278 0V400H0Z";
        const FLAT = "M0 0C0 0,464 0,1139 0S2278 0,2278 0V400H0Z";

        ScrollTrigger.create({
          trigger: wave,
          start: "top bottom",
          onEnter: (self) => {
            // The faster you arrive, the looser the sheet snaps back.
            const variation = self.getVelocity() / 10000;
            gsap.fromTo(
              wave,
              { morphSVG: HANGING },
              {
                morphSVG: FLAT,
                duration: 2,
                ease: `elastic.out(${1 + variation}, ${1 - variation})`,
                overwrite: true,
              },
            );
          },
          onEnterBack: () =>
            gsap.to(wave, { morphSVG: FLAT, duration: 0.6, ease: "power2.out" }),
          onLeaveBack: () => gsap.set(wave, { morphSVG: HANGING }),
        });
      }

      const footer = document.querySelector<HTMLElement>(
        "[data-anim='footer-bounce']",
      );
      if (footer) {
        gsap.from(footer.querySelectorAll("li"), {
          y: 22,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "back.out(2.6)",
          scrollTrigger: { trigger: footer, start: "top 94%", once: true },
        });
      }

      // --- magnetic buttons -------------------------------------------------
      const magnets = q<HTMLElement>("[data-magnetic]");
      const cleanups = magnets.map((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, {
            x: (e.clientX - (r.left + r.width / 2)) * 0.22,
            y: (e.clientY - (r.top + r.height / 2)) * 0.32,
            duration: 0.5,
            ease: "power3.out",
          });
        };
        const reset = () =>
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", reset);
        return () => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", reset);
        };
      });

      // Covers and fonts change the measurements; re-measure once settled.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);

      return () => {
        window.removeEventListener("load", refresh);
        cleanups.forEach((fn) => fn());
        splits.forEach((s) => s.revert());
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
