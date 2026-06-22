import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

type PreorderItem = {
  productId: string;
  name: string;
  color: string;
  wrap: string;
  quantity: number;
  priceValue: number;
};

function cleanItems(items: PreorderItem[]) {
  return items
    .filter((item) => item?.productId && item?.name && Number.isFinite(item.quantity) && item.quantity > 0)
    .map((item) => ({
      product_id: item.productId,
      name: item.name.toLowerCase(),
      color: item.color?.toLowerCase() ?? null,
      wrap: item.wrap?.toLowerCase() ?? null,
      quantity: Math.max(1, Math.floor(item.quantity)),
      price_value: Number.isFinite(item.priceValue) ? Math.max(0, Math.floor(item.priceValue)) : 0,
    }));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const rawItems = Array.isArray(body?.items) ? (body.items as PreorderItem[]) : [];
  const items = cleanItems(rawItems);
  const subtotal = typeof body?.subtotal === "number" ? Math.max(0, Math.floor(body.subtotal)) : 0;
  const walletAddress = typeof body?.walletAddress === "string" && body.walletAddress.trim() ? body.walletAddress.trim() : null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "enter a valid email." }, { status: 400 });
  }

  if (!items.length || subtotal <= 0) {
    return NextResponse.json({ message: "add a product before reserving preorder." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ message: "database is not configured yet." }, { status: 500 });
  }

  const reference = `ypod-${Date.now().toString(36)}`;

  const { data: preorder, error: preorderError } = await supabase
    .from("preorders")
    .insert({
      reference,
      email,
      wallet_address: walletAddress,
      subtotal,
      status: "reserved",
    })
    .select("id")
    .single();

  if (preorderError || !preorder?.id) {
    return NextResponse.json({ message: "could not reserve preorder." }, { status: 500 });
  }

  const { error: itemError } = await supabase.from("preorder_items").insert(
    items.map((item) => ({
      preorder_id: preorder.id,
      ...item,
    })),
  );

  if (itemError) {
    await supabase.from("preorders").delete().eq("id", preorder.id);
    return NextResponse.json({ message: "could not save preorder items." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, reference });
}
