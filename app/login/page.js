"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNexSionAuth } from "../../components/Providers";

export default function LoginPage() {
  const { user, loading, source, signIn } = useNexSionAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  return (
    <section
      className="container"
      style={{ padding: "150px 0 90px", maxWidth: 380, textAlign: "center" }}
    >
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Sign in to NexSion</h2>
      <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 26 }}>
        {source === "extension"
          ? "Detected from your installed extension — you're already signed in."
          : "Sign in with the same Google account you use in the extension. If the extension is installed in this browser, it'll sign in automatically too."}
      </p>
      {source !== "extension" && (
        <button className="btn btn-primary btn-block" onClick={signIn}>
          Continue with Google
        </button>
      )}
    </section>
  );
}
