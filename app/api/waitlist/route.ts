import { NextResponse } from "next/server";

type WaitlistEntry = {
  email: string;
  interest: string;
  createdAt: string;
};

const waitlistEntries: WaitlistEntry[] = [];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const interest = typeof body?.interest === "string" ? body.interest.trim() : "ypod";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "enter a valid email." }, { status: 400 });
  }

  const exists = waitlistEntries.some((entry) => entry.email === email && entry.interest === interest);
  if (!exists) {
    waitlistEntries.push({ email, interest, createdAt: new Date().toISOString() });
  }

  return NextResponse.json({ ok: true, count: waitlistEntries.length });
}
