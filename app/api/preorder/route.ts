import { NextResponse } from "next/server";

type PreorderItem = {
  productId: string;
  name: string;
  color: string;
  wrap: string;
  quantity: number;
  priceValue: number;
};

const preorders: Array<{
  reference: string;
  email: string;
  items: PreorderItem[];
  subtotal: number;
  walletAddress?: string;
  createdAt: string;
}> = [];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const items = Array.isArray(body?.items) ? (body.items as PreorderItem[]) : [];
  const subtotal = typeof body?.subtotal === "number" ? body.subtotal : 0;
  const walletAddress = typeof body?.walletAddress === "string" ? body.walletAddress : undefined;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "enter a valid email." }, { status: 400 });
  }

  if (!items.length || subtotal <= 0) {
    return NextResponse.json({ message: "add a product before reserving preorder." }, { status: 400 });
  }

  const reference = `ypod-${Date.now().toString(36)}`;
  preorders.push({ reference, email, items, subtotal, walletAddress, createdAt: new Date().toISOString() });

  return NextResponse.json({ ok: true, reference });
}
