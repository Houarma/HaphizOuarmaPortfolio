"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, clientReady, db } from "@/lib/firebase-client";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID ?? "";
const LIMIT = 1400;

type Comment = {
  id: string;
  authorName: string;
  authorPhoto: string;
  authorUid: string;
  body: string;
  createdAt: string | null;
};

const since = (iso: string | null) => {
  if (!iso) return "just now";
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  const steps: [number, number, Intl.RelativeTimeFormatUnit][] = [
    [60, 1, "second"],
    [3600, 60, "minute"],
    [86400, 3600, "hour"],
    [2592000, 86400, "day"],
    [31536000, 2592000, "month"],
  ];
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [limit, divisor, unit] of steps) {
    if (seconds < limit) {
      return format.format(-Math.round(seconds / divisor), unit);
    }
  }
  return format.format(-Math.round(seconds / 31536000), "year");
};

export default function Comments({ slug }: { slug: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      // Filtering and sorting in one query would want a composite index;
      // a single thread is small enough to order here.
      const snap = await getDocs(
        query(collection(db(), "comments"), where("postSlug", "==", slug)),
      );
      setComments(
        snap.docs
          .map((d) => {
            const data = d.data() as Record<string, unknown>;
            const stamp = data.createdAt as { toDate?: () => Date } | undefined;
            return {
              id: d.id,
              authorName: String(data.authorName ?? "Reader"),
              authorPhoto: String(data.authorPhoto ?? ""),
              authorUid: String(data.authorUid ?? ""),
              body: String(data.body ?? ""),
              createdAt: stamp?.toDate ? stamp.toDate().toISOString() : null,
            };
          })
          .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? "")),
      );
    } catch {
      setComments([]);
    }
  }, [slug]);

  useEffect(() => {
    if (!clientReady) {
      setComments([]);
      return;
    }
    const stop = onAuthStateChanged(auth(), setUser);
    load();
    return stop;
  }, [load]);

  const signIn = async () => {
    setError("");
    try {
      await signInWithPopup(auth(), new GoogleAuthProvider());
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      setError(
        code.includes("operation-not-allowed")
          ? "Google sign-in is not enabled on this project yet."
          : "That sign-in did not go through.",
      );
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setBusy(true);
    setError("");
    try {
      await addDoc(collection(db(), "comments"), {
        postSlug: slug,
        authorUid: user.uid,
        authorName: user.displayName ?? "Reader",
        authorPhoto: user.photoURL ?? "",
        body: body.trim().slice(0, LIMIT),
        createdAt: serverTimestamp(),
      });
      setBody("");
      await load();
    } catch {
      setError("Could not post that. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db(), "comments", id));
      await load();
    } catch {
      setError("Could not delete that comment.");
    }
  };

  const count = comments?.length ?? 0;

  return (
    <section id="comments" className="scroll-mt-10">
      <h2 className="text-[22px] font-bold tracking-[-0.03em]">
        Comments ({count})
      </h2>

      {comments === null ? (
        <p className="mt-5 text-[14px] text-grey">Loading…</p>
      ) : (
        <>
          {count > 0 ? (
            <ul className="mt-7 flex flex-col gap-6">
              {comments.map((c) => (
                <li key={c.id} className="flex gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.authorPhoto || "/media/avatar.svg"}
                    alt=""
                    className="mt-[2px] h-[34px] w-[34px] shrink-0 rounded-full bg-page object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-x-2.5">
                      <span className="text-[14px] font-semibold tracking-[-0.01em]">
                        {c.authorName}
                      </span>
                      <span className="text-[12px] text-grey">
                        {since(c.createdAt)}
                      </span>
                      {user &&
                      (user.uid === c.authorUid || user.uid === ADMIN_UID) ? (
                        <button
                          onClick={() => remove(c.id)}
                          className="text-[12px] text-grey transition-colors hover:text-[#b4232a]"
                        >
                          Delete
                        </button>
                      ) : null}
                    </p>
                    <p className="mt-1.5 whitespace-pre-wrap text-[14.5px] leading-[1.6] text-ink-soft">
                      {c.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {user ? (
            <form onSubmit={send} className="mt-8">
              <div className="flex gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.photoURL ?? "/media/avatar.svg"}
                  alt=""
                  className="mt-[2px] h-[34px] w-[34px] shrink-0 rounded-full bg-page object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value.slice(0, LIMIT))}
                    rows={3}
                    placeholder="Add to the discussion — a correction is as welcome as praise."
                    className="w-full resize-y rounded-[12px] border border-line bg-card p-3.5 text-[14.5px] leading-relaxed outline-none transition-colors focus:border-ink/30"
                  />
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[12px] text-grey">
                      Signed in as {user.displayName ?? "you"} ·{" "}
                      <button
                        type="button"
                        onClick={() => signOut(auth())}
                        className="underline transition-colors hover:text-ink"
                      >
                        sign out
                      </button>
                    </p>
                    <button
                      type="submit"
                      disabled={busy || !body.trim()}
                      className="rounded-full bg-ink px-5 py-[9px] text-[13px] font-semibold text-white transition-opacity disabled:opacity-40"
                    >
                      {busy ? "Posting…" : "Post comment"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[14px] border border-line bg-card px-5 py-4">
              <p className="text-[14px] text-ink-soft">
                Sign in to join the discussion:
              </p>
              <button
                onClick={signIn}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-[8px] text-[13px] font-semibold text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[13px] w-[13px]"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.28 12 6.28c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.72 14.53 2.8 12 2.8 6.98 2.8 2.9 6.88 2.9 11.9S6.98 21 12 21c5.24 0 8.7-3.68 8.7-8.87 0-.6-.06-1.05-.15-1.5Z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          {error ? (
            <p className="mt-3 text-[13px] text-[#b4232a]">{error}</p>
          ) : null}
        </>
      )}
    </section>
  );
}
