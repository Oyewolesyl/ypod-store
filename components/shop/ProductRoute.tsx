import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { getProduct } from "@/lib/shop/products";

export function ProductRoute({ slug }: { slug: string }) {
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
