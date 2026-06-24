import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { products } from "@/lib/shop/products";

type PreorderItem = {
  productId: string;
  name: string;
  color: string;
  wrap: string;
  quantity: number;
  priceValue: number;
};

function cleanItems(items: PreorderItem[]) {
  const productPriceMap = new Map(products.map((product) => [product.id, product.priceValue]));

  return items
    .filter((item) => item?.productId && item?.name && Number.isFinite(item.quantity) && item.quantity > 0)
    .map((item) => ({
      product_id: item.productId,
      name: item.name.toLowerCase(),
      color: item.color?.toLowerCase() ?? null,
      wrap: item.wrap?.toLowerCase() ?? null,
      quantity: Math.max(1, Math.floor(item.quantity)),
      price_value: productPriceMap.get(item.productId) ?? 0,
    }));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const rawItems = Array.isArray(body?.items) ? (body.items as PreorderItem[]) : [];
  const items = cleanItems(rawItems);
  const submittedSubtotal = typeof body?.subtotal === "number" ? Math.max(0, Math.floor(body.subtotal)) : 0;
  const subtotal = items.reduce((total, item) => total + item.price_value * item.quantity, 0);
  const walletAddress = typeof body?.walletAddress === "string" && body.walletAddress.trim() ? body.walletAddress.trim() : null;
  const txHash = typeof body?.txHash === "string" && body.txHash.trim() ? body.txHash.trim() : null;
  const paymentWallet = typeof body?.paymentWallet === "string" && body.paymentWallet.trim() ? body.paymentWallet.trim() : null;
  const paymentAmountWei = typeof body?.paymentAmountWei === "string" && body.paymentAmountWei.trim() ? body.paymentAmountWei.trim() : null;
  const paymentAmountUnits = typeof body?.paymentAmountUnits === "string" && body.paymentAmountUnits.trim() ? body.paymentAmountUnits.trim() : null;
  const paymentChainId = typeof body?.paymentChainId === "string" && body.paymentChainId.trim() ? body.paymentChainId.trim() : null;
  const paymentMethod = typeof body?.paymentMethod === "string" && body.paymentMethod.trim() ? body.paymentMethod.trim() : "email preorder";
  const paymentAsset = typeof body?.paymentAsset === "string" && body.paymentAsset.trim() ? body.paymentAsset.trim().toLowerCase() : null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "enter a valid email." }, { status: 400 });
  }

  if (!items.length || subtotal <= 0 || submittedSubtotal <= 0) {
    return NextResponse.json({ message: "add a product before reserving preorder." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ message: "preorder system is not ready yet. please try again shortly." }, { status: 500 });
  }

  const reference = `ypod-${Date.now().toString(36)}`;

  const { data: preorder, error: preorderError } = await supabase
    .from("preorders")
    .insert({
      reference,
      email,
      wallet_address: walletAddress,
      subtotal,
      status: paymentAsset === "bank_transfer" ? "bank_pending_confirmation" : txHash ? "paid_pending_confirmation" : "reserved",
      payment_method: paymentMethod,
      payment_asset: paymentAsset,
      payment_wallet: paymentWallet,
      payment_amount_wei: paymentAmountWei ?? paymentAmountUnits,
      payment_chain_id: paymentChainId,
      payment_tx_hash: txHash,
    })
    .select("id")
    .single();

  if (preorderError || !preorder?.id) {
    console.error("preorder insert failed", {
      code: preorderError?.code,
      message: preorderError?.message,
      details: preorderError?.details,
      hint: preorderError?.hint,
    });

    return NextResponse.json({ message: "could not reserve preorder. please try again shortly." }, { status: 500 });
  }

  const { error: itemError } = await supabase.from("preorder_items").insert(
    items.map((item) => ({
      preorder_id: preorder.id,
      ...item,
    })),
  );

  if (itemError) {
    console.error("preorder items insert failed", {
      code: itemError.code,
      message: itemError.message,
      details: itemError.details,
      hint: itemError.hint,
    });

    await supabase.from("preorders").delete().eq("id", preorder.id);
    return NextResponse.json({ message: "could not save preorder items. please try again shortly." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, reference });
}
