"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, clientReady } from "@/lib/firebase-client";
import LoginScreen from "./LoginScreen";

/**
 * The door. It is a convenience, not the lock: the real protection is the
 * Firestore rule that only accepts writes from one uid. A guard in the browser
 * can always be walked around; a rule on the server cannot.
 */
export default function Gate({
  children,
}: {
  children: (user: User) => React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!clientReady) {
      setChecking(false);
      return;
    }

    // If Firebase cannot be reached — wrong key, no network — the listener
    // never fires. Show the form rather than a spinner that waits for ever.
    const giveUp = window.setTimeout(() => setChecking(false), 4000);

    const stop = onAuthStateChanged(auth(), (next) => {
      window.clearTimeout(giveUp);
      setUser(next);
      setChecking(false);
    });

    return () => {
      window.clearTimeout(giveUp);
      stop();
    };
  }, []);

  if (!clientReady) {
    return (
      <Shell>
        <p className="text-[14px] leading-relaxed text-grey">
          Firebase is not configured yet. Add the keys listed in{" "}
          <code className="rounded bg-ink/5 px-1.5 py-0.5">.env.example</code> to{" "}
          <code className="rounded bg-ink/5 px-1.5 py-0.5">.env.local</code> and
          restart the server.
        </p>
      </Shell>
    );
  }

  if (checking) {
    return (
      <Shell>
        <p className="text-[14px] text-grey">Checking…</p>
      </Shell>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-5 pt-6 sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-grey">
          Studio
        </p>
        <button
          onClick={() => signOut(auth())}
          className="text-[12.5px] text-grey transition-colors hover:text-ink"
        >
          Sign out
        </button>
      </div>
      {children(user)}
    </>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[380px] flex-col justify-center px-5">
      <p className="mb-6 text-[22px] font-bold tracking-[-0.03em]">Studio</p>
      {children}
    </div>
  );
}
