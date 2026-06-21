import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopNav } from "@/components/shop/ShopNav";
import { products } from "@/lib/shop/products";

export default function ShopPage() {
  return (
    <main className="shop-shell">
      <ShopNav />
      <div className="shop-page">
        <ShopHero />

        <section id="products" className="shop-section">
          <p className="section-kicker">products</p>
          <h2>sleep audio, bedside control, and customization in one system.</h2>
          <div className="shop-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </section>

        <section className="shop-section custom-teaser" aria-labelledby="customization-title">
          <div>
            <p className="section-kicker">customization</p>
            <h2 id="customization-title">Make it yours.</h2>
            <p>Choose colors, wraps, and personal design options built for your sleep setup.</p>
            <div className="shop-actions">
              <a className="shop-button" href="/shop/custom-wraps">
                Customize YPOD
              </a>
            </div>
          </div>
          <div className="custom-swatches" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="shop-section feature-strip" aria-label="shop feature strip">
          <article>
            <p className="section-kicker">sleep</p>
            <h3>Designed for sleep</h3>
          </article>
          <article>
            <p className="section-kicker">wraps</p>
            <h3>Personalized wraps</h3>
          </article>
          <article>
            <p className="section-kicker">fit</p>
            <h3>Premium comfort</h3>
          </article>
          <article>
            <p className="section-kicker">remote</p>
            <h3>Calm bedside control</h3>
          </article>
        </section>

        <section className="shop-section payment-section" aria-labelledby="payment-title">
          <div>
            <p className="section-kicker">checkout direction</p>
            <h2 id="payment-title">secure, simple, ready for global buyers.</h2>
            <p>
              The store is structured so checkout can grow into card payment, bank transfer,
              and wallet-based payment without rebuilding the shopping experience.
            </p>
          </div>
          <div className="payment-grid">
            <article>
              <span>01</span>
              <h3>card and transfer</h3>
              <p>Practical local checkout first: card, bank transfer, order confirmation, shipping, and support.</p>
            </article>
            <article>
              <span>02</span>
              <h3>wallet payment layer</h3>
              <p>WalletConnect or stablecoin checkout can be added once compliance, refunds, and accounting are ready.</p>
            </article>
            <article>
              <span>03</span>
              <h3>safe release path</h3>
              <p>No live payment is collected until pricing, inventory, tax, shipping, returns, and customer support are locked.</p>
            </article>
          </div>
        </section>
      </div>
      <CartDrawer />
    </main>
  );
}
