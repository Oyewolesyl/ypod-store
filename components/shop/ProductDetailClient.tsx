"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/shop/products";
import { CartDrawer } from "./CartDrawer";
import { ProductCustomizer } from "./ProductCustomizer";
import { ProductGallery } from "./ProductGallery";
import { ShopNav } from "./ShopNav";

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.value ?? "#111111");

  return (
    <main className="shop-shell product-detail">
      <ShopNav />
      <section className="product-detail-hero">
        <div>
          <ProductGallery product={product} selectedColor={selectedColor} />
        </div>

        <div className="product-summary">
          <p className="section-kicker">{product.category}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="shop-price">{product.price}</p>
          <ProductCustomizer product={product} onColorChange={setSelectedColor} />
        </div>
      </section>

      <section className="detail-sections">
        <div>
          <p className="section-kicker">features</p>
          <h2>built around night routines.</h2>
        </div>
        <div className="spec-grid">
          {product.features.map((feature) => (
            <article className="spec-card" key={feature}>
              <h3>{feature}</h3>
              <p>{product.tagline}</p>
            </article>
          ))}
        </div>

        <div>
          <p className="section-kicker">specs</p>
          <h2>product notes.</h2>
        </div>
        <div className="spec-grid">
          {Object.entries(product.specs).map(([label, value]) => (
            <article className="spec-card" key={label}>
              <h3>{label}</h3>
              <p>{value}</p>
            </article>
          ))}
        </div>

        <div>
          <p className="section-kicker">box</p>
          <h2>what's in the box.</h2>
        </div>
        <div className="spec-grid">
          {product.whatsInTheBox.map((item) => (
            <article className="spec-card" key={item}>
              <h3>{item}</h3>
              <p>included with {product.name}</p>
            </article>
          ))}
        </div>

        <div>
          <p className="section-kicker">faq</p>
          <h2>quick answers.</h2>
        </div>
        <div className="faq-grid">
          {product.faqs.map((faq) => (
            <article className="faq-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>

        <div className="shop-actions">
          <Link className="shop-button secondary" href="/shop">
            back to shop
          </Link>
        </div>
      </section>
      <CartDrawer />
    </main>
  );
}
