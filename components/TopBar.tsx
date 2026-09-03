import { site } from "@/content/site";
import NavMenu from "./NavMenu";

export default function TopBar() {
  return (
    <div data-anim="topbar" className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <span className="flex items-end">
          <svg
            width="38"
            height="34"
            viewBox="0 0 38 34"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M19 3.4c1.6 0 3.1.9 4 2.3l10.3 17.4c1.8 3.1-.4 7-4 7H8.7c-3.6 0-5.8-3.9-4-7L15 5.7a4.6 4.6 0 0 1 4-2.3Z"
              stroke="#0b0b0b"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mb-[6px] ml-[3px] h-[6px] w-[6px] rounded-full bg-accent" />
        </span>

        <a
          href={`mailto:${site.links.email}`}
          className="text-[15px] font-medium text-ink underline decoration-ink/25 decoration-[1.5px] underline-offset-[5px] transition-colors hover:decoration-accent"
        >
          {site.links.email}
        </a>
      </div>

      <NavMenu />
    </div>
  );
}
