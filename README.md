# NexSion Website

Landing page, animated install guide, share-preview (`/s/[id]`), and a
**mock** Pro-subscription flow for the NexSion extension — with sign-in
shared between this website and the extension itself when both are used in
the same browser.

## What's real vs. mock

| Piece | Status |
|---|---|
| Landing page, install guide, feature list | Real content |
| `/s/[id]` share preview | Real — reads the same Firestore project (`nexsion-4f4e0`) the extension already writes shares to |
| Sign-in (Firebase Auth, Google) | Real — same Firebase project as the extension, so it's the same account either way |
| Extension ↔ website session sync | Real, **same-browser only** (see below) — uses `chrome.runtime` messaging, not a server |
| Subscription (Free/Pro) | **UI mockup only** — `lib/mockDb.js` is an in-memory store, no payment provider is wired up, no card is ever charged, and the subscription API trusts the client's email with no real verification (see comments in `app/api/subscription/route.js`) |

## How sign-in sync works

The website and the extension are two different apps in the browser, so
there's no built-in way for one to know the other exists — this project
bridges them using Chrome's `externally_connectable` messaging API:

- **Sign in on the website → the extension signs in too, automatically.**
  The website does a normal Firebase/Google popup sign-in, then quietly
  pushes that session to the extension. No extra click needed there.
- **Already signed in on the extension → the website picks it up
  automatically**, but only in the *same browser* the extension is
  installed in (checked on page load and on window focus).
- **Different device/browser**: there's no channel between them — that's a
  hard browser limitation, not something any code can work around. Sign-in
  is still required separately there.
- **Sign out** on the website also signs the extension's cloud session out
  (local boards on-device are left untouched, unlike the extension's own
  "Sign Out" button which asks first and then clears them).

This only works once you:

1. Set `EXTENSION_ID` in `lib/site-config.js` to your extension's real ID
   (find it at `chrome://extensions` with Developer mode on).
2. Add this website's origin(s) to the extension's `manifest.json` under
   `externally_connectable` — see the companion patch
   (`nexsion-extension-auth-sync.zip`) delivered alongside this project.
3. Add your website's domain (and `localhost` for dev) to **Firebase
   Console → Authentication → Settings → Authorized domains**, or Google's
   sign-in popup will reject it.

No environment variables or secrets are needed for auth — Firebase's client
config is safe to ship in the browser bundle (see `lib/firebaseClient.js`),
the same way `js/cloudSync.js` already ships it inside the extension.

## Local setup

```bash
npm install
npm run dev
```

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project** → import the repo → framework preset
   auto-detects Next.js, no config needed, no env vars required.
3. Add your Vercel domain to Firebase's Authorized domains (see above).
4. Update `lib/site-config.js`'s `EXTENSION_ID`, and the extension's
   `manifest.json` `externally_connectable` list, to point at your real
   deployed domain instead of `localhost`.

## Project structure

```
app/
  page.js                 Landing page (logo, version badge, install guide)
  pricing/page.js          Free vs Pro plans + mock checkout
  login/page.js             Sign-in page
  dashboard/page.js         Account + mock subscription management
  s/[id]/page.js             Share preview (boards/pages, selectable import)
  api/download/route.js       Redirects to the latest GitHub release .zip
  api/subscription/route.js    Mock subscription read/write
components/
  Providers.js               Auth context: mirrors the extension's session
                              when present, falls back to Firebase sign-in
  Navbar.js, InstallGuide.js, PlanCard.js, UpgradeModal.js
lib/
  firebaseClient.js          Firebase Auth client config (same project as the extension)
  extensionBridge.js          chrome.runtime messaging helper, extension-optional
  site-config.js               GITHUB_REPO + EXTENSION_ID constants
  mockDb.js                    ⚠️ in-memory mock subscription store
```

## Notes on the share page

`/s/[id]` reads from the exact same `nexsion_shares` Firestore collection
your extension's `CloudSync.createShareLink()` already writes to
(`js/cloudSync.js`), so existing share links keep working unchanged. It
groups links by board, and for a **page** share (multiple boards), visitors
can deselect boards they don't want before copying the import code.

## Note on the "Get it here" link inconsistency

`share-preview.html` (the extension's old static version of this page)
points to `github.com/nexerisltd/NexSion`, while everything else — the
updater, the invite message, `updates.xml`, and `lib/site-config.js` here —
uses `github.com/NexSion/NexSion`. Worth fixing that one link to match.
