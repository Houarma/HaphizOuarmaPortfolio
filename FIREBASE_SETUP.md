# Wiring the writing studio

Fifteen minutes, once.

## 1. The project

Firebase console → **Add project** (an existing one works too).

## 2. The account that may write

**Authentication → Sign-in method → Email/Password → Enable.**
Then **Users → Add user** with your address and a long password. Copy the
**User UID** — it goes in `ADMIN_UID`.

Do not enable sign-up anywhere. There is exactly one account, created by hand.

## 3. Firestore

**Firestore Database → Create database → Production mode.**
Then **Rules**, replacing `YOUR_UID`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{post} {
      // The server reads with the Admin SDK, which bypasses these rules.
      // Nobody else reads or writes.
      allow read, write: if request.auth != null
                         && request.auth.uid == 'YOUR_UID';
    }
  }
}
```

This rule is the actual lock. The login screen is only a convenience.

## 4. Storage, for figures

**Storage → Get started → Production mode**, then Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{file} {
      allow read: if true;               // published figures are public
      allow write: if request.auth != null
                   && request.auth.uid == 'YOUR_UID';
    }
  }
}
```

## 5. The keys

- Browser keys: **Project settings → Your apps → Web app**. If there is no web
  app yet, create one. Copy `apiKey`, `authDomain`, `projectId`,
  `storageBucket`.
- Server key: **Project settings → Service accounts → Generate new private
  key**. The JSON holds `project_id`, `client_email` and `private_key`.

Copy `.env.example` to `.env.local` and fill it in. The private key stays on one
line with its `\n` sequences intact.

On Vercel, add the same variables under **Settings → Environment Variables**.

## 6. Check

```
npm run dev
```

Open `/studio`, sign in, write a piece, publish. It appears at
`/writing/your-slug`, joins `/sitemap.xml`, and the page is rebuilt at once.

## Publishing to Medium afterwards

Publish here first and let Google index it — you can force this from Search
Console. Then on Medium use **Import a story** and give it your URL: Medium
sets `rel=canonical` back to you automatically. You keep Medium's readers, and
your domain keeps the credit.

---

## Comments on articles

Readers sign in with Google in one click — no sign-up form, no password to
store. Two things to switch on.

### 1. Google as a sign-in method

**Authentication → Sign-in method → Google → Enable.** Pick a support email and
save. This also lights up the Google button on the studio door.

### 2. Rules for the thread

Add this next to the `posts` block in **Firestore → Rules**:

```
match /comments/{comment} {
  // A published thread is public to read.
  allow read: if true;

  // Anyone signed in may add one, in their own name, within a sane length.
  allow create: if request.auth != null
                && request.resource.data.authorUid == request.auth.uid
                && request.resource.data.body is string
                && request.resource.data.body.size() > 0
                && request.resource.data.body.size() < 1500;

  // Its author may remove it — and so may you, on any comment.
  allow delete: if request.auth != null
                && (request.auth.uid == resource.data.authorUid
                    || request.auth.uid == 'piaU7zFm8lhypu3J4W1OCITBa3C2');

  // Nothing is ever edited after the fact.
  allow update: if false;
}
```

Comments cannot be edited, only removed. That keeps a thread honest: nobody
rewrites what somebody replied to.

Until Google sign-in is enabled the section still renders and still reads; the
button simply says so instead of failing quietly.
