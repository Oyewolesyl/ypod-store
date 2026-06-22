"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/shop/products";
import { useCart } from "@/lib/shop/cart";

const wrapClassNames: Record<string, string> = {
  "matte black": "wrap-minimal",
};

const printOptions = [
  { name: "kuromi print", src: "/assets/prints/kuromi-print.png" },
  { name: "john cena print", src: "/assets/prints/john-cena-print.png" },
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
  const [color, setColor] = useState(product.colors[0]?.name ?? "midnight black");
  const [wrap, setWrap] = useState(product.customizable ? product.wraps[0] ?? "matte black" : "none");
  const [wrapPreview, setWrapPreview] = useState<string>();
  const uploadedUrlRef = useRef<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const isController = product.customizable;
  const canChooseWrap = isController;

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
    selectWrap("custom upload", nextPreview);
  }

  return (
    <div className="customizer" aria-label={`${product.name} customizer`}>
      <p className="section-kicker">{isController ? "controller customizer" : "buy"}</p>
      <h2>{isController ? "customize your ypod remote" : "add to cart"}</h2>
      <p>
        {isController
          ? "choose matte black, apply kuromi or john cena print, or upload your own image. the 3d controller updates before you add it to cart."
          : "choose color, quantity, and add it to cart."}
      </p>

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

      {canChooseWrap ? (
        <>
          <div className="customizer-group">
            <label>base finish</label>
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
            <label>skin print</label>
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
              <label className={`print-card upload-card ${wrap === "custom upload" ? "active" : ""}`}>
                <input type="file" accept="image/*" onChange={(event) => handleUpload(event.target.files?.[0])} />
                <span>{wrapPreview && wrap === "custom upload" ? <img src={wrapPreview} alt="uploaded custom print preview" /> : null}</span>
                <strong>upload your image</strong>
              </label>
            </div>
            <p className="customizer-note">
              selected prints update the 3d controller preview and cart item.
            </p>
          </div>
        </>
      ) : null}

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
          add to cart
        </button>
      </div>
    </div>
  );
}
