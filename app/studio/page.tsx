"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Gate from "@/components/studio/Gate";
import { db } from "@/lib/firebase-client";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt?: { toDate?: () => Date };
};

export default function StudioIndex() {
  return <Gate>{() => <PostList />}</Gate>;
}

function PostList() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(
        query(collection(db(), "posts"), orderBy("updatedAt", "desc")),
      );
      setRows(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) }) as Row),
      );
    })().catch(() => setRows([]));
  }, []);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-8">
      <div className="flex items-end justify-between gap-6">
        <h1 className="text-[30px] font-bold tracking-[-0.035em]">Pieces</h1>
        <Link
          href="/studio/new"
          className="rounded-full bg-ink px-5 py-[11px] text-[14px] font-semibold text-white"
        >
          New piece
        </Link>
      </div>

      {rows === null ? (
        <p className="mt-10 text-[14px] text-grey">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-10 text-[14px] text-grey">
          Nothing yet. The first piece starts on the right.
        </p>
      ) : (
        <ul className="mt-10 border-t border-line">
          {rows.map((row) => (
            <li key={row.id} className="border-b border-line">
              <Link
                href={`/studio/${row.id}`}
                className="flex items-center justify-between gap-6 py-5"
              >
                <span>
                  <span className="text-[16px] font-semibold tracking-[-0.02em]">
                    {row.title || "Untitled"}
                  </span>
                  <span className="ml-3 font-mono text-[11px] text-grey">
                    /{row.slug}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] ${
                    row.status === "published"
                      ? "bg-live/15 text-[#166534]"
                      : "bg-ink/[0.06] text-grey"
                  }`}
                >
                  {row.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
