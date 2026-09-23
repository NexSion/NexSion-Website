"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { FIRESTORE_BASE } from "../../../lib/firebase-config";

function faviconFor(url) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?sz=32&domain=${u.hostname}`;
  } catch {
    return "";
  }
}

const PREVIEW_LIMIT_PER_BOARD = 8;

async function encodeNXS2(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  const gz = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
  const compressed = new Uint8Array(await new Response(gz).arrayBuffer());
  let binary = "";
  for (let i = 0; i < compressed.length; i++) binary += String.fromCharCode(compressed[i]);
  const b64 = btoa(binary);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(b64));
  const checksum = Array.from(new Uint8Array(digest))
    .slice(0, 4)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `NXS2:${b64}:${checksum}`;
}

export default function SharePage() {
  const params = useParams();
  const shareId = params?.id;

  const [state, setState] = useState("loading"); // loading | error | ready
  const [title, setTitle] = useState("");
  const [payload, setPayload] = useState(null);
  const [boards, setBoards] = useState([]);
  const [isPageShare, setIsPageShare] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [copyLabel, setCopyLabel] = useState("Copy code to import in NexSion");

  useEffect(() => {
    if (!shareId || !/^[a-z0-9]{4,32}$/i.test(shareId)) {
      setState("error");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${FIRESTORE_BASE}/nexsion_shares/${encodeURIComponent(shareId)}`
        );
        if (!res.ok) throw new Error("not found");
        const doc = await res.json();
        const parsed = JSON.parse(doc.fields.data.stringValue);
        const docTitle = doc.fields.title?.stringValue || "Shared links";

        const pageShare = Array.isArray(parsed.boards);
        const normalized = pageShare
          ? parsed.boards.map((b, i) => ({
              id: "b" + i,
              name: b.name || "Untitled board",
              color: b.color || "",
              links: Array.isArray(b.links) ? b.links : [],
            }))
          : [
              {
                id: "b0",
                name: (parsed.board && parsed.board.name) || docTitle,
                color: "",
                links: Array.isArray(parsed.links) ? parsed.links : [],
              },
            ];

        setPayload(parsed);
        setTitle(docTitle);
        setIsPageShare(pageShare);
        setBoards(normalized);
        setSelected(new Set(normalized.map((b) => b.id)));
        setState("ready");
      } catch {
        setState("error");
      }
    })();
  }, [shareId]);

  const toggleBoard = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const totalLinks = boards.reduce((sum, b) => sum + b.links.length, 0);
  const totalBoards = boards.length;
  const allSelected = selected.size === totalBoards;

  async function handleCopy() {
    if (isPageShare && totalBoards > 1 && selected.size === 0) {
      setCopyLabel("Select at least one board first");
      setTimeout(() => setCopyLabel("Copy code to import in NexSion"), 2200);
      return;
    }
    try {
      const exportPayload =
        isPageShare && selected.size !== totalBoards
          ? { ...payload, boards: payload.boards.filter((_, i) => selected.has("b" + i)) }
          : payload;
      const code = await encodeNXS2(exportPayload);
      await navigator.clipboard.writeText(code);
      setCopyLabel("Copied! Paste it into NexSion");
      setTimeout(() => setCopyLabel("Copy code to import in NexSion"), 2500);
    } catch {
      setCopyLabel("Couldn't copy — try selecting manually");
    }
  }

  if (state === "loading") {
    return (
      <div className="share-wrap">
        <div className="share-card">
          <div className="share-state">Loading what was shared with you…</div>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="share-wrap">
        <div className="share-card">
          <div className="share-state">
            This link isn&apos;t valid anymore, or the person who shared it
            removed it.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="share-wrap">
      <div className="share-card">
        <h1>{title}</h1>
        <p className="share-meta">
          {isPageShare
            ? `${totalBoards} board${totalBoards === 1 ? "" : "s"} • ${totalLinks} link${totalLinks === 1 ? "" : "s"} shared via NexSion`
            : `${totalLinks} link${totalLinks === 1 ? "" : "s"} shared via NexSion`}
        </p>

        {isPageShare && totalBoards > 1 && (
          <div className="select-row">
            <span>
              {allSelected
                ? "All boards selected"
                : `${selected.size} of ${totalBoards} boards selected`}
            </span>
            <button
              type="button"
              onClick={() =>
                setSelected(
                  allSelected ? new Set() : new Set(boards.map((b) => b.id))
                )
              }
            >
              {allSelected ? "Select none" : "Select all"}
            </button>
          </div>
        )}

        {boards.map((board) => (
          <div className="board-group" key={board.id}>
            <div
              className="board-group-head"
              onClick={() =>
                isPageShare && totalBoards > 1 && toggleBoard(board.id)
              }
            >
              {isPageShare && totalBoards > 1 && (
                <input
                  type="checkbox"
                  className="board-check"
                  checked={selected.has(board.id)}
                  onChange={() => toggleBoard(board.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {board.color && (
                <span
                  className="board-swatch"
                  style={{ background: board.color }}
                />
              )}
              <span className="board-group-name">{board.name}</span>
              <span className="board-group-count">
                {board.links.length} link{board.links.length === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="share-links">
              {board.links.slice(0, PREVIEW_LIMIT_PER_BOARD).map((link, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={link.url + i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={faviconFor(link.url)} alt="" loading="lazy" />
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title || link.url}
                  </a>
                </li>
              ))}
              {board.links.length > PREVIEW_LIMIT_PER_BOARD && (
                <li className="more">
                  + {board.links.length - PREVIEW_LIMIT_PER_BOARD} more
                </li>
              )}
            </ul>
          </div>
        ))}

        <div className="share-actions">
          <button className="btn btn-primary" onClick={handleCopy}>
            {copyLabel}
          </button>
          <a
            className="btn btn-secondary"
            href="https://github.com/NexSion/NexSion"
            target="_blank"
            rel="noopener noreferrer"
          >
            Don&apos;t have NexSion yet? Get it here
          </a>
        </div>
        <p className="share-hint">
          Open NexSion, click &quot;Import a shared page,&quot; and paste the
          copied code.
        </p>
      </div>
    </div>
  );
}
