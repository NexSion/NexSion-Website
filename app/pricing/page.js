"use client";

import { useEffect, useState } from "react";
import { useNexSionAuth } from "../../components/Providers";
import PlanCard from "../../components/PlanCard";
import UpgradeModal from "../../components/UpgradeModal";

export default function PricingPage() {
  const { user, loading, signIn } = useNexSionAuth();
  const [subscription, setSubscription] = useState(null);
  const [modalPlan, setModalPlan] = useState(null); // "pro" | "free" | null

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

  function handlePlanClick(plan) {
    if (loading) return;
    if (!user) {
      signIn();
      return;
    }
    if (subscription?.plan === plan) return;
    setModalPlan(plan);
  }

  const currentPlan = subscription?.plan || "free";

  return (
    <section className="container" style={{ padding: "150px 0 100px" }}>
      <div className="section-head">
        <h2>Simple pricing</h2>
        <p>Every feature works on Free. Pro just adds a few extras.</p>
      </div>

      <div className="plans">
        <PlanCard
          name="Free"
          price="$0"
          note="Forever free, no card needed."
          features={[
            "Unlimited boards & pages",
            "Google sign-in cloud sync",
            "Share boards & pages via link or code",
            "Widgets, wallpapers & privacy mode",
          ]}
          ctaLabel={currentPlan === "free" ? "Current plan" : "Downgrade"}
          ctaDisabled={currentPlan === "free"}
          onCta={() => handlePlanClick("free")}
        />
        <PlanCard
          name="Pro"
          badge="Mock"
          price="$4.99"
          suffix="/ month"
          note="For power users — UI preview only, not billed yet."
          featured
          features={[
            "Everything in Free",
            "Unlimited devices synced at once",
            "Extra live wallpaper packs",
            "Priority support",
          ]}
          ctaLabel={currentPlan === "pro" ? "Current plan" : "Upgrade to Pro"}
          ctaDisabled={currentPlan === "pro"}
          onCta={() => handlePlanClick("pro")}
        />
      </div>

      <p className="mock-tag">
        Pro is a UI mockup for now — no payment provider is connected, no
        card is charged.
      </p>

      <UpgradeModal
        open={!!modalPlan}
        plan={modalPlan}
        onClose={() => setModalPlan(null)}
        onConfirm={confirmPlanChange}
      />
    </section>
  );
}
