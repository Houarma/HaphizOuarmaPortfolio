// Sits behind the top bar, the identity block and the bento grid. Purely
// decorative: no pointer events, hidden from assistive technology.
export default function GridBackdrop() {
  const cells = [
    "left-[112px] top-[168px]",
    "left-[280px] top-[56px]",
    "left-[56px] top-[392px]",
    "left-[392px] top-[336px]",
    "left-[616px] top-[112px]",
  ];

  return (
    <div
      aria-hidden="true"
      data-anim="grid" className="grid-backdrop pointer-events-none absolute inset-0"
    >
      <span
        data-anim="grid-shine"
        className="absolute inset-y-[-40%] left-0 w-[26%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[3px]"
      />

      {cells.map((cell) => (
        <span key={cell} className={`grid-cell ${cell}`} />
      ))}
    </div>
  );
}
