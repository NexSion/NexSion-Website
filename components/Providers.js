"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebaseClient";
import {
  sendToExtension,
  isExtensionEnvironmentAvailable,
} from "../lib/extensionBridge";

const AuthContext = createContext(null);

function decodeTokenExpiry(idToken) {
  try {
    const payload = JSON.parse(atob(idToken.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : Date.now() + 55 * 60 * 1000;
  } catch {
    return Date.now() + 55 * 60 * 1000;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email, picture } | null
  const [loading, setLoading] = useState(true);
  // Where the currently-shown session came from — lets the UI say
  // "detected from your NexSion extension" instead of pretending this site
  // ran its own login.
  const [source, setSource] = useState(null); // "extension" | "firebase" | null

  const checkExtensionState = useCallback(() => {
    return sendToExtension({ type: "nexsion-get-auth-state" });
  }, []);

  // On mount: prefer whatever the extension (if installed, in this same
  // browser) already has signed in — that's what makes "already logged into
  // the extension" show up on the website with zero extra clicks. Only fall
  // back to this site's own Firebase auth state if there's no extension
  // session to mirror.
  useEffect(() => {
    let cancelled = false;
    let unsubscribeFirebase = () => {};

    (async () => {
      const extState = await checkExtensionState();
      if (cancelled) return;

      if (extState?.signedIn && extState.user) {
        setUser(extState.user);
        setSource("extension");
        setLoading(false);
        return;
      }

      unsubscribeFirebase = onAuthStateChanged(auth, (fbUser) => {
        if (cancelled) return;
        if (fbUser) {
          setUser({
            name: fbUser.displayName,
            email: fbUser.email,
            picture: fbUser.photoURL,
          });
          setSource("firebase");
        } else {
          setUser(null);
          setSource(null);
        }
        setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsubscribeFirebase();
    };
  }, [checkExtensionState]);

  // Re-check on tab focus so switching between the extension's new tab page
  // and this website (in the same browser) stays in sync without a manual
  // refresh — e.g. sign in via the extension, alt-tab to this site, it just
  // reflects that.
  useEffect(() => {
    function onFocus() {
      checkExtensionState().then((extState) => {
        if (extState?.signedIn && extState.user) {
          setUser(extState.user);
          setSource("extension");
        }
      });
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [checkExtensionState]);

  const signIn = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const profile = {
      name: fbUser.displayName,
      email: fbUser.email,
      picture: fbUser.photoURL,
    };
    setUser(profile);
    setSource("firebase");

    // Push this session into the extension too, if it's installed — this is
    // what makes "sign in on the website" also sign the extension in,
    // automatically, with no separate click inside the extension itself.
    if (isExtensionEnvironmentAvailable()) {
      try {
        const idToken = await fbUser.getIdToken();
        const session = {
          uid: fbUser.uid,
          idToken,
          refreshToken: fbUser.refreshToken,
          expiresAt: decodeTokenExpiry(idToken),
        };
        await sendToExtension({
          type: "nexsion-adopt-session",
          session,
          profile,
        });
      } catch (e) {
        console.warn("[NexSion] Couldn't push session to the extension:", e);
      }
    }
  }, []);

  const signOutEverywhere = useCallback(async () => {
    await sendToExtension({ type: "nexsion-sign-out" });
    try {
      await firebaseSignOut(auth);
    } catch {
      // no-op — there may not have been a Firebase session on this site at
      // all if the displayed session came from the extension.
    }
    setUser(null);
    setSource(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, source, signIn, signOut: signOutEverywhere }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useNexSionAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useNexSionAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

// Default export kept as "Providers" so layout.js doesn't need to change.
export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
