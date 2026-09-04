import { revalidatePath } from "next/cache";
import { getAuth } from "firebase-admin/auth";
import { getApp, getApps, initializeApp, cert } from "firebase-admin/app";

/**
 * Called by the studio the moment a piece is published or edited, so the
 * public pages are rebuilt without waiting for the hourly window. The caller
 * must present a Firebase ID token belonging to the one account allowed to
 * write; a bearer secret alone would be weaker.
 */
export async function POST(request: Request) {
  const adminUid = process.env.ADMIN_UID;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!adminUid || !projectId || !clientEmail || !privateKey) {
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return Response.json({ error: "No token" }, { status: 401 });

  const app = getApps().length
    ? getApp()
    : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

  let uid: string;
  try {
    ({ uid } = await getAuth(app).verifyIdToken(token));
  } catch {
    return Response.json({ error: "Bad token" }, { status: 401 });
  }

  if (uid !== adminUid) {
    return Response.json({ error: "Not allowed" }, { status: 403 });
  }

  const { slug } = (await request.json()) as { slug?: string };

  revalidatePath("/");
  revalidatePath("/writing");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/writing/${slug}`);

  return Response.json({ revalidated: true, slug: slug ?? null });
}
