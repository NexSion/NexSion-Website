"use client";

import { useEffect, useState } from "react";
import { useNexSionAuth } from "../../components/Providers";
import UpgradeModal from "../../components/UpgradeModal";

export default function DashboardPage() {
  const { user, loading, source, signIn } = useNexSionAuth();
  const [subscription, setSubscription] = useState(null);
  const [modalPlan, setModalPlan] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/subscription?email=${encodeURIComponent(user.email)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setSubscription)
      .catch(() => {});
  }, [user?.email]);

  async function confirmPlanChange() {
    const res = await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, plan: modalPlan }),
    });
    if (res.ok) setSubscription(await res.json());
    setModalPlan(null);
  }

  if (loading) {
    return <div className="dash-empty">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="dash-empty">
        <p>Sign in to see your account and subscription.</p>
        <button className="btn btn-primary" onClick={signIn}>
          Continue with Google
        </button>
      </div>
    );
  }

  const plan = subscription?.plan || "free";

  return (
    <section className="dash container">
      <div className="section-head" style={{ textAlign: "left" }}>
        <h2>Your account</h2>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <h3>Profile</h3>
          <div className="dash-profile">
            {user.picture && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="dash-avatar" src={user.picture} alt="" />
            )}
            <div>
              <div className="dash-name">{user.name}</div>
              <div className="dash-email">{user.email}</div>
            </div>
          </div>
          {source === "extension" && (
            <p style={{ color: "var(--accent)", fontSize: 12, marginTop: 10 }}>
              ✓ Signed in via your NexSion extension in this browser
            </p>
          )}
          <p style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 14 }}>
            Your actual boards, pages, and wallpapers live in the extension
            itself (synced to this same account) — this dashboard doesn't
            read or change them.
          </p>
        </div>

        <div className="dash-card">
          <h3>Subscription</h3>
          <div className="dash-plan-row">
            <span
              className={"dash-plan-pill" + (plan === "free" ? " free" : "")}
            >
              {plan === "pro" ? "Pro" : "Free"} plan
            </span>
            {plan === "pro" && subscription?.renewsAt && (
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                Renews {new Date(subscription.renewsAt).toLocaleDateString()}
              </span>
            )}
          </div>
          {plan === "pro" ? (
            <button
              className="btn btn-danger btn-block"
              onClick={() => setModalPlan("free")}
            >
              Downgrade to Free
            </button>
          ) : (
            <button
              className="btn btn-primary btn-block"
              onClick={() => setModalPlan("pro")}
            >
              Upgrade to Pro
            </button>
          )}
          <p className="mock-tag">
            Mock subscription — no real payment is connected yet.
          </p>
        </div>
      </div>

      <UpgradeModal
        open={!!modalPlan}
        plan={modalPlan}
        onClose={() => setModalPlan(null)}
        onConfirm={confirmPlanChange}
      />
    </section>
  );
}
