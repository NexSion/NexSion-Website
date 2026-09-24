import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Same Firebase project the extension uses for cloud sync (see
// js/cloudSync.js's FIREBASE_CONFIG) — signing in here and signing in on the
// extension are the same underlying Google/Firebase account.
const firebaseConfig = {
  apiKey: "AIzaSyDHo8ibB67IKZkwCf4zrFCINn4lZDzhV_8",
  authDomain: "nexsion-4f4e0.firebaseapp.com",
  projectId: "nexsion-4f4e0",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
