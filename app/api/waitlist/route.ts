import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const interest = typeof body?.interest === "string" && body.interest.trim() ? body.interest.trim().toLowerCase() : "ypod";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "enter a valid email." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ message: "database is not configured yet." }, { status: 500 });
  }

  const { error } = await supabase.from("waitlist_entries").insert({
    email,
    interest,
    source: "store",
  });

  if (error) {
    return NextResponse.json({ message: "could not save waitlist request." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
