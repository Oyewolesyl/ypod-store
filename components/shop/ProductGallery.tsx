import type { Product } from "@/lib/shop/products";
import { ProductModelViewer } from "./ProductModelViewer";

export function ProductGallery({ product, selectedColor }: { product: Product; selectedColor?: string }) {
  if (product.modelPath) {
    return (
      <div className="model-gallery-wrap">
        <ProductModelViewer modelPath={product.modelPath} color={selectedColor} />
        <div className="model-gallery-cutouts" aria-label={`${product.name} product cutouts`}>
          {product.images.slice(0, 2).map((image, index) => (
            <img src={image} alt={`${product.name} cutout ${index + 1}`} key={image} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-grid" aria-label={`${product.name} gallery`}>
      {product.images.map((image, index) => (
        <article className="gallery-card" key={image}>
          <img src={image} alt={`${product.name} gallery image ${index + 1}`} />
          <p>{index === 0 ? product.tagline : product.features[index - 1] ?? product.name}</p>
        </article>
      ))}
    </div>
  );
}
