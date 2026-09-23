"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NexSion" className="nav-logo-img" />
          <span>NexSion</span>
        </Link>
        <nav className="nav-links">
          <Link href="/#install">Install</Link>
          <Link href="/pricing">Pricing</Link>
          <a href="/api/download" className="nav-btn">
            Get the extension
          </a>
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <div className="nav-user">
                {session.user?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="nav-avatar"
                    src={session.user.image}
                    alt=""
                  />
                )}
                <button className="nav-btn" onClick={() => signOut()}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <button
              className="nav-btn nav-btn-accent"
              onClick={() => signIn("google")}
            >
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
