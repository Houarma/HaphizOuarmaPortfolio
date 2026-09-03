import { aboutMe } from "@/content/site";

// Used in two places: bare in the About Me section, and with a label in the
// bento grid where every card carries one.
export default function PrincipleCard({
  chip,
  className = "",
}: {
  chip?: string;
  className?: string;
}) {
  const { title, tags, rotated } = aboutMe.principle;

  return (
    <article
      className={`card relative overflow-hidden p-5 ${chip ? "pt-[56px]" : ""} ${className}`}
    >
      {chip ? (
        <span className="chip absolute left-4 top-4 z-10">{chip}</span>
      ) : null}

      <h3 className="max-w-[16ch] text-[17px] font-bold leading-[1.3] tracking-[-0.025em]">
        {title}
      </h3>

      {/* A queue of pills: the one at the head tips over, lands on its
          side, and the one already down goes back to the tail. */}
      <div data-anim="queue" className="relative mt-5 h-[176px]">
        {[...tags, rotated].map((tag, i) => (
          <span
            key={tag}
            data-queue
            style={{
              transform:
                i < tags.length
                  ? `translateY(${i * 43}px)`
                  : "translate(172px, 62px) rotate(-76deg)",
            }}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-page px-3.5 py-[7px] text-[12.5px] text-grey shadow-chip"
          >
            {tag}
          </span>
        ))}
      </div>

    </article>
  );
}
