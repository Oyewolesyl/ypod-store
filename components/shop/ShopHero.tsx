import Link from "next/link";
import { ProductModelViewer } from "./ProductModelViewer";

export function ShopHero() {
  return (
    <section className="shop-hero">
      <div>
        <p className="section-kicker">shop</p>
        <h1>Shop YPOD</h1>
        <p>Personalized sleep audio, designed for calm nights and better routines.</p>
        <div className="shop-actions">
          <Link className="shop-button light" href="#products">
            Explore Products
          </Link>
          <Link className="shop-button secondary" href="/shop/ypod-remote">
            View remote
          </Link>
        </div>
      </div>
      <div className="shop-hero-visual" aria-label="interactive YPOD remote 3D preview">
        <ProductModelViewer modelPath="/models/ypod-controller.glb" color="#111111" />
        <img className="floating-product float-one" src="/assets/nobg/yema-lite-in-case-nobg.png" alt="floating YEMA Lite earbuds in case" />
        <img className="floating-product float-two" src="/assets/nobg/yema-pro-left-ear-nobg.png" alt="floating YEMA PRO earbud" />
        <img className="floating-product float-three" src="/assets/nobg/kuromi-wrapped-controller-nobg.png" alt="floating custom wrapped YPOD remote" />
      </div>
    </section>
  );
}
