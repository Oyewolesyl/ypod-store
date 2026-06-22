"use client";

import { useMemo, useState } from "react";
import { formatNaira, useCart } from "@/lib/shop/cart";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const preorderWallet = process.env.NEXT_PUBLIC_PREORDER_WALLET ?? "";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const orderSummary = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        name: item.name,
        color: item.color,
        wrap: item.wrap,
        quantity: item.quantity,
        priceValue: item.priceValue,
      })),
    [items],
  );

  if (!isOpen) {
    return null;
  }

  async function reservePreorder() {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, items: orderSummary, subtotal, walletAddress }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "could not reserve preorder.");
      }

      setStatus("success");
      setMessage(`preorder reserved: ${data.reference}`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "could not reserve preorder.");
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("error");
      setMessage("wallet not found. install a wallet or use email preorder for now.");
      return;
    }

    const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
    setWalletAddress(accounts[0] ?? "");
  }

  async function startWalletPreorder() {
    if (!preorderWallet) {
      setStatus("error");
      setMessage("wallet preorder is wired, but needs a launch wallet before taking funds.");
      return;
    }

    if (!window.ethereum || !walletAddress) {
      await connectWallet();
      return;
    }

    setMessage("wallet payment request is ready for a configured launch wallet.");
  }

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="shopping cart">
      <aside className="cart-drawer">
        <div className="cart-header">
          <div>
            <p className="section-kicker">preorder cart</p>
            <h2>your ypod setup</h2>
          </div>
          <button className="cart-close" type="button" onClick={closeCart} aria-label="close cart">
            x
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="empty-cart">your cart is empty.</p>
          ) : (
            items.map((item) => (
              <article className="cart-item" key={item.lineId}>
                <img src={item.image} alt={`${item.name} cart thumbnail`} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.wrap === "none" ? item.color : `${item.color} / ${item.wrap}`}</p>
                  {item.wrapPreview ? <img className="cart-wrap-preview" src={item.wrapPreview} alt={`${item.wrap} selected print`} /> : null}
                  <p>{item.price}</p>
                  <div className="cart-line-actions">
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQuantity(item.lineId, item.quantity - 1)} aria-label={`decrease ${item.name} quantity`}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.lineId, item.quantity + 1)} aria-label={`increase ${item.name} quantity`}>
                        +
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.lineId)}>
                      remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="subtotal-row">
            <span>subtotal</span>
            <span>{formatNaira(subtotal)}</span>
          </div>
          <label className="checkout-field">
            email for preorder
            <input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <div className="checkout-actions">
            <button className="shop-button" type="button" onClick={reservePreorder} disabled={!items.length || status === "loading"}>
              reserve preorder
            </button>
            <button className="shop-button secondary" type="button" onClick={connectWallet}>
              {walletAddress ? "wallet connected" : "connect wallet"}
            </button>
            <button className="shop-button secondary" type="button" onClick={startWalletPreorder} disabled={!items.length}>
              web3 preorder
            </button>
          </div>
          {message ? <p className={`waitlist-message ${status}`}>{message}</p> : null}
        </div>
      </aside>
    </div>
  );
}
