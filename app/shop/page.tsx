import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopNav } from "@/components/shop/ShopNav";
import { WaitlistForm } from "@/components/shop/WaitlistForm";
import { products } from "@/lib/shop/products";

export default function ShopPage() {
  return (
    <main className="shop-shell">
      <ShopNav />
      <div className="shop-page">
        <ShopHero />

        <section id="products" className="shop-section">
          <img className="shop-drift shop-drift-one" src="/assets/nobg/yema-1-left-ear-nobg.png" alt="" aria-hidden="true" />
          <img className="shop-drift shop-drift-two" src="/assets/nobg/black-controller-nobg.png" alt="" aria-hidden="true" />
          <p className="section-kicker">products</p>
          <h2>sleep audio, bedside control, and remote customization in one system.</h2>
          <div className="shop-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </section>

        <section className="shop-section custom-teaser" aria-labelledby="customization-title">
          <div>
            <p className="section-kicker">remote controller</p>
            <h2 id="customization-title">customize your ypod remote</h2>
            <p>choose matte black, select a print, or upload your own image on the controller page. earbuds stay simple. remote gets the studio.</p>
            <div className="shop-actions">
              <a className="shop-button" href="/shop/ypod-remote">
                open controller studio
              </a>
            </div>
          </div>
          <div className="custom-remote-stack" aria-hidden="true">
            <img src="/assets/nobg/black-controller-nobg.png" alt="" />
            <img src="/assets/nobg/kuromi-wrapped-controller-nobg.png" alt="" />
          </div>
        </section>

        <section className="shop-section feature-strip" aria-label="shop feature strip">
          <article>
            <p className="section-kicker">sleep</p>
            <h3>designed for sleep</h3>
          </article>
          <article>
            <p className="section-kicker">wraps</p>
            <h3>remote skins</h3>
          </article>
          <article>
            <p className="section-kicker">fit</p>
            <h3>premium comfort</h3>
          </article>
          <article>
            <p className="section-kicker">remote</p>
            <h3>calm bedside control</h3>
          </article>
        </section>

        <section className="shop-section payment-section" aria-labelledby="payment-title">
          <div>
            <p className="section-kicker">preorder</p>
            <h2 id="payment-title">reserve the system before checkout goes live.</h2>
            <p>
              collect real preorder interest, cart records, and full-payment references for bank transfer, btc, eth, and usdt.
            </p>
            <WaitlistForm />
          </div>
          <div className="payment-grid">
            <article>
              <span>01</span>
              <h3>email preorder</h3>
              <p>reserve interest from the cart or waitlist without forcing payment before inventory is ready.</p>
            </article>
            <article>
              <span>02</span>
              <h3>wallet layer</h3>
              <p>web3 preorder is wired for wallet connection and can be activated with a configured receiving wallet.</p>
            </article>
            <article>
              <span>03</span>
              <h3>safe launch</h3>
              <p>payments stay controlled until pricing, shipping, refunds, support, and compliance are locked.</p>
            </article>
          </div>
        </section>
      </div>
      <CartDrawer />
    </main>
  );
}
