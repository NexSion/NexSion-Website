"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import UpgradeModal from "../../components/UpgradeModal";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [modalPlan, setModalPlan] = useState(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/subscription")
      .then((r) => (r.ok ? r.json() : null))
      .then(setSubscription)
      .catch(() => {});
  }, [status]);

  async function confirmPlanChange() {
    const res = await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: modalPlan }),
    });
    if (res.ok) setSubscription(await res.json());
    setModalPlan(null);
  }

  if (status === "loading") {
    return <div className="dash-empty">Loading…</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="dash-empty">
        <p>Sign in to see your account and subscription.</p>
        <button className="btn btn-primary" onClick={() => signIn("google")}>
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
            {session.user?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="dash-avatar" src={session.user.image} alt="" />
            )}
            <div>
              <div className="dash-name">{session.user?.name}</div>
              <div className="dash-email">{session.user?.email}</div>
            </div>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 14 }}>
            This is your website account. Your actual boards, pages, and
            wallpapers live in the NexSion extension itself (synced to this
            same Google account) — this dashboard doesn't read or change
            them.
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
