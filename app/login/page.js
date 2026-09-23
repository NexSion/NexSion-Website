"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <section
      className="container"
      style={{
        padding: "90px 0",
        maxWidth: 380,
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Sign in to NexSion</h2>
      <p style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 26 }}>
        Sign in with the same Google account you use in the extension to
        manage your subscription here.
      </p>
      <button
        className="btn btn-primary btn-block"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        Continue with Google
      </button>
    </section>
  );
}
