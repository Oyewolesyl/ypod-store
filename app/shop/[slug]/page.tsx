import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { getProduct, products } from "@/lib/shop/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
