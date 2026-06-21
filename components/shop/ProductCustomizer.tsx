"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/shop/products";
import { useCart } from "@/lib/shop/cart";

const wrapClassNames: Record<string, string> = {
  Minimal: "wrap-minimal",
  "Calm Gradient": "wrap-gradient",
  Abstract: "wrap-abstract",
  Space: "wrap-space",
  Nature: "wrap-nature",
  "Custom Upload Coming Soon": "wrap-custom",
  "Upload Your Image": "wrap-custom",
};

const printOptions = [
  { name: "Kuromi Print", src: "/assets/prints/kuromi-print.png" },
  { name: "John Cena Print", src: "/assets/prints/john-cena-print.png" },
];

export function ProductCustomizer({
  product,
  onColorChange,
  onWrapTextureChange,
}: {
  product: Product;
  onColorChange?: (color: string) => void;
  onWrapTextureChange?: (textureUrl?: string) => void;
}) {
  const [color, setColor] = useState(product.colors[0]?.name ?? "Midnight Black");
  const [wrap, setWrap] = useState(product.wraps[0] ?? "Minimal");
  const [wrapPreview, setWrapPreview] = useState<string>();
  const uploadedUrlRef = useRef<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    return () => {
      if (uploadedUrlRef.current) {
        URL.revokeObjectURL(uploadedUrlRef.current);
      }
    };
  }, []);

  function selectColor(nextColor: string) {
    setColor(nextColor);
    const colorValue = product.colors.find((option) => option.name === nextColor)?.value;
    onColorChange?.(colorValue ?? "#111111");
  }

  function selectWrap(nextWrap: string, preview?: string) {
    setWrap(nextWrap);
    setWrapPreview(preview);
    onWrapTextureChange?.(preview);
  }

  function handleUpload(file?: File) {
    if (!file) {
      return;
    }

    if (uploadedUrlRef.current) {
      URL.revokeObjectURL(uploadedUrlRef.current);
    }

    const nextPreview = URL.createObjectURL(file);
    uploadedUrlRef.current = nextPreview;
    selectWrap("Custom Upload", nextPreview);
  }

  return (
    <div className="customizer" aria-label={`${product.name} customizer`}>
      <p className="section-kicker">customize</p>
      <h2>make it yours.</h2>
      <p>Choose the product color, skin pattern, and quantity. The selected setup is carried into the cart so the shopping flow remembers the build.</p>

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
        <label>skin / wrap</label>
        <div className="wrap-grid" role="list" aria-label="wrap styles">
          {product.wraps.map((option) => (
            <button
              className={`wrap-card ${wrapClassNames[option] ?? "wrap-minimal"} ${wrap === option ? "active" : ""}`}
              key={option}
              type="button"
              onClick={() => selectWrap(option)}
            >
              <span aria-hidden="true" />
              <strong>{option}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="customizer-group">
        <label>print options</label>
        <div className="print-grid" role="list" aria-label="print options">
          {printOptions.map((option) => (
            <button
              className={`print-card ${wrap === option.name ? "active" : ""}`}
              key={option.name}
              type="button"
              onClick={() => selectWrap(option.name, option.src)}
            >
              <img src={option.src} alt={`${option.name} controller skin print`} />
              <strong>{option.name}</strong>
            </button>
          ))}
          <label className={`print-card upload-card ${wrap === "Custom Upload" ? "active" : ""}`}>
            <input type="file" accept="image/*" onChange={(event) => handleUpload(event.target.files?.[0])} />
            <span>{wrapPreview && wrap === "Custom Upload" ? <img src={wrapPreview} alt="uploaded custom print preview" /> : null}</span>
            <strong>Upload your image</strong>
          </label>
        </div>
        <p className="customizer-note">Selected prints update the controller preview and cart item.</p>
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
        <button className="shop-button" type="button" onClick={() => addItem({ product, color, wrap, wrapPreview, quantity })}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
