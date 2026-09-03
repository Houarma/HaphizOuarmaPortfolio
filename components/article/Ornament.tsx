/** The mark the reference sets in the middle of its rules, in our own hand. */
export default function Ornament() {
  return (
    <div aria-hidden="true" className="my-14 flex items-center gap-5">
      <span className="h-px flex-1 bg-line" />
      <svg viewBox="0 0 38 34" className="h-[17px] w-[17px] text-ink/25">
        <path
          d="M19 3.4c1.6 0 3.1.9 4 2.3l10.3 17.4c1.8 3.1-.4 7-4 7H8.7c-3.6 0-5.8-3.9-4-7L15 5.7a4.6 4.6 0 0 1 4-2.3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
