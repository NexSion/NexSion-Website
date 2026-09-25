// Change this if the extension ever moves to a different GitHub repo.
// Used by app/api/download/route.js (auto-redirects to the latest release
// zip) and any "Get the extension" links across the site.
export const GITHUB_REPO = "NexSion/NexSion";

// The extension's fixed ID (visible at chrome://extensions with Developer
// mode on, under NexSion — it's stable because manifest.json ships a "key").
// This MUST match the origins you allow in the extension's
// manifest.json "externally_connectable" list, or the browser will refuse
// to let this site message the extension at all.
export const EXTENSION_ID = "REPLACE_WITH_YOUR_EXTENSION_ID";
