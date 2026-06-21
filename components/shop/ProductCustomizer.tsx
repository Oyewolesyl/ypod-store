"use client";

import { useState } from "react";
import type { Product } from "@/lib/shop/products";
import { useCart } from "@/lib/shop/cart";

export function ProductCustomizer({
  product,
  onColorChange,
}: {
  product: Product;
  onColorChange?: (color: string) => void;
}) {
  const [color, setColor] = useState(product.colors[0]?.name ?? "Midnight Black");
  const [wrap, setWrap] = useState(product.wraps[0] ?? "Minimal");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  function selectColor(nextColor: string) {
    setColor(nextColor);
    const colorValue = product.colors.find((option) => option.name === nextColor)?.value;
    onColorChange?.(colorValue ?? "#111111");
  }

  return (
    <div className="customizer" aria-label={`${product.name} customizer`}>
      <p className="section-kicker">customize</p>
      <h2>make it yours.</h2>
      <p>Choose the product color, wrap direction, and quantity. Material editing is prepared for the 3D model without depending on unknown GLB material names.</p>

      <div className="customizer-group">
        <label>color</label>
        <div className="option-grid" role="list" aria-label="product colors">
          {product.colors.map((option) => (
            <button
              className={`option-pill color-pill ${color === option.name ? "active" : ""}`}
              key={option.name}
              type="button"
              onClick={() => selectColor(option.name)}
            >
              <span className="color-dot" style={{ background: option.value }} aria-hidden="true" />
              {option.name}
            </button>
          ))}
        </div>
      </div>

      <div className="customizer-group">
        <label>wrap style</label>
        <div className="option-grid" role="list" aria-label="wrap styles">
          {product.wraps.map((option) => (
            <button
              className={`option-pill ${wrap === option ? "active" : ""}`}
              key={option}
              type="button"
              onClick={() => setWrap(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="customizer-group quantity-row">
        <label>quantity</label>
        <div className="quantity-control">
          <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="decrease quantity">
            -
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((current) => current + 1)} aria-label="increase quantity">
            +
          </button>
        </div>
      </div>

      <div className="shop-actions">
        <button className="shop-button" type="button" onClick={() => addItem({ product, color, wrap, quantity })}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
