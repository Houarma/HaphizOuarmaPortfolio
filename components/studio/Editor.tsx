"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase-client";
import Toolbar, { type Insert } from "./Toolbar";

type Status = "draft" | "published";
type View = "write" | "split" | "read";

type Draft = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover: string;
  tags: string;
  canonicalUrl: string;
  status: Status;
  publishedAt: string | null;
};

const EMPTY: Draft = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  cover: "",
  tags: "",
  canonicalUrl: "",
  status: "draft",
  publishedAt: null,
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);

const words = (body: string) =>
  body.trim() ? body.trim().split(/\s+/).length : 0;

export default function Editor({ id, user }: { id: string; user: User }) {
  const router = useRouter();
  const isNew = id === "new";

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [view, setView] = useState<View>("write");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);
  const [note, setNote] = useState("");
  const [dropping, setDropping] = useState(false);
  // Below xl the rail sits under the writing surface; folded away, it keeps
  // the page short enough to thumb through on a phone.
  const [railOpen, setRailOpen] = useState(false);

  const area = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const docId = useRef(id);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  // ---- load ---------------------------------------------------------------
  useEffect(() => {
    if (isNew) return;
    (async () => {
      const snap = await getDoc(doc(db(), "posts", id));
      if (snap.exists()) {
        const data = snap.data() as Record<string, unknown>;
        const stamp = data.publishedAt as { toDate?: () => Date } | undefined;
        setDraft({
          title: String(data.title ?? ""),
          slug: String(data.slug ?? ""),
          excerpt: String(data.excerpt ?? ""),
          body: String(data.body ?? ""),
          cover: String(data.cover ?? ""),
          tags: Array.isArray(data.tags) ? (data.tags as string[]).join(", ") : "",
          canonicalUrl: String(data.canonicalUrl ?? ""),
          status: (data.status as Status) ?? "draft",
          publishedAt: stamp?.toDate ? stamp.toDate().toISOString() : null,
        });
      }
      setLoading(false);
    })().catch(() => setLoading(false));
  }, [id, isNew]);

  const count = useMemo(() => words(draft.body), [draft.body]);
  const minutes = Math.max(1, Math.round(count / 200));

  // ---- save ---------------------------------------------------------------
  const persist = useCallback(
    async (status: Status, quiet = false) => {
      if (!draft.title.trim()) return;
      setSaving(true);
      if (!quiet) setNote("");

      const slug = draft.slug || slugify(draft.title);
      const payload = {
        title: draft.title,
        slug,
        excerpt: draft.excerpt,
        body: draft.body,
        cover: draft.cover || null,
        tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
        canonicalUrl: draft.canonicalUrl || null,
        status,
        readingMinutes: minutes,
        updatedAt: serverTimestamp(),
        // The first publication stamps the date; later edits leave it alone.
        ...(status === "published" && !draft.publishedAt
          ? { publishedAt: serverTimestamp() }
          : {}),
      };

      try {
        if (docId.current === "new") {
          const created = await addDoc(collection(db(), "posts"), payload);
          docId.current = created.id;
          window.history.replaceState(null, "", `/studio/${created.id}`);
        } else {
          await setDoc(doc(db(), "posts", docId.current), payload, {
            merge: true,
          });
        }

        // A published piece is rebuilt at once rather than on the next window.
        if (status === "published") {
          const token = await user.getIdToken();
          await fetch("/api/revalidate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ slug }),
          });
        }

        setDraft((d) => ({ ...d, slug, status }));
        setSavedAt(new Date());
        setDirty(false);
        if (!quiet) {
          setNote(status === "published" ? "Published and live." : "Saved.");
        }
      } catch {
        setNote("Could not save — check the Firestore rules.");
      } finally {
        setSaving(false);
      }
    },
    [draft, minutes, user],
  );

  // Autosave: quiet, debounced, drafts only. Publishing stays a deliberate act.
  useEffect(() => {
    if (!dirty || !draft.title.trim()) return;
    const timer = window.setTimeout(() => {
      persist(draft.status === "published" ? "published" : "draft", true);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [dirty, draft.title, draft.body, draft.status, persist]);

  // ---- preview ------------------------------------------------------------
  useEffect(() => {
    if (view === "write") return;
    const timer = window.setTimeout(async () => {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: draft.body }),
      });
      const { html } = (await res.json()) as { html: string };
      setPreview(html);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [draft.body, view]);

  // ---- markdown insertion -------------------------------------------------
  const insert = useCallback((action: Insert) => {
    const el = area.current;
    if (!el) return;

    const { selectionStart: from, selectionEnd: to, value } = el;
    const selected = value.slice(from, to);
    let next = value;
    let caret = to;

    if (action.kind === "wrap") {
      const inner = selected || action.hint || "";
      next =
        value.slice(0, from) +
        action.before +
        inner +
        action.after +
        value.slice(to);
      caret = selected
        ? to + action.before.length + action.after.length
        : from + action.before.length + inner.length;
    } else if (action.kind === "line") {
      const start = value.lastIndexOf("\n", from - 1) + 1;
      const block = value.slice(start, to);
      const prefixed = block
        .split("\n")
        .map((line) => (line.startsWith(action.prefix) ? line : action.prefix + line))
        .join("\n");
      next = value.slice(0, start) + prefixed + value.slice(to);
      caret = start + prefixed.length;
    } else {
      const before = value.slice(0, from).replace(/\n*$/, "");
      const after = value.slice(to).replace(/^\n*/, "");
      const block = `${before ? before + "\n\n" : ""}${action.template}\n\n${after}`;
      next = block;
      // Land inside the fence rather than after it.
      const inside = action.template.indexOf("\n") + 1;
      caret = (before ? before.length + 2 : 0) + inside;
    }

    el.value = next;
    setDraft((d) => ({ ...d, body: next }));
    setDirty(true);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }, []);

  // ---- images -------------------------------------------------------------
  const upload = useCallback(async (file: File) => {
    setNote("Uploading…");
    try {
      const path = `posts/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const snap = await uploadBytes(ref(storage(), path), file);
      const url = await getDownloadURL(snap.ref);
      setDraft((d) => ({
        ...d,
        body: `${d.body}\n\n![](${url})\n`,
        cover: d.cover || url,
      }));
      setDirty(true);
      setNote("Image added at the end of the piece.");
    } catch {
      setNote("Upload failed — check the Storage rules.");
    }
  }, []);

  // ---- shortcuts ----------------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === "s") {
        e.preventDefault();
        persist(draft.status === "published" ? "published" : "draft");
      } else if (key === "b") {
        e.preventDefault();
        insert({ kind: "wrap", before: "**", after: "**", hint: "bold" });
      } else if (key === "i") {
        e.preventDefault();
        insert({ kind: "wrap", before: "*", after: "*", hint: "italic" });
      } else if (key === "k") {
        e.preventDefault();
        insert({ kind: "wrap", before: "[", after: "](https://)", hint: "text" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [insert, persist, draft.status]);

  if (loading) {
    return <p className="p-12 text-[14px] text-grey">Loading…</p>;
  }

  const saveLabel = saving
    ? "Saving…"
    : dirty
      ? "Unsaved"
      : savedAt
        ? `Saved ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        : "";

  return (
    <div className="flex min-h-screen flex-col">
      {/* ---------- top bar ---------- */}
      <header className="sticky top-0 z-30 border-b border-line bg-page/85 backdrop-blur">
        {/* One row that survives a 360px screen: the counters drop to a line of
            their own below sm rather than wrapping the controls apart. */}
        <div className="mx-auto flex w-full max-w-[1500px] items-center gap-2.5 px-4 py-2.5 sm:gap-4 sm:px-7 sm:py-3">
          <Link
            href="/studio"
            aria-label="Back to pieces"
            className="shrink-0 text-[13px] text-grey transition-colors hover:text-ink"
          >
            ←<span className="hidden sm:inline"> Pieces</span>
          </Link>

          <span
            className={`shrink-0 rounded-full px-2.5 py-[3px] text-[10.5px] font-medium uppercase tracking-[0.1em] ${
              draft.status === "published"
                ? "bg-live/15 text-[#166534]"
                : "bg-ink/[0.07] text-grey"
            }`}
          >
            {draft.status}
          </span>

          <span className="hidden font-mono text-[11px] text-grey sm:inline">
            {count} words · {minutes} min
          </span>

          <span className="hidden font-mono text-[11px] text-grey sm:inline">
            {saveLabel}
          </span>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="flex rounded-full bg-ink/[0.06] p-[3px]">
              {(["write", "split", "read"] as View[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setView(mode)}
                  // Two panes side by side need width that a phone has not.
                  className={`rounded-full px-2.5 py-[5px] text-[11.5px] font-medium capitalize transition-colors sm:px-3 sm:text-[12px] ${
                    mode === "split" ? "hidden lg:block" : ""
                  } ${view === mode ? "bg-white text-ink shadow-chip" : "text-grey"}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={() => persist("draft")}
              disabled={saving || !draft.title.trim()}
              className="rounded-full border border-line px-3 py-[7px] text-[12.5px] disabled:opacity-40 sm:px-4"
            >
              Save<span className="hidden sm:inline"> draft</span>
            </button>

            <button
              onClick={() => persist("published")}
              disabled={saving || !draft.title.trim() || !draft.body.trim()}
              className="rounded-full bg-ink px-3.5 py-[7px] text-[12.5px] font-semibold text-white disabled:opacity-40 sm:px-5"
            >
              {draft.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 pb-2 font-mono text-[11px] text-grey sm:hidden">
          <span>
            {count} words · {minutes} min
          </span>
          <span className="truncate">{saveLabel}</span>
        </div>

        {note ? (
          <p className="mx-auto max-w-[1500px] px-4 pb-2 text-[12px] text-grey sm:px-7">
            {note}
          </p>
        ) : null}
      </header>

      {/* ---------- desk ---------- */}
      <div className="mx-auto grid w-full max-w-[1500px] flex-1 gap-6 px-4 py-6 sm:px-7 sm:py-8 xl:grid-cols-[minmax(0,1fr)_17rem] xl:gap-8">
        <div className="min-w-0">
          <input
            value={draft.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (isNew && !draft.slug) set("slug", slugify(e.target.value));
            }}
            placeholder="Title"
            className="w-full bg-transparent text-[clamp(1.5rem,5.5vw,2.2rem)] font-bold tracking-[-0.035em] outline-none placeholder:text-ink/20"
          />

          {/* 16px on a phone: below that, iOS zooms the page on focus and the
              writing surface is never the same again. */}
          <textarea
            value={draft.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="One or two sentences. This becomes the meta description, the card blurb and the line under the title."
            rows={3}
            className="mt-3 w-full resize-none bg-transparent text-[16px] leading-relaxed text-grey outline-none placeholder:text-ink/20 sm:text-[15px]"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDropping(true);
            }}
            onDragLeave={() => setDropping(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDropping(false);
              const file = e.dataTransfer.files?.[0];
              if (file?.type.startsWith("image/")) upload(file);
            }}
            className={`mt-6 overflow-hidden rounded-[16px] border bg-card transition-colors ${
              dropping ? "border-accent" : "border-line"
            }`}
          >
            <Toolbar
              onInsert={insert}
              onImage={() => picker.current?.click()}
              disabled={view === "read"}
            />

            <div
              className={
                view === "split"
                  ? "grid divide-x divide-line lg:grid-cols-2"
                  : ""
              }
            >
              {view !== "read" ? (
                <textarea
                  ref={area}
                  value={draft.body}
                  onChange={(e) => set("body", e.target.value)}
                  placeholder="Write in Markdown. Tables, footnotes, $\LaTeX$ and fenced code all work — drop an image anywhere to upload it."
                  className="min-h-[58vh] w-full resize-y bg-transparent p-4 font-mono text-[16px] leading-[1.7] outline-none placeholder:text-ink/25 sm:min-h-[62vh] sm:p-6 sm:text-[13.5px] sm:leading-[1.75]"
                />
              ) : null}

              {view !== "write" ? (
                <div
                  className="prose min-h-[40vh] max-w-none p-4 sm:min-h-[62vh] sm:p-6"
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              ) : null}
            </div>
          </div>

          <input
            ref={picker}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
        </div>

        {/* ---------- the rail ---------- */}
        <aside className="text-[13px]">
          <button
            type="button"
            onClick={() => setRailOpen((v) => !v)}
            aria-expanded={railOpen}
            className="flex w-full items-center justify-between rounded-[12px] border border-line bg-card px-4 py-3 xl:hidden"
          >
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-grey">
              Piece settings
            </span>
            <svg
              viewBox="0 0 24 24"
              className={`h-[16px] w-[16px] text-grey transition-transform duration-300 ${
                railOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div
            className={`flex-col gap-5 pt-4 xl:flex xl:pt-0 ${
              railOpen ? "flex" : "hidden"
            }`}
          >
          <Field label="Slug">
            <input
              value={draft.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              className="w-full rounded-[9px] border border-line bg-card px-3 py-2 font-mono text-[16px] xl:text-[12.5px] outline-none focus:border-ink/30"
            />
            <p className="mt-1.5 truncate font-mono text-[11px] text-grey">
              /writing/{draft.slug || "…"}
            </p>
          </Field>

          <Field label="Tags">
            <input
              value={draft.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="Experimentation, CUPED"
              className="w-full rounded-[9px] border border-line bg-card px-3 py-2 text-[16px] xl:text-[12.5px] outline-none focus:border-ink/30"
            />
            <p className="mt-1.5 text-[11px] text-grey">
              The first one shows in the breadcrumb.
            </p>
          </Field>

          <Field label="Cover">
            <button
              onClick={() => picker.current?.click()}
              className="w-full rounded-[9px] border border-dashed border-line py-2.5 text-[12.5px] text-grey transition-colors hover:border-ink/30 hover:text-ink"
            >
              {draft.cover ? "Replace image" : "Upload an image"}
            </button>
            {draft.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={draft.cover}
                alt=""
                className="mt-2.5 w-full rounded-[9px]"
              />
            ) : null}
          </Field>

          <Field label="Canonical elsewhere">
            <input
              value={draft.canonicalUrl}
              onChange={(e) => set("canonicalUrl", e.target.value)}
              placeholder="Leave empty — this is the original"
              className="w-full rounded-[9px] border border-line bg-card px-3 py-2 text-[16px] xl:text-[12px] outline-none focus:border-ink/30"
            />
          </Field>

          <div className="border-t border-line pt-4">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-grey">
              Shortcuts
            </p>
            <ul className="mt-2.5 space-y-1 font-mono text-[11px] text-grey">
              <li>Ctrl+S — save</li>
              <li>Ctrl+B — bold</li>
              <li>Ctrl+I — italic</li>
              <li>Ctrl+K — link</li>
            </ul>
          </div>

          {!isNew || docId.current !== "new" ? (
            <button
              onClick={async () => {
                if (!confirm("Delete this piece for good?")) return;
                await deleteDoc(doc(db(), "posts", docId.current));
                router.push("/studio");
              }}
              className="self-start text-[12.5px] text-[#b4232a] hover:underline"
            >
              Delete this piece
            </button>
          ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-grey">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
