import Link from "next/link";

export function ShopHero() {
  return (
    <section className="shop-hero">
      <div>
        <p className="section-kicker">shop</p>
        <h1>shop ypod</h1>
        <p>sleep audio, bedside control, and remote customization built into one quiet product system.</p>
        <div className="shop-actions">
          <Link className="shop-button light" href="#products">
            explore products
          </Link>
          <Link className="shop-button secondary" href="/shop/ypod-remote">
            customize remote
          </Link>
        </div>
      </div>
      <div className="shop-hero-visual product-stage" aria-label="floating ypod product system">
        <img className="stage-product stage-lite" src="/assets/nobg/yema-lite-in-case-nobg.png" alt="yema lite earbuds in charging case" />
        <img className="stage-product stage-yema-one-left" src="/assets/nobg/yema-1-left-ear-nobg.png" alt="yema-1 left earbud" />
        <img className="stage-product stage-yema-one-right" src="/assets/nobg/yema-1-right-ear-nobg.png" alt="yema-1 right earbud" />
        <img className="stage-product stage-pro" src="/assets/nobg/yema-pro-left-ear-nobg.png" alt="yema pro earbud" />
        <img className="stage-product stage-remote" src="/assets/nobg/black-controller-nobg.png" alt="matte black ypod remote" />
        <img className="stage-product stage-wrap" src="/assets/nobg/kuromi-wrapped-controller-nobg.png" alt="pattern wrapped ypod remote skin" />
      </div>
    </section>
  );
}
