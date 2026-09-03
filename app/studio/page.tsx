"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import Gate from "@/components/studio/Gate";
import { db } from "@/lib/firebase-client";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  readingMinutes?: number;
  updatedAt: string | null;
};

export default function StudioIndex() {
  return <Gate>{() => <PieceList />}</Gate>;
}

function PieceList() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db(), "posts"));
      setRows(
        snap.docs
          .map((d) => {
            const data = d.data() as Record<string, unknown>;
            const stamp = data.updatedAt as { toDate?: () => Date } | undefined;
            return {
              id: d.id,
              title: String(data.title ?? "Untitled"),
              slug: String(data.slug ?? ""),
              status: String(data.status ?? "draft"),
              readingMinutes: Number(data.readingMinutes ?? 0),
              updatedAt: stamp?.toDate ? stamp.toDate().toISOString() : null,
            };
          })
          .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")),
      );
    })().catch(() => setRows([]));
  }, []);

  const shown = useMemo(() => {
    if (!rows) return null;
    const q = filter.trim().toLowerCase();
    return q
      ? rows.filter((r) => (r.title + r.slug).toLowerCase().includes(q))
      : rows;
  }, [rows, filter]);

  const drafts = rows?.filter((r) => r.status === "draft").length ?? 0;
  const live = rows?.filter((r) => r.status === "published").length ?? 0;

  return (
    <main className="mx-auto w-full max-w-[1000px] px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.038em]">Pieces</h1>
          <p className="mt-1.5 text-[13.5px] text-grey">
            {live} published · {drafts} in draft
          </p>
        </div>

        <Link
          href="/studio/new"
          className="rounded-full bg-ink px-5 py-[11px] text-[14px] font-semibold text-white transition-transform hover:-translate-y-[1px]"
        >
          New piece
        </Link>
      </div>

      {rows && rows.length > 3 ? (
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by title or slug"
          className="mt-8 w-full rounded-[10px] border border-line bg-card px-4 py-2.5 text-[13.5px] outline-none focus:border-ink/30 sm:max-w-[320px]"
        />
      ) : null}

      {shown === null ? (
        <p className="mt-12 text-[14px] text-grey">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="mt-12 text-[14px] text-grey">
          Nothing here yet. The first piece starts at the top right.
        </p>
      ) : (
        <ul className="mt-9 border-t border-line">
          {shown.map((row) => (
            <li key={row.id} className="border-b border-line">
              <div className="flex items-center gap-4 py-4">
                <Link href={`/studio/${row.id}`} className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-semibold tracking-[-0.02em]">
                    {row.title || "Untitled"}
                  </p>
                  <p className="mt-[3px] truncate font-mono text-[11.5px] text-grey">
                    /{row.slug}
                    {row.readingMinutes ? ` · ${row.readingMinutes} min` : ""}
                    {row.updatedAt
                      ? ` · ${new Date(row.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
                      : ""}
                  </p>
                </Link>

                {row.status === "published" ? (
                  <a
                    href={`/writing/${row.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-[12px] text-grey transition-colors hover:text-ink"
                  >
                    View
                  </a>
                ) : null}

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.1em] ${
                    row.status === "published"
                      ? "bg-live/15 text-[#166534]"
                      : "bg-ink/[0.06] text-grey"
                  }`}
                >
                  {row.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
