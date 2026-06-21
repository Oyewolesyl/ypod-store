import Link from "next/link";

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
      <div className="shop-hero-visual product-stage" aria-label="floating YPOD product system">
        <img className="stage-product stage-lite" src="/assets/nobg/yema-lite-in-case-nobg.png" alt="YEMA Lite earbuds in charging case" />
        <img className="stage-product stage-pro" src="/assets/nobg/yema-pro-left-ear-nobg.png" alt="YEMA PRO earbud" />
        <img className="stage-product stage-remote" src="/assets/nobg/black-controller-nobg.png" alt="matte black YPOD remote" />
        <img className="stage-product stage-wrap" src="/assets/nobg/kuromi-wrapped-controller-nobg.png" alt="pattern wrapped YPOD remote skin" />
      </div>
    </section>
  );
}
