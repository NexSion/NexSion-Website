import { NextResponse } from "next/server";
import { GITHUB_REPO } from "../../../lib/site-config";

// Hitting /api/download always resolves to whatever the newest GitHub
// Release's .zip asset is — so the website never needs a hardcoded version
// or link. The GitHub Actions workflow in the extension repo is what keeps
// "latest release" current every time manifest.json's version is bumped.
export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: { Accept: "application/vnd.github+json" },
        // Revalidate every 5 minutes instead of hitting GitHub's API on
        // every single click (also helps stay under their rate limit).
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const data = await res.json();
    const asset = (data.assets || []).find((a) => a.name.endsWith(".zip"));
    if (!asset) throw new Error("Latest release has no .zip asset attached");
    return NextResponse.redirect(asset.browser_download_url, { status: 302 });
  } catch (err) {
    // Fall back to the releases page instead of a dead link if anything
    // above fails (no releases published yet, GitHub API hiccup, etc).
    return NextResponse.redirect(
      `https://github.com/${GITHUB_REPO}/releases/latest`,
      { status: 302 }
    );
  }
}
