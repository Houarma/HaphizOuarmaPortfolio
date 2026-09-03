import "server-only";

import { adminDb, firebaseReady } from "./firebase-admin";

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover?: string;
  coverAlt?: string;
  tags: string[];
  status: PostStatus;
  publishedAt: string | null;
  updatedAt: string | null;
  readingMinutes: number;
  /** Set only when the piece first appeared elsewhere and this is the copy. */
  canonicalUrl?: string;
};

const COLLECTION = "posts";

// Firestore hands back Timestamps; the pages want something serialisable.
type Row = Record<string, unknown> & { toDate?: () => Date };
const asIso = (value: unknown): string | null => {
  if (!value) return null;
  const stamp = value as Row;
  if (typeof stamp.toDate === "function") return stamp.toDate().toISOString();
  if (typeof value === "string") return value;
  return null;
};

const shape = (id: string, data: Record<string, unknown>): Post => ({
  id,
  slug: String(data.slug ?? id),
  title: String(data.title ?? "Untitled"),
  excerpt: String(data.excerpt ?? ""),
  body: String(data.body ?? ""),
  cover: (data.cover as string) || undefined,
  coverAlt: (data.coverAlt as string) || undefined,
  tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
  status: (data.status as PostStatus) ?? "draft",
  publishedAt: asIso(data.publishedAt),
  updatedAt: asIso(data.updatedAt),
  readingMinutes: Number(data.readingMinutes ?? 1),
  canonicalUrl: (data.canonicalUrl as string) || undefined,
});

export async function getPublishedPosts(): Promise<Post[]> {
  const db = adminDb();
  if (!db) return [];

  // Filtering and ordering together would need a composite index. At the scale
  // of one author's archive, ordering in memory costs nothing and leaves
  // nothing to administer in the console.
  const snap = await db
    .collection(COLLECTION)
    .where("status", "==", "published")
    .get();

  return snap.docs
    .map((doc) => shape(doc.id, doc.data()))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const db = adminDb();
  if (!db) return null;

  const snap = await db
    .collection(COLLECTION)
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();

  const doc = snap.docs[0];
  return doc ? shape(doc.id, doc.data()) : null;
}

export { firebaseReady };
