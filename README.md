# NexSion Website

Landing page, share-preview (`/s/[id]`), Google sign-in, and a **mock**
Pro-subscription flow for the NexSion extension. Built with Next.js (App
Router) so the whole thing — pages + backend API routes — deploys to Vercel
as one project.

## What's real vs. mock

| Piece | Status |
|---|---|
| Landing page, feature list | Real content |
| `/s/[id]` share preview | Real — reads the same Firestore project (`nexsion-4f4e0`) the extension already writes shares to |
| Google sign-in (NextAuth) | Real backend session, but is a **separate** website login from the extension's own sign-in |
| Subscription (Free/Pro) | **UI mockup only** — `lib/mockDb.js` is an in-memory store, no payment provider is wired up, no card is ever charged |

When you're ready for real billing, swap `lib/mockDb.js` for a real database
and connect a payment provider (Stripe/Paddle/Lemon Squeezy) — see the
comments in `app/api/subscription/route.js` for exactly where that plugs in.

## Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

1. **Google OAuth client** — Google Cloud Console → APIs & Services →
   Credentials → Create Credentials → OAuth client ID → **Web application**
   (this is a *different* client from the extension's, because a website
   login needs a client secret).
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID / Client Secret into `GOOGLE_CLIENT_ID` /
     `GOOGLE_CLIENT_SECRET`.
2. **NEXTAUTH_SECRET** — generate one with `openssl rand -base64 32`.

Then:

```bash
npm run dev
```

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project** → import the repo → framework preset
   auto-detects Next.js, no config needed.
3. Add the same env vars from `.env.local` in **Project Settings → Environment
   Variables**, but set `NEXTAUTH_URL` to your real Vercel domain (e.g.
   `https://nexsion.vercel.app`).
4. Add the production callback URL to the Google OAuth client:
   `https://YOUR-DOMAIN/api/auth/callback/google`.
5. Deploy.

## Project structure

```
app/
  page.js               Landing page
  pricing/page.js        Free vs Pro plans + mock checkout
  login/page.js           Google sign-in
  dashboard/page.js       Account + mock subscription management
  s/[id]/page.js          Share preview (boards/pages, selectable import)
  api/auth/[...nextauth]/route.js   NextAuth backend (Google OAuth)
  api/subscription/route.js         Mock subscription read/write
components/               Navbar, PlanCard, UpgradeModal, Providers
lib/
  auth.js                 NextAuth config
  firebase-config.js      Shared Firestore project constants (same as the extension)
  mockDb.js                ⚠️ in-memory mock subscription store
```

## What's new in this pass

- **Logo** — `public/logo.png`, used in the floating nav, the hero, and as
  the site favicon.
- **Floating sticky nav** — a glass pill, fixed near the top, instead of a
  full-width bar.
- **"Get the extension" no longer sends people to the GitHub Releases
  page.** It hits `/api/download`, which 302-redirects to whatever the
  **latest** GitHub Release's `.zip` asset currently is (cached 5 minutes).
  See `nexsion-extension-workflow.zip` (delivered separately) for the
  companion GitHub Actions workflow that goes in the **extension's own
  repo** — it auto-builds and publishes that zip every time you bump the
  version in `manifest.json` and push to `main`.
- **Animated install guide** (`/#install`) — a 6-step walkthrough (download →
  unzip → `chrome://extensions` → Developer mode → Load unpacked → done),
  each step fading in as you scroll. The icons are illustrative inline SVGs,
  **not real screenshots** — swap `components/InstallGuide.js`'s icon
  components for actual `<img>` screenshots whenever you have some.

## Notes on the share page

`/s/[id]` reads from the exact same `nexsion_shares` Firestore collection
your extension's `CloudSync.createShareLink()` already writes to
(`js/cloudSync.js`), so existing share links keep working unchanged. It
groups links by board (instead of flattening everything into one list like
the earlier static `share-preview.html`), and if a link was a **page** share
(multiple boards), visitors can deselect boards they don't want before
copying the import code.
