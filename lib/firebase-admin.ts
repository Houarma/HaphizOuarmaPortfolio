import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * The server's own credentials. Articles are read with the Admin SDK, never
 * from the browser: that is what lets a crawler receive finished HTML instead
 * of an empty shell waiting on JavaScript.
 *
 * Absent credentials are not an error — the site simply has no articles yet
 * and still builds. That keeps the portfolio deployable before Firebase is
 * wired up.
 */
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const firebaseReady = Boolean(projectId && clientEmail && privateKey);

export function adminDb() {
  if (!firebaseReady) return null;

  const app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });

  return getFirestore(app);
}
