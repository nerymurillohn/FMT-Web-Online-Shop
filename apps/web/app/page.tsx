import type { Metadata } from "next";
import Image from "next/image";
import { CurrencySelector } from "../components/CurrencySelector";
import { ShippingEstimator } from "../components/ShippingEstimator";
import { ShopifyReadiness } from "../components/ShopifyReadiness";

type ProductLine = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

type GlobalHighlight = {
  title: string;
  description: string;
  emphasis: string;
};

export const metadata: Metadata = {
  title: "Forestal MT | Exporting Nature Without Borders",
  description:
    "Forestal Murillo Tejada combines Shopify commerce, DHL Express shipping, and localized pricing to deliver Honduran ethnobotanical products worldwide.",
  keywords: [
    "Forestal MT",
    "Shopify",
    "DHL Express",
    "batana oil",
    "melipona honey",
    "Honduras exports"
  ],
  openGraph: {
    title: "Forestal MT | Exporting Nature Without Borders",
    description:
      "Discover how Forestal Murillo Tejada ships Honduran ethnobotanical treasures globally with Shopify, localized pricing previews, and DHL Express fulfillment.",
    type: "website"
  }
};

const PRODUCT_LINES: ProductLine[] = [
  {
    title: "Batana Oil",
    description: "Ancestral Miskito elixir for hair, scalp, and beard care.",
    image: "/images/batana-placeholder.svg",
    alt: "Stylized gradient background representing batana oil"
  },
  {
    title: "Melipona Honey",
    description: "Raw stingless bee honey treasured by the Mayans for holistic wellness.",
    image: "/images/melipona-placeholder.svg",
    alt: "Amber gradient background symbolizing melipona honey"
  },
  {
    title: "Traditional Herbs",
    description: "Wildcrafted botanicals preserving Honduran ancestral wisdom.",
    image: "/images/herbs-placeholder.svg",
    alt: "Green gradient background suggesting Honduran traditional herbs"
  }
];

const GLOBAL_HIGHLIGHTS: GlobalHighlight[] = [
  {
    title: "Shopify as the Commerce Engine",
    description:
      "Product catalog, payments, and order operations run inside Shopify. This Next.js experience consumes Storefront APIs for product discovery while redirecting to Shopify Checkout for conversion.",
    emphasis: "Shopify-native setup"
  },
  {
    title: "Localized Pricing",
    description:
      "Charge in USD to simplify accounting and taxes, while automatically displaying reference prices in local currencies on product pages.",
    emphasis: "Multi-currency display"
  },
  {
    title: "DHL Express Worldwide",
    description:
      "Integrated DHL Express rates cover more than 220 destinations with transparent delivery estimates and duties guidance.",
    emphasis: "Trusted global shipping"
  }
];

export default function Home() {
  return (
    <main className="homepage">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__copy">
          <span className="hero__eyebrow">Exporting Nature Without Borders</span>
          <h1 id="hero-heading">
            Honduras' ethnobotanical heritage, delivered globally with Shopify and DHL Express
          </h1>
          <p>
            Forestal Murillo Tejada ships authentic batana oil, melipona honey, and traditional herbs to the world. The site is
            engineered for international buyers with localized pricing, DHL Express lanes, and 24/7 AI assistance.
          </p>
          <div className="hero__cta-group">
            <a 
              className="hero__cta" 
              href="#global-commerce"
              aria-label="Navigate to global commerce blueprint section"
            >
              Explore global commerce blueprint
            </a>
            <a 
              className="hero__cta hero__cta--ghost" 
              href="#shopify-integration"
              aria-label="Navigate to Shopify readiness section"
            >
              Review Shopify readiness
            </a>
          </div>
        </div>
        <ul aria-label="Highlighted product lines" className="hero__products">
          {PRODUCT_LINES.map((item) => (
            <li key={item.title}>
              <article className="hero-card">
                <div className="hero-card__image">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 45vw, 20vw"
                    loading="lazy"
                    aria-label={`Product image for ${item.title}: ${item.alt}`}
                  />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="global-commerce" id="global-commerce" aria-labelledby="global-commerce-heading">
        <header className="section-header">
          <h2 id="global-commerce-heading">Global-first commerce foundation</h2>
          <p>
            Every touchpoint is built for cross-border trade from day one. Shopify powers the catalog, payments, and checkout while the
            marketing site runs on Next.js for storytelling and SEO.
          </p>
        </header>
        <div className="global-commerce__grid">
          {GLOBAL_HIGHLIGHTS.map((highlight) => (
            <article className="global-card" key={highlight.title}>
              <p className="global-card__eyebrow" aria-label={`Feature category: ${highlight.emphasis}`}>{highlight.emphasis}</p>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="localization" aria-labelledby="localization-heading">
        <div className="localization__content">
          <div>
            <h2 id="localization-heading">Currency strategy anchored in USD</h2>
            <p>
              Price all SKUs in USD inside Shopify to simplify accounting and duty declarations. Use localized display prices on the
              storefront so global shoppers can understand value instantly.
            </p>
          </div>
          <CurrencySelector amountUSD={45} />
        </div>
      </section>

      <section className="shipping" aria-labelledby="shipping-heading">
        <div className="shipping__content">
          <div>
            <h2 id="shipping-heading">DHL Express fulfillment clarity</h2>
            <p>
              DHL Express handles every international shipment with pickup from Honduras. Clear delivery times and cost expectations
              increase conversions and reduce support tickets.
            </p>
          </div>
          <ShippingEstimator />
        </div>
      </section>

      <section className="shopify-section" id="shopify-integration" aria-labelledby="shopify-readiness-heading">
        <ShopifyReadiness />
      </section>

      <section className="transparency" aria-labelledby="transparency-heading">
        <div className="transparency__content">
          <h2 id="transparency-heading">Transparent customs &amp; duties policy</h2>
          <p>
            Let customers know at checkout and in post-purchase emails that they are responsible for import duties, VAT, or GST in
            their jurisdiction. Shopify's duties and tax settings, paired with DHL's customs paperwork, remove surprises.
          </p>
          <ul role="list">
            <li>Declare HS codes and product origins in Shopify for automated duty calculations.</li>
            <li>Display duties notice on product pages and in the customer support chatbot knowledge base.</li>
            <li>Provide DHL tracking links immediately after fulfillment so international buyers feel in control.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
