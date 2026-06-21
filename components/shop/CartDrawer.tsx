"use client";

import { formatNaira, useCart } from "@/lib/shop/cart";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="shopping cart">
      <aside className="cart-drawer">
        <div className="cart-header">
          <h2>cart</h2>
          <button className="cart-close" type="button" onClick={closeCart} aria-label="close cart">
            x
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <article className="cart-item" key={item.lineId}>
                <img src={item.image} alt={`${item.name} cart thumbnail`} />
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    {item.color} / {item.wrap}
                  </p>
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
          <button className="shop-button" type="button" onClick={() => alert("Secure checkout stack coming next: card, bank transfer, and wallet payment options.")}>
            secure checkout soon
          </button>
        </div>
      </aside>
    </div>
  );
}
