import type { Metadata } from "next";
import Image from "next/image";
import { CurrencySelector } from "../components/CurrencySelector";
import { ShippingEstimator } from "../components/ShippingEstimator";
import { ShopifyReadiness } from "../components/ShopifyReadiness";

const PRODUCT_LINES = [
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

const GLOBAL_HIGHLIGHTS = [
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
      <section className="hero">
        <div className="hero__copy">
          <span className="hero__eyebrow">Exporting Nature Without Borders</span>
          <h1>
            Honduras&apos; ethnobotanical heritage, delivered globally with Shopify and DHL Express
          </h1>
          <p>
            Forestal Murillo Tejada ships authentic batana oil, melipona honey, and traditional herbs to the world. The site is
            engineered for international buyers with localized pricing, DHL Express lanes, and 24/7 AI assistance.
          </p>
          <div className="hero__cta-group">
            <a className="hero__cta" href="#global-commerce">
              Explore global commerce blueprint
            </a>
            <a className="hero__cta hero__cta--ghost" href="#shopify-integration">
              Review Shopify readiness
            </a>
          </div>
        </div>
        <div className="hero__products" aria-hidden="true">
          {PRODUCT_LINES.map((item) => (
            <article key={item.title} className="hero-card">
              <div className="hero-card__image">
                <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 45vw, 20vw" />
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <ul className="hero__products" aria-label="Highlighted product lines">
          {PRODUCT_LINES.map((item) => (
            <li key={item.title}>
              <article className="hero-card">
                <div className="hero-card__image">
                  <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 45vw, 20vw" />
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section id="global-commerce" className="global-commerce">
        <header className="section-header">
          <h2>Global-first commerce foundation</h2>
          <p>
            Every touchpoint is built for cross-border trade from day one. Shopify powers the catalog, payments, and checkout while the
            marketing site runs on Next.js for storytelling and SEO.
          </p>
        </header>
        <div className="global-commerce__grid">
          {GLOBAL_HIGHLIGHTS.map((highlight) => (
            <article key={highlight.title} className="global-card">
              <p className="global-card__eyebrow">{highlight.emphasis}</p>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="localization">
        <div className="localization__content">
          <div>
            <h2>Currency strategy anchored in USD</h2>
            <p>
              Price all SKUs in USD inside Shopify to simplify accounting and duty declarations. Use localized display prices on the
              storefront so global shoppers can understand value instantly.
            </p>
          </div>
          <CurrencySelector amountUSD={45} />
        </div>
      </section>

      <section className="shipping">
        <div className="shipping__content">
          <div>
            <h2>DHL Express fulfillment clarity</h2>
            <p>
              DHL Express handles every international shipment with pickup from Honduras. Clear delivery times and cost expectations
              increase conversions and reduce support tickets.
            </p>
          </div>
          <ShippingEstimator />
        </div>
      </section>

      <section id="shopify-integration" className="shopify-section">
        <ShopifyReadiness />
      </section>

      <section className="transparency">
        <div className="transparency__content">
          <h2>Transparent customs & duties policy</h2>
          <p>
            Let customers know at checkout and in post-purchase emails that they are responsible for import duties, VAT, or GST in
            their jurisdiction. Shopify&apos;s duties and tax settings, paired with DHL&apos;s customs paperwork, remove surprises.
          </p>
          <ul>
            <li>Declare HS codes and product origins in Shopify for automated duty calculations.</li>
            <li>Display duties notice on product pages and in the customer support chatbot knowledge base.</li>
            <li>Provide DHL tracking links immediately after fulfillment so international buyers feel in control.</li>
          </ul>
        </div>
      </section>
import Image from "next/image";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
        textAlign: "center",
        gap: "2rem"
      }}
    >
      <div
        style={{
          maxWidth: "50rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.75rem, 4vw, 3.5rem)",
            lineHeight: 1.05,
            margin: 0,
            color: "#0b3d2e",
            textTransform: "uppercase",
            letterSpacing: "0.08em"
          }}
        >
          Exporting Nature Without Borders
        </h1>
        <p
          style={{
            fontSize: "1.15rem",
            lineHeight: 1.6,
            margin: 0,
            color: "#1f2933"
          }}
        >
          Forestal Murillo Tejada connects the ancestral ethnobotanical heritage of Honduras with the world. Explore batana oil,
          melipona honey, and traditional herbs crafted alongside indigenous communities with full traceability.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
          gap: "1.5rem",
          width: "min(60rem, 100%)"
        }}
      >
        {[
          {
            title: "Batana Oil",
            description: "Ancestral Miskito elixir for hair, skin, and beard care.",
            image: "/images/batana-placeholder.svg",
            alt: "Stylized gradient background representing batana oil"
          },
          {
            title: "Melipona Honey",
            description: "Raw stingless bee honey treasured by the Mayans.",
            image: "/images/melipona-placeholder.svg",
            alt: "Amber gradient background symbolizing melipona honey"
          },
          {
            title: "Traditional Herbs",
            description: "Wildcrafted botanicals preserving sacred Honduran wisdom.",
            image: "/images/herbs-placeholder.svg",
            alt: "Green gradient background suggesting Honduran traditional herbs"
          }
        ].map((item) => (
          <article
            key={item.title}
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "1.5rem",
              padding: "1.5rem",
              boxShadow: "0 18px 36px rgba(31, 41, 51, 0.12)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              border: "1px solid rgba(19, 111, 73, 0.12)"
            }}
          >
            <div
              style={{
                width: "100%",
                position: "relative",
                aspectRatio: "4 / 3",
                borderRadius: "1rem",
                overflow: "hidden",
                background: "#e7e2d5"
              }}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{
                  objectFit: "cover",
                  filter: "grayscale(100%)",
                  opacity: 0.4
                }}
              />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.25rem",
                color: "#0b3d2e"
              }}
            >
              {item.title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "1rem",
                lineHeight: 1.5,
                color: "#425466"
              }}
            >
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
