import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

const waitlistPayloadSource = "store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const interest = typeof body?.interest === "string" && body.interest.trim() ? body.interest.trim().toLowerCase() : "ypod";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "enter a valid email." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ message: "waitlist is not ready yet. please try again shortly." }, { status: 500 });
  }

  const payload = {
    email,
    interest,
    source: waitlistPayloadSource,
  };

  const { error } = await supabase.from("waitlist_entries").insert(payload);

  if (error?.code === "42P01") {
    const fallback = await supabase.from("waitlist").insert(payload);

    if (!fallback.error) {
      return NextResponse.json({ ok: true });
    }

    console.error("waitlist fallback insert failed", {
      code: fallback.error.code,
      message: fallback.error.message,
      details: fallback.error.details,
      hint: fallback.error.hint,
    });
  }

  if (error) {
    console.error("waitlist insert failed", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    return NextResponse.json({ message: "could not save waitlist request. please try again shortly." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
