// ⚠️  MOCK SUBSCRIPTION STORE — NOT REAL BILLING ⚠️
// ---------------------------------------------------------------------------
// This holds subscription state in memory, keyed by the signed-in user's
// email. It exists only so the Pricing/Dashboard UI has something real to
// read and write while you're designing the flow. Two important caveats:
//
//  1. It resets whenever the serverless function cold-starts on Vercel —
//     don't rely on it surviving between deploys or even between requests
//     under real traffic.
//  2. No money moves anywhere. "Upgrading" here just flips a flag.
//
// When you're ready to charge real users, replace this module with a real
// database (Vercel Postgres, Firestore, etc.) and wire the POST handler in
// app/api/subscription/route.js to a real payment provider's webhook
// (Stripe/Paddle/Lemon Squeezy) instead of trusting the client's request body.
// ---------------------------------------------------------------------------

const subscriptions = new Map();

export function getSubscription(email) {
  return (
    subscriptions.get(email) || {
      plan: "free",
      status: "active",
      renewsAt: null,
      mock: true,
    }
  );
}

export function setSubscription(email, sub) {
  subscriptions.set(email, sub);
  return sub;
}
