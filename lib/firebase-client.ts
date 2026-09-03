"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * The browser half of Firebase — used only inside /studio, and only to prove
 * who is writing. Readers never touch it: the public pages are rendered on the
 * server with the Admin SDK.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export const clientReady = Boolean(config.apiKey && config.projectId);

const app = () => (getApps().length ? getApp() : initializeApp(config));

export const auth = () => getAuth(app());
export const db = () => getFirestore(app());
export const storage = () => getStorage(app());
