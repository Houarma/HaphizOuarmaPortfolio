"use client";

import { useState } from "react";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase-client";

const TILE =
  "flex h-[38px] w-[38px] items-center justify-center rounded-[11px] border border-line bg-white shadow-[0_6px_16px_-10px_rgba(16,24,40,0.5)]";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNote("");
    try {
      await setPersistence(
        auth(),
        remember ? browserLocalPersistence : browserSessionPersistence,
      );
      await signInWithEmailAndPassword(auth(), email, password);
    } catch {
      setError("Please enter the correct password");
    } finally {
      setBusy(false);
    }
  };

  const social = async (which: "google" | "github") => {
    setError("");
    setNote("");
    try {
      const provider =
        which === "google"
          ? new GoogleAuthProvider()
          : new GithubAuthProvider();
      await signInWithPopup(auth(), provider);
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      setError(
        code.includes("operation-not-allowed")
          ? `Enable ${which === "google" ? "Google" : "GitHub"} sign-in in the Firebase console first`
          : "That sign-in did not go through",
      );
    }
  };

  const reset = async () => {
    if (!email) {
      setError("Type your email first, then ask for a new password");
      return;
    }
    setError("");
    try {
      await sendPasswordResetEmail(auth(), email);
      setNote("A reset link is on its way.");
    } catch {
      setError("Could not send the reset link");
    }
  };

  return (
    <div className="flex min-h-screen bg-white p-3 sm:p-4">
      {/* ---------------------------------------------------------------- */}
      <div className="flex w-full flex-col justify-between px-5 py-8 lg:w-1/2 lg:px-10">
        <div className="mx-auto flex w-full max-w-[340px] flex-1 flex-col justify-center">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-ink">
              <svg viewBox="0 0 38 34" className="h-[19px] w-[19px]" aria-hidden="true">
                <path
                  d="M19 3.4c1.6 0 3.1.9 4 2.3l10.3 17.4c1.8 3.1-.4 7-4 7H8.7c-3.6 0-5.8-3.9-4-7L15 5.7a4.6 4.6 0 0 1 4-2.3Z"
                  stroke="#fff"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </span>

            <h1 className="mt-4 text-[20px] font-bold tracking-[-0.03em]">
              Welcome back, Haphiz
            </h1>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-grey">
              Sign in to write and publish on haphizouarma.com.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-2.5">
            <Social onClick={() => social("google")} label="Sign in with Google">
              <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" aria-hidden="true">
                <path
                  fill="#fff"
                  d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.28 12 6.28c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.72 14.53 2.8 12 2.8 6.98 2.8 2.9 6.88 2.9 11.9S6.98 21 12 21c5.24 0 8.7-3.68 8.7-8.87 0-.6-.06-1.05-.15-1.5Z"
                />
              </svg>
            </Social>

            <Social onClick={() => social("github")} label="Sign in with GitHub">
              <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" aria-hidden="true">
                <path
                  fill="#fff"
                  d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.89.88 2.35.67.07-.52.28-.88.51-1.08-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
                />
              </svg>
            </Social>
          </div>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[11px] uppercase tracking-[0.08em] text-grey">
              or
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={submit} className="flex flex-col">
            <label
              htmlFor="email"
              className="text-[11.5px] font-medium text-ink"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-[42px] sm:h-[38px] rounded-[8px] border border-line bg-white px-3 text-[16px] sm:text-[13px] outline-none transition-colors focus:border-ink/40"
            />

            <label
              htmlFor="password"
              className="mt-3.5 text-[11.5px] font-medium text-ink"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={reveal ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                className={`h-[42px] sm:h-[38px] w-full rounded-[8px] border bg-white px-3 pr-10 text-[16px] sm:text-[13px] outline-none transition-colors focus:border-ink/40 ${
                  error ? "border-[#d64550]" : "border-line"
                }`}
              />
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                aria-label={reveal ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-grey transition-colors hover:text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[15px] w-[15px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                >
                  <path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="2.6" />
                  {!reveal ? <path d="m3 3 18 18" /> : null}
                </svg>
              </button>
            </div>

            {error ? (
              <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-[#d64550]">
                <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] shrink-0">
                  <circle cx="8" cy="8" r="8" fill="#d64550" />
                  <path
                    d="M8 4v5M8 11.2v.6"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                {error}
              </p>
            ) : null}

            {note ? (
              <p className="mt-2 text-[11.5px] text-[#166534]">{note}</p>
            ) : null}

            <div className="mt-4 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-[11.5px] text-ink-soft">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-[15px] w-[15px] cursor-pointer accent-ink"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={reset}
                className="text-[11.5px] font-medium text-ink hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-4 h-[40px] rounded-[8px] bg-[#182642] text-[13.5px] font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
            >
              {busy ? "…" : "Continue"}
            </button>
          </form>

          <p className="mt-5 text-center text-[11.5px] text-ink-soft">
            Locked out? Reset from the Firebase console.
          </p>
        </div>

        <p className="mx-auto max-w-[340px] text-center text-[10.5px] leading-relaxed text-grey">
          A private area. Sessions are handled by Firebase Authentication, and
          only one account can publish.
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      <aside className="relative hidden overflow-hidden rounded-[16px] border border-line bg-page lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(11,11,11,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,11,11,0.045) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative px-10 text-center">
          <h2 className="text-[19px] font-bold tracking-[-0.03em]">
            Write. Publish. Measure.
          </h2>
          <p className="mx-auto mt-2 max-w-[42ch] text-[12px] leading-relaxed text-grey">
            One place to draft in Markdown, set the equations, and put a piece
            live on your own domain.
          </p>

          <Constellation />

          <div className="mt-10 flex items-center justify-center gap-1.5">
            <span className="h-[5px] w-[5px] rounded-full bg-ink/20" />
            <span className="h-[5px] w-[14px] rounded-full bg-ink/60" />
            <span className="h-[5px] w-[5px] rounded-full bg-ink/20" />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Social({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[42px] items-center rounded-[9px] border border-line bg-white px-2 transition-colors hover:bg-page"
    >
      <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[7px] bg-ink">
        {children}
      </span>
      <span className="flex-1 text-center text-[13px] font-medium">
        {label}
      </span>
      <span className="w-[26px]" />
    </button>
  );
}

/** The pieces the studio ties together, drawn as one wired diagram. */
function Constellation() {
  const nodes = [
    { label: "MD", x: 6, y: 22 },
    { label: "TeX", x: 118, y: 0 },
    { label: "IMG", x: 236, y: 14 },
    { label: "{ }", x: 0, y: 128 },
    { label: "SEO", x: 240, y: 122 },
    { label: "RSS", x: 18, y: 238 },
    { label: "JSON", x: 128, y: 244 },
    { label: "OG", x: 238, y: 232 },
  ];

  return (
    <div className="relative mx-auto mt-10 h-[280px] w-[280px]">
      <svg
        viewBox="0 0 280 280"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {nodes.map((n) => (
          <line
            key={n.label}
            x1={n.x + 19}
            y1={n.y + 19}
            x2="140"
            y2="140"
            stroke="rgba(11,11,11,0.16)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        ))}
      </svg>

      {nodes.map((n) => (
        <span
          key={n.label}
          className={`absolute ${TILE} font-mono text-[9.5px] text-ink-soft`}
          style={{ left: n.x, top: n.y }}
        >
          {n.label}
        </span>
      ))}

      <span
        className="absolute grid h-[46px] w-[46px] place-items-center rounded-[13px] bg-ink shadow-lift"
        style={{ left: 117, top: 117 }}
      >
        <svg viewBox="0 0 38 34" className="h-[22px] w-[22px]" aria-hidden="true">
          <path
            d="M19 3.4c1.6 0 3.1.9 4 2.3l10.3 17.4c1.8 3.1-.4 7-4 7H8.7c-3.6 0-5.8-3.9-4-7L15 5.7a4.6 4.6 0 0 1 4-2.3Z"
            stroke="#fff"
            strokeWidth="3.2"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    </div>
  );
}
