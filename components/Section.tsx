import type { ReactNode } from "react";
import Sparkle from "./Sparkle";

export default function Section({
  id,
  chip,
  title,
  accent,
  lede,
  children,
}: {
  id: string;
  chip: string;
  title: string;
  accent?: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 pt-32 sm:pt-40">
      <div className="grid gap-6 md:grid-cols-[minmax(0,21rem)_1fr] md:gap-12">
        <p data-anim="sec-label" className="flex items-start gap-2 text-[14px] font-medium text-ink-soft">
          <Sparkle />
          {chip}
        </p>

        <div>
          <h2 data-anim="sec-title" className="max-w-[26ch] text-[clamp(1.55rem,3.6vw,2.35rem)] font-bold leading-[1.24] tracking-[-0.035em]">
            {title}
            {accent ? <span className="text-accent"> {accent}</span> : null}
          </h2>

          {lede ? (
            <p data-anim="sec-lede" className="mt-5 max-w-[64ch] text-[15px] leading-[1.66] text-grey">
              {lede}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-11 sm:mt-14">{children}</div>
    </section>
  );
}

export function Field({
  label,
  children,
  emphasis = false,
}: {
  label: string;
  children: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <p
        className={`font-mono text-[10.5px] uppercase tracking-[0.16em] ${
          emphasis ? "text-accent" : "text-grey"
        }`}
      >
        {label}
      </p>
      <p className="mt-[7px] text-[14px] leading-[1.62] text-ink-soft">
        {children}
      </p>
    </div>
  );
}
