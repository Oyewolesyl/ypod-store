"use client";

import Link from "next/link";
import { useCart } from "@/lib/shop/cart";

export function ShopNav() {
  const { items, openCart } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="shop-nav">
      <a className="shop-brand" href="https://ypod.vercel.app">
        ypod
      </a>
      <nav className="shop-nav-links" aria-label="shop navigation">
        <a href="https://ypod.vercel.app">home</a>
        <Link href="/">shop</Link>
        <Link href="/shop/ypod-remote">customize</Link>
        <button className="cart-icon-button" type="button" onClick={openCart} aria-label={`open cart with ${count} items`}>
          <span aria-hidden="true">bag</span>
          {count > 0 ? <strong>{count}</strong> : null}
        </button>
      </nav>
    </header>
  );
}
