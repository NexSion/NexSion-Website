import { NextResponse } from "next/server";
import { getSubscription, setSubscription } from "../../../lib/mockDb";

// ⚠️ MOCK — no server-side identity verification. The email comes straight
// from the client (Firebase Auth's user object, or the extension's stored
// profile), purely so the Pricing/Dashboard mockup has something to key
// off of. This is fine for a UI mockup with no real money involved, but do
// NOT ship this pattern once real billing exists — verify the caller
// server-side first (e.g. check a Firebase ID token with the Admin SDK)
// instead of trusting whatever email the request claims.
export async function GET(req) {
  const email = new URL(req.url).searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  return NextResponse.json(getSubscription(email));
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  if (!body.email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  const plan = body.plan === "pro" ? "pro" : "free";
  const sub = setSubscription(body.email, {
    plan,
    status: "active",
    renewsAt:
      plan === "pro"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null,
    mock: true,
  });
  return NextResponse.json(sub);
}
