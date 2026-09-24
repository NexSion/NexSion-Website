"use client";

import { useEffect, useRef } from "react";

function IconDownload() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}
function IconUnzip() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h5l2-2h9v13a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
      <path d="M12 11v6" />
      <path d="M9.5 13.5L12 11l2.5 2.5" />
    </svg>
  );
}
function IconAddressBar() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M7 12h6" />
      <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconToggle() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <circle cx="16" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFolderUpload() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8a2 2 0 012-2h4l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      <path d="M12 17v-5" />
      <path d="M9.5 14.5L12 12l2.5 2.5" />
    </svg>
  );
}
function IconSparkle() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.8 4.9L19 9.5l-5.2 1.6L12 16l-1.8-4.9L5 9.5l5.2-1.6L12 3z" />
    </svg>
  );
}

const STEPS = [
  {
    icon: IconDownload,
    title: "Download NexSion",
    text: 'Click "Get the extension" — the latest .zip downloads straight away, no releases page in between.',
  },
  {
    icon: IconUnzip,
    title: "Unzip the folder",
    text: "Extract it somewhere you'll keep — Chrome loads NexSion directly from this folder, so don't delete it afterwards.",
  },
  {
    icon: IconAddressBar,
    title: "Open chrome://extensions",
    text: "Type this straight into your address bar and hit enter.",
  },
  {
    icon: IconToggle,
    title: "Turn on Developer mode",
    text: "Flip the toggle in the top-right corner of the extensions page.",
  },
  {
    icon: IconFolderUpload,
    title: 'Click "Load unpacked"',
    text: "Select the unzipped NexSion folder — the one with manifest.json inside it.",
  },
  {
    icon: IconSparkle,
    title: "Open a new tab",
    text: "NexSion is now your homepage. Sign in with Google to start syncing.",
  },
];

export default function InstallGuide() {
  const containerRef = useRef(null);

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll(".install-step") || [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="install container" id="install">
      <div className="section-head">
        <span className="eyebrow" style={{ marginBottom: 14 }}>
          Get started
        </span>
        <h2>
          Install it <span style={{ color: "var(--accent)" }}>in a minute</span>
        </h2>
        <p>
          NexSion isn&apos;t on the Chrome Web Store yet, so it installs the
          same way any developer extension does.
        </p>
      </div>

      <div className="install-grid">
        <div className="install-steps" ref={containerRef}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                className="install-step"
                key={step.title}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="install-step-num">{i + 1}</span>
                <span className="install-step-icon">
                  <Icon />
                </span>
                <div className="install-step-body">
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Illustrative preview only — not a real screenshot. Swap this
            block for actual <img> screenshots of the extension whenever
            you have some. */}
        <div className="browser-mock">
          <div className="browser-mock-bar">
            <div className="browser-mock-dots">
              <span />
              <span />
              <span />
            </div>
            <div className="browser-mock-address">New Tab</div>
          </div>
          <div className="browser-mock-body">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="mock-logo" />
            <div className="mock-search">🔍 Search anything…</div>
            <div className="mock-app-row">
              <span className="mock-app-icon">📺</span>
              <span className="mock-app-icon">💬</span>
              <span className="mock-app-icon">🎮</span>
              <span className="mock-app-icon">📝</span>
              <span className="mock-app-icon">🎵</span>
            </div>
            <div className="mock-footer-row">
              <div className="mock-clock">
                Mon
                <strong>10:24</strong>
              </div>
              <div className="mock-weather">
                Partly cloudy
                <strong>28°C</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 34 }}>
        <a className="btn btn-primary" href="/api/download">
          Get NexSion — Free
        </a>
      </div>
    </section>
  );
}
