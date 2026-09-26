import InstallGuide from "../components/InstallGuide";
import { GITHUB_REPO } from "../lib/site-config";

const FEATURE_COLORS = [
  ["#3b9eff", "#6366f1"],
  ["#a855f7", "#6366f1"],
  ["#10b981", "#0ea5e9"],
  ["#ec4899", "#a855f7"],
  ["#06b6d4", "#3b9eff"],
  ["#f59e0b", "#ec4899"],
  ["#8b5cf6", "#3b9eff"],
  ["#0ea5e9", "#10b981"],
];

const FEATURES = [
  {
    icon: "🗂️",
    title: "Boards & Pages",
    text: "Organize bookmarks into drag-and-drop boards, grouped across as many pages as you like.",
  },
  {
    icon: "☁️",
    title: "Cloud Sync",
    text: "Sign in with Google and your boards, wallpapers, and settings follow you to every device.",
  },
  {
    icon: "🔗",
    title: "Share Boards & Pages",
    text: "Send a board or a whole page to anyone with a link or an import code — no account required to view it.",
  },
  {
    icon: "🖼️",
    title: "Live Wallpapers",
    text: "Animated or still wallpapers, with an accent color auto-extracted straight from the image.",
  },
  {
    icon: "🧩",
    title: "Widgets",
    text: "Drop a clock, weather, quote, or notepad widget anywhere on your new tab.",
  },
  {
    icon: "⚡",
    title: "Quick Save",
    text: "Ctrl+Shift+S saves the active tab straight to your Quick Saves board — no clicking required.",
  },
  {
    icon: "🕵️",
    title: "Privacy Mode",
    text: "Blur every title and link on demand — handy for screen-sharing or public spaces.",
  },
  {
    icon: "🔍",
    title: "Instant Search",
    text: "Ctrl+K opens a command palette to jump straight to any saved link across every page.",
  },
];

async function getLatestVersion() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.tag_name || null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const version = await getLatestVersion();

  return (
    <>
      <section className="hero container">
        <div className="hero-grid">
          <div className="hero-text">
            <div className="hero-badges">
              {version && (
                <span className="hero-badge-version">{version}</span>
              )}
              <span className="eyebrow">
                <span className="eyebrow-dot" /> Now available
              </span>
            </div>
            <h1>
              Your new tab, <span>reimagined.</span>
            </h1>
            <p>
              NexSion turns every new tab into a visual, drag-and-drop
              bookmark workspace — with cloud sync, sharing, wallpapers, and
              widgets built right in.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/api/download">
                Get NexSion — Free
              </a>
              <a className="btn btn-secondary" href="#install">
                How to install
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-ring" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="hero-visual-core" />
            <div className="hero-chip hero-chip-1">🗂️ Boards</div>
            <div className="hero-chip hero-chip-2">☁️ Synced</div>
            <div className="hero-chip hero-chip-3">🔗 Shareable</div>
            <div className="hero-chip hero-chip-4">🧩 Widgets</div>
          </div>
        </div>
      </section>

      <section className="features container">
        <div className="section-head">
          <span className="eyebrow" style={{ marginBottom: 14 }}>
            Features
          </span>
          <h2>Everything your new tab was missing</h2>
          <p>Free to use, with your data synced to your own Google account.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => {
            const [a, b] = FEATURE_COLORS[i % FEATURE_COLORS.length];
            return (
              <div className="feature-card" key={f.title}>
                <span className="feature-arrow">→</span>
                <span
                  className="feature-icon-badge"
                  style={{ "--fc-a": a, "--fc-b": b }}
                >
                  {f.icon}
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <InstallGuide />
    </>
  );
}
