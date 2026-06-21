import Link from "next/link";
import type { Product } from "@/lib/shop/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="product-card" href={`/shop/${product.slug}`}>
      <div className="product-card-media">
        <img src={product.images[0]} alt={`${product.name} product render`} />
        {product.images[1] ? <img className="product-card-orbit" src={product.images[1]} alt="" aria-hidden="true" /> : null}
      </div>
      <div className="product-card-body">
        <div>
          <p className="section-kicker">{product.category}</p>
          <h3>{product.name}</h3>
          <p>{product.tagline}</p>
        </div>
        <div className="product-card-footer">
          <span className="shop-price">{product.price}</span>
          <span>view</span>
        </div>
      </div>
    </Link>
  );
}
