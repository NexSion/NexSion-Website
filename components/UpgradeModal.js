"use client";

import { useState } from "react";

export default function UpgradeModal({ open, plan, onClose, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);
  if (!open) return null;

  const isUpgrade = plan === "pro";

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    // Fake network delay so the mock checkout feels real.
    await new Promise((r) => setTimeout(r, 600));
    await onConfirm();
    setSubmitting(false);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isUpgrade ? "Upgrade to Pro" : "Switch to Free"}</h3>
        <p className="muted">
          {isUpgrade
            ? "$4.99/month, cancel anytime."
            : "You'll lose Pro features at the end of the current period."}
        </p>

        {isUpgrade ? (
          <form onSubmit={handleSubmit}>
            <div className="modal-field">
              <label>Card number</label>
              <input placeholder="4242 4242 4242 4242" required />
            </div>
            <div className="modal-row">
              <div className="modal-field" style={{ flex: 1 }}>
                <label>Expiry</label>
                <input placeholder="MM/YY" required />
              </div>
              <div className="modal-field" style={{ flex: 1 }}>
                <label>CVC</label>
                <input placeholder="123" required />
              </div>
            </div>
            <div className="modal-disclaimer">
              This is a UI mockup — no card processor is connected and no
              money moves. Nothing you type here is stored or sent anywhere.
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={submitting}
              >
                {submitting ? "Processing…" : "Simulate Payment"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
                disabled={submitting}
              >
                Keep Pro
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Working…" : "Confirm Downgrade"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
