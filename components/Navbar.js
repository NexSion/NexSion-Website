"use client";

import Link from "next/link";
import { useNexSionAuth } from "./Providers";

export default function Navbar() {
  const { user, loading, signIn, signOut } = useNexSionAuth();

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
          {!loading && user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <div className="nav-user">
                {user.picture && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="nav-avatar" src={user.picture} alt="" />
                )}
                <button className="nav-btn" onClick={signOut}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            !loading && (
              <button className="nav-btn nav-btn-accent" onClick={signIn}>
                Sign in
              </button>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
