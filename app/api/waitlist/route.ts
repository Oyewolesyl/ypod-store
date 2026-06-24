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
    console.error("waitlist insert failed", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    if (error.code === "42P01") {
      return NextResponse.json({ message: "waitlist table is missing. run the supabase sql setup." }, { status: 500 });
    }

    if (error.code === "42501") {
      return NextResponse.json({ message: "database permission blocked. check the supabase secret key in vercel." }, { status: 500 });
    }

    return NextResponse.json({ message: `could not save waitlist request. database code: ${error.code ?? "unknown"}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
