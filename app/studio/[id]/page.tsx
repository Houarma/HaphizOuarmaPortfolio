"use client";

import { use, useEffect, useMemo, useState } from "react";
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
import Gate from "@/components/studio/Gate";
import { db, storage } from "@/lib/firebase-client";

type Draft = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover: string;
  tags: string;
  canonicalUrl: string;
  status: "draft" | "published";
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

const minutes = (body: string) =>
  Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <Gate>{(user) => <Editor id={id} user={user} />}</Gate>;
}

function Editor({ id, user }: { id: string; user: User }) {
  const router = useRouter();
  const isNew = id === "new";

  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const snap = await getDoc(doc(db(), "posts", id));
      if (snap.exists()) {
        const data = snap.data() as Record<string, unknown>;
        setDraft({
          title: String(data.title ?? ""),
          slug: String(data.slug ?? ""),
          excerpt: String(data.excerpt ?? ""),
          body: String(data.body ?? ""),
          cover: String(data.cover ?? ""),
          tags: Array.isArray(data.tags) ? (data.tags as string[]).join(", ") : "",
          canonicalUrl: String(data.canonicalUrl ?? ""),
          status: (data.status as Draft["status"]) ?? "draft",
          publishedAt: (data.publishedAt as { toDate?: () => Date })?.toDate
            ? (data.publishedAt as { toDate: () => Date }).toDate().toISOString()
            : null,
        });
      }
      setLoading(false);
    })().catch(() => setLoading(false));
  }, [id, isNew]);

  const readingMinutes = useMemo(() => minutes(draft.body), [draft.body]);

  const persist = async (status: Draft["status"]) => {
    setSaving(true);
    setNote("");

    const slug = draft.slug || slugify(draft.title);
    const payload = {
      title: draft.title,
      slug,
      excerpt: draft.excerpt,
      body: draft.body,
      cover: draft.cover || null,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      canonicalUrl: draft.canonicalUrl || null,
      status,
      readingMinutes,
      updatedAt: serverTimestamp(),
      // The first publication stamps the date; later edits leave it alone.
      ...(status === "published" && !draft.publishedAt
        ? { publishedAt: serverTimestamp() }
        : {}),
    };

    try {
      let docId = id;
      if (isNew) {
        const created = await addDoc(collection(db(), "posts"), payload);
        docId = created.id;
      } else {
        await setDoc(doc(db(), "posts", id), payload, { merge: true });
      }

      // Rebuild the public pages straight away rather than waiting an hour.
      const token = await user.getIdToken();
      await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug }),
      });

      setDraft((d) => ({ ...d, slug, status }));
      setNote(status === "published" ? "Published and live." : "Draft saved.");
      if (isNew) router.replace(`/studio/${docId}`);
    } catch {
      setNote("Could not save — check the Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  const upload = async (file: File) => {
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
      setNote("Image added at the end of the body.");
    } catch {
      setNote("Upload failed — check the Storage rules.");
    }
  };

  const runPreview = async () => {
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markdown: draft.body }),
    });
    const { html } = (await res.json()) as { html: string };
    setPreview(html);
    setShowPreview(true);
  };

  if (loading) {
    return <p className="p-12 text-[14px] text-grey">Loading…</p>;
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/studio" className="text-[13px] text-grey hover:text-ink">
          ← Pieces
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          {note ? (
            <span className="mr-1 text-[12.5px] text-grey">{note}</span>
          ) : null}
          <button
            onClick={showPreview ? () => setShowPreview(false) : runPreview}
            className="rounded-full border border-line px-4 py-2 text-[13px]"
          >
            {showPreview ? "Write" : "Preview"}
          </button>
          <button
            onClick={() => persist("draft")}
            disabled={saving}
            className="rounded-full border border-line px-4 py-2 text-[13px] disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            onClick={() => persist("published")}
            disabled={saving || !draft.title || !draft.body}
            className="rounded-full bg-ink px-5 py-2 text-[13px] font-semibold text-white disabled:opacity-40"
          >
            {draft.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_17rem]">
        <div>
          <input
            value={draft.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (isNew && !draft.slug) set("slug", slugify(e.target.value));
            }}
            placeholder="Title"
            className="w-full bg-transparent text-[30px] font-bold tracking-[-0.035em] outline-none placeholder:text-ink/25"
          />

          <textarea
            value={draft.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            placeholder="One or two sentences. This becomes the meta description and the card blurb."
            rows={2}
            className="mt-4 w-full resize-none bg-transparent text-[15px] leading-relaxed text-grey outline-none placeholder:text-ink/25"
          />

          {showPreview ? (
            <div
              className="prose mt-8 border-t border-line pt-8"
              dangerouslySetInnerHTML={{ __html: preview ?? "" }}
            />
          ) : (
            <textarea
              value={draft.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder={"# Markdown\n\nTables, footnotes[^1], $\\LaTeX$ and ```code``` all work.\n\n[^1]: like this."}
              rows={30}
              className="mt-8 w-full resize-y rounded-[14px] border border-line bg-white p-5 font-mono text-[13.5px] leading-[1.7] outline-none focus:border-accent"
            />
          )}
        </div>

        <aside className="flex flex-col gap-5 text-[13px]">
          <Field label="Slug">
            <input
              value={draft.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              className="w-full rounded-[9px] border border-line bg-white px-3 py-2 font-mono text-[12.5px] outline-none focus:border-accent"
            />
            <p className="mt-1.5 font-mono text-[11px] text-grey">
              /writing/{draft.slug || "…"}
            </p>
          </Field>

          <Field label="Tags">
            <input
              value={draft.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="CUPED, variance reduction"
              className="w-full rounded-[9px] border border-line bg-white px-3 py-2 text-[12.5px] outline-none focus:border-accent"
            />
          </Field>

          <Field label="Cover image">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
              }}
              className="w-full text-[12px] text-grey file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-[12px] file:text-white"
            />
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
              className="w-full rounded-[9px] border border-line bg-white px-3 py-2 text-[12px] outline-none focus:border-accent"
            />
          </Field>

          <p className="border-t border-line pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-grey">
            {readingMinutes} min · {draft.status}
          </p>

          {!isNew ? (
            <button
              onClick={async () => {
                if (!confirm("Delete this piece for good?")) return;
                await deleteDoc(doc(db(), "posts", id));
                router.push("/studio");
              }}
              className="self-start text-[12.5px] text-[#b4232a]"
            >
              Delete
            </button>
          ) : null}
        </aside>
      </div>
    </main>
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
