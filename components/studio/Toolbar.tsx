"use client";

export type Insert =
  /** Wraps the selection, or drops the pair and puts the caret between. */
  | { kind: "wrap"; before: string; after: string; hint?: string }
  /** Prefixes every selected line. */
  | { kind: "line"; prefix: string }
  /** Drops a block of its own, with a blank line either side. */
  | { kind: "block"; template: string };

type Tool = {
  label: string;
  title: string;
  icon: React.ReactNode;
  action: Insert | "image";
};

const I = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-[15px] w-[15px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export const TOOLS: (Tool | "gap")[] = [
  {
    label: "Bold",
    title: "Bold — Ctrl+B",
    icon: <I d="M7 5h6.5a3.5 3.5 0 0 1 0 7H7zM7 12h7.5a3.5 3.5 0 0 1 0 7H7z" />,
    action: { kind: "wrap", before: "**", after: "**", hint: "bold" },
  },
  {
    label: "Italic",
    title: "Italic — Ctrl+I",
    icon: <I d="M15 5h-5M14 19H9M14.5 5 10 19" />,
    action: { kind: "wrap", before: "*", after: "*", hint: "italic" },
  },
  "gap",
  {
    label: "Heading",
    title: "Section heading",
    icon: <I d="M6 5v14M18 5v14M6 12h12" />,
    action: { kind: "line", prefix: "## " },
  },
  {
    label: "Subheading",
    title: "Subheading",
    icon: <I d="M7 6v12M17 6v12M7 12h10" />,
    action: { kind: "line", prefix: "### " },
  },
  {
    label: "Quote",
    title: "Quote",
    icon: <I d="M6 17V9a3 3 0 0 1 3-3M14 17V9a3 3 0 0 1 3-3" />,
    action: { kind: "line", prefix: "> " },
  },
  "gap",
  {
    label: "Bullets",
    title: "Bulleted list",
    icon: <I d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />,
    action: { kind: "line", prefix: "- " },
  },
  {
    label: "Numbers",
    title: "Numbered list",
    icon: <I d="M10 6h10M10 12h10M10 18h10M4 6h1v4M4 16h2v3H4v-3" />,
    action: { kind: "line", prefix: "1. " },
  },
  "gap",
  {
    label: "Code",
    title: "Inline code",
    icon: <I d="m9 8-5 4 5 4M15 8l5 4-5 4" />,
    action: { kind: "wrap", before: "`", after: "`", hint: "code" },
  },
  {
    label: "Block",
    title: "Code block",
    icon: <I d="M4 6h16v12H4zM8 10l-2 2 2 2M16 10l2 2-2 2" />,
    action: {
      kind: "block",
      template: "```python\n\n```",
    },
  },
  {
    label: "Maths",
    title: "Inline maths",
    icon: <I d="M6 6h12M9 6l6 12M15 6 9 18" />,
    action: { kind: "wrap", before: "$", after: "$", hint: "x" },
  },
  {
    label: "Equation",
    title: "Displayed equation",
    icon: <I d="M4 5h16M4 19h16M8 9h8M8 15h8M12 9v6" />,
    action: { kind: "block", template: "$$\n\n$$" },
  },
  "gap",
  {
    label: "Link",
    title: "Link — Ctrl+K",
    icon: (
      <I d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" />
    ),
    action: { kind: "wrap", before: "[", after: "](https://)", hint: "text" },
  },
  {
    label: "Image",
    title: "Upload an image",
    icon: <I d="M4 6h16v12H4zM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5 17l5-5 4 4 2-2 3 3" />,
    action: "image",
  },
  {
    label: "Table",
    title: "Table",
    icon: <I d="M4 6h16v12H4zM4 10h16M10 10v8" />,
    action: {
      kind: "block",
      template:
        "| Column | Column |\n| --- | --- |\n| Cell | Cell |\n| Cell | Cell |",
    },
  },
  {
    label: "Note",
    title: "Footnote",
    icon: <I d="M6 4h9l3 3v13H6zM9 12h6M9 16h4" />,
    action: {
      kind: "block",
      template: "Claim needing a source[^1].\n\n[^1]: The source.",
    },
  },
];

export default function Toolbar({
  onInsert,
  onImage,
  disabled,
}: {
  onInsert: (insert: Insert) => void;
  onImage: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-line px-2 py-1.5">
      {TOOLS.map((tool, i) =>
        tool === "gap" ? (
          <span key={`gap-${i}`} className="mx-1.5 h-4 w-px bg-line" />
        ) : (
          <button
            key={tool.label}
            type="button"
            title={tool.title}
            aria-label={tool.title}
            disabled={disabled}
            onClick={() =>
              tool.action === "image" ? onImage() : onInsert(tool.action)
            }
            className="grid h-8 w-8 place-items-center rounded-[7px] text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:opacity-40"
          >
            {tool.icon}
          </button>
        ),
      )}
    </div>
  );
}
