// Same Firebase project the NexSion extension already uses for cloud backups
// and share links (see js/cloudSync.js). Kept in one place so the website and
// the extension always agree on where shared boards/pages live.
export const FIREBASE_PROJECT_ID = "nexsion-4f4e0";
export const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
