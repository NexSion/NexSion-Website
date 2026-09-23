import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../lib/auth";
import { getSubscription, setSubscription } from "../../../lib/mockDb";

async function requireEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email || null;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  return NextResponse.json(getSubscription(email));
}

// MOCK upgrade/downgrade — trusts the client-sent plan on purpose, because
// there's no real payment provider wired up yet. Do not ship this endpoint
// as-is once real billing exists; a real integration confirms the plan via a
// webhook from the payment provider, not from the request body.
export async function POST(req) {
  const email = await requireEmail();
  if (!email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const plan = body.plan === "pro" ? "pro" : "free";
  const sub = setSubscription(email, {
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
